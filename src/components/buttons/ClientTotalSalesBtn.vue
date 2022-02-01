<template>
  <span>
    <q-btn
      icon="las la-cash-register"
      @click="open"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <q-tooltip content-class="bg-primary">
        Manage Client Total Sales
      </q-tooltip>
    </q-btn>

    <q-dialog v-model="modal" persistent full-width full-height maximized>
      <q-card>
        <q-toolbar class="bg-secondary text-white">
          <q-toolbar-title>
            Manage client total sales
          </q-toolbar-title>
          <q-btn
            flat
            round
            text-color="white"
            icon="las la-times"
            v-close-popup
          />
        </q-toolbar>
        <q-card-section class="row">
          <div
            class="col-xs-12 col-md-8"
            :class="$q.screen.gt.sm ? 'q-pa-sm' : ''"
          >
            <my-table
              :title="`Client: ${client.code} - ${client.name}`"
              :loading="loading"
              :data="data"
              :columns="columns"
              row-key="id"
              :pagination.sync="pager"
              :filter="filter"
              @refresh="refresh"
              @request="fetch"
              @delete="del"
              @add="add"
              @edit="edit"
            >
              <template #bottom-row>
                <q-tr class="bg-grey-3">
                  <q-td colspan="4" align="center"> . . . </q-td>
                </q-tr>
                <q-tr class="bg-grey-3" style="height:51px;">
                  <q-td colspan="2" class="text-center q-pa-md">
                    Total sales from {{ client.code }} - {{ client.name }}
                  </q-td>
                  <q-td class="text-bold" align="right">
                    {{ grandTotal | money }}
                  </q-td>
                  <q-td> </q-td>
                </q-tr>
              </template>
            </my-table>
          </div>
          <div class="gt-sm col-md-4 q-pa-sm">
            <q-card class="my-card">
              <q-toolbar>
                <q-toolbar-title>
                  Add / Edit
                </q-toolbar-title>
              </q-toolbar>
              <q-card-section>
                <q-form @submit="save">
                  <money-field
                    outlined
                    dense
                    ref="total"
                    label="Total"
                    name="total"
                    v-model="m2.total"
                    v-validate="'required|min_value:500'"
                    :error="errors.has('total')"
                    :error-message="errors.first('total')"
                  />
                  <q-input
                    ref="notes"
                    v-model="m2.notes"
                    name="notes"
                    class=""
                    v-validate="'required|max:50'"
                    :error="errors.has('notes')"
                    :error-message="errors.first('notes')"
                    outlined
                    label="Notes"
                    autocomplete="off"
                    dense
                  />

                  <q-btn
                    type="submit"
                    :loading="loading"
                    icon="las la-save"
                    label="Save"
                    title="Save"
                    text-color="white"
                    class="full-width"
                    color="primary"
                    :disable="loading"
                    @click.stop="save"
                  />
                </q-form>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
        <q-dialog v-if="$q.screen.lt.md" v-model="modal1">
          <q-card class="full-width">
            <q-toolbar>
              <q-toolbar-title>
                Add / Edit
              </q-toolbar-title>
              <q-btn icon="las la-times" v-close-popup flat />
            </q-toolbar>
            <q-card-section>
              <q-form @submit="save">
                <money-field
                  outlined
                  dense
                  ref="total"
                  label="Total"
                  name="total"
                  v-model="m2.total"
                  v-validate="'required|min_value:500'"
                  :error="errors.has('total')"
                  :error-message="errors.first('total')"
                />
                <q-input
                  ref="notes"
                  v-model="m2.notes"
                  name="notes"
                  class=""
                  v-validate="'required|max:50'"
                  :error="errors.has('notes')"
                  :error-message="errors.first('notes')"
                  outlined
                  label="Notes"
                  autocomplete="off"
                  dense
                />

                <q-btn
                  type="submit"
                  :loading="loading"
                  icon="las la-save"
                  label="Save"
                  title="Save"
                  text-color="white"
                  class="full-width"
                  color="primary"
                  :disable="loading"
                  @click.stop="save"
                />
              </q-form>
            </q-card-section>
          </q-card>
        </q-dialog>
      </q-card>
    </q-dialog>
  </span>
</template>

<script>
import Client from "src/models/Client";
import MoneyField from "../MoneyField.vue";
export default {
  components: { MoneyField },
  props: {
    client: {
      type: [Object, Client],
      default: () => new Client()
    }
  },
  computed: {},
  data() {
    return {
      modal: false,
      m2: {},
      loading: false,
      data: [],
      columns: [
        {
          name: "action",
          label: "Action",
          field: "action",
          width: "25px",
          align: "center"
        },
        {
          name: "notes",
          label: "Notes",
          field: "notes",
          align: "left",
          sortable: true
        },
        {
          name: "total",
          label: "Total",
          field: "total",
          align: "right",
          sortable: true,
          format: val => this.$options.filters.money(val)
        },
        {
          name: "createdat",
          label: "Created At",
          field: "createdAt",
          align: "left",
          sortable: true,
          format: val => this.$util.toDateString(val)
        }
      ],
      pager: {
        page: 1,
        rowsPerPage: 25
      },
      filter: undefined,
      grandTotal: undefined,
      modal1: false
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    open() {
      this.modal = true;
    },
    async save() {
      if (!(await this.$validator.validate())) {
        return;
      }

      if (this.loading) return;
      this.loading = true;
      let res;
      try {
        if (this.m2.id > 0) {
          res = await this.$api.totalSales.put(this.m2);
        } else {
          this.m2.clientId = this.client.id;
          res = await this.$api.totalSales.post(this.m2);
        }
        this.$toastr.success("Record was updated");
        this.loading = false;
        this.closeModalIfRequired();
        this.fetch();
      } catch (error) {
        this.loading = false;
        this.$toastr.error(error);
      }
    },
    refresh() {
      this.fetch(this.pager);
    },
    async fetch(pager) {
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      try {
        // var res = await this.$api.totalSales.get(pager);
        // this.data = res.data.rows;
        // this.loading = false;
        // return;

        pager.clientId = this.client?.id || 0;
        const res = await this.$api.totalSales.get(pager);
        const dt = res.data;
        this.data = dt.rows.map(x => x);

        dt.sortColumns = dt.sortColumns.map(x => x.toLowerCase());
        this.columns = this.columns.map(x => {
          return Object.assign({}, x, {
            sortable: dt.sortColumns.indexOf(x.field.toLowerCase()) > -1
          });
        });

        this.grandTotal = dt.customValue;

        this.pager.rowsNumber = dt.rowsNumber;
        this.pager.page = dt.page;
        this.pager.sortBy = dt.sortBy;
        this.pager.descending = dt.descending;
        this.pager.rowsPerPage = dt.rowsPerPage;
      } catch (e) {
        this.$toastr.error(e);
      }
      this.loading = false;
    },
    openModalIfRequired() {
      if (this.$q.screen.lt.md) {
        this.modal1 = true;
      } else {
        this.modal1 = false;
      }
    },
    closeModalIfRequired() {
      this.modal1 = false;
    },
    focus() {
      this.$refs.total.$el.focus();
    },
    add() {
      this.m2 = {};
      this.openModalIfRequired();
      this.focus();
    },
    edit(id) {
      let t = this.data.find(x => x.id === id);
      if (!t) {
        throw "Could not find details record. Please refresh table";
      }
      this.m2 = Object.assign({}, t);
      this.openModalIfRequired();
      this.focus();
    },
    async del(id) {
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.totalSales.delete(id);
        if (res.status < 300) {
          this.data = this.data.filter(val => val.id !== id);
          this.$toastr.success("Record was deleted");
        }
      } catch (e) {
        this.$toastr.error(e);
      }

      this.loading = false;
    }
  }
};
</script>
