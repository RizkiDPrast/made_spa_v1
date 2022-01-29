<template>
  <div>
    <page-header>
      <template #actions>
        <animal-types-btn flat round />
      </template>
    </page-header>
    <my-table
      title="Client list"
      :loading="loading"
      :data="data"
      :columns="columns"
      row-key="id"
      :pagination.sync="pager"
      :filter="filter"
      @request="fetch"
      @delete="del"
      @add="add"
      @edit="edit"
    >
      <template #actions>
        <template v-if="$q.screen.gt.sm">
          <q-input
            :disable="loading"
            v-model="code"
            label="Code"
            dense
            outlined
            clearable
            debounce="1000"
          />
          <animal-type-select
            dense
            outlined
            label="Pet's type"
            v-model="animalTypeId"
          />
          <q-input
            :disable="loading"
            v-model="petName"
            label="Pet name"
            dense
            outlined
            clearable
            debounce="1000"
          />
        </template>
        <template v-else>
          <q-btn
            icon="las la-filter"
            :color="code || animalTypeId || petName ? 'negative' : ''"
            flat
            round
            @click="filterDialog = true"
          />

          <q-dialog v-model="filterDialog">
            <q-card>
              <dialog-header title="Filter clients by" />
              <q-card-section>
                <q-badge color="warning" v-if="code && code !== null" outline>
                  Code: {{ code }}
                  <q-btn
                    round
                    flat
                    size="sm"
                    icon="las la-times"
                    @click="code = null"
                  />
                </q-badge>
                <q-badge
                  color="info"
                  v-if="animalTypeId && animalTypeId !== null"
                  outline
                >
                  Pet's type: {{ getAnimalTypeName(animalTypeId) }}
                  <q-btn
                    size="sm"
                    round
                    flat
                    icon="las la-times"
                    @click="animalTypeId = null"
                  />
                </q-badge>
                <q-badge
                  color="positive"
                  v-if="petName && petName !== null"
                  outline
                >
                  Pet's name: {{ petName }}
                  <q-btn
                    round
                    flat
                    size="sm"
                    icon="las la-times"
                    @click="petName = null"
                  />
                </q-badge>
              </q-card-section>
              <q-card-section class="row q-col-gutter-sm">
                <q-input
                  class="col-12"
                  :disable="loading"
                  v-model="code"
                  label="Code"
                  dense
                  outlined
                  clearable
                  debounce="1000"
                />
                <animal-type-select
                  class="col-12"
                  dense
                  outlined
                  label="Pet's type"
                  v-model="animalTypeId"
                />
                <q-input
                  class="col-12"
                  :disable="loading"
                  v-model="petName"
                  label="Pet name"
                  dense
                  outlined
                  clearable
                  debounce="1000"
                />
              </q-card-section>
            </q-card>
          </q-dialog>
        </template>
      </template>
      <template #body-cell-email="props">
        <q-td>
          <email-btn v-if="props.row.email" :value="props.row.email" />
          {{ props.row.email }}
        </q-td>
      </template>

      <template #body-cell-action="props">
        <td-action
          :id="props.row.id"
          :name="
            props.row.name ||
              props.row.code ||
              props.row.displayName ||
              props.row.userName
          "
          @edit="edit"
          @delete="del"
        >
          <template v-if="$q.screen.gt.sm" #default>
            <q-btn
              round
              text-color="warning"
              size="sm"
              icon="las la-plus"
              :to="`/app/rooms/client-pets/${props.row.id}`"
            >
              <q-tooltip content-class="bg-secondary">
                Add as today visitor
              </q-tooltip>
            </q-btn>

            <client-total-sales-btn
              :client="props.row"
              round
              size="sm"
              text-color="positive"
            />
          </template>
          <template v-else #mobile>
            <q-item v-close-popup>
              <q-btn
                text-color="warning"
                size="sm"
                icon="las la-plus"
                :to="`/app/rooms/client-pets/${props.row.id}`"
                label="Add as today visitor"
                flat
              >
              </q-btn>
            </q-item>
            <q-item>
              <client-total-sales-btn
                :client="props.row"
                size="sm"
                flat
                text-color="positive"
                label="Manage Client Total Sales"
              />
            </q-item>
          </template>
        </td-action>
      </template>
      <template #body-cell-phone="props">
        <q-td>
          <template v-if="props.row.waPhone">
            <wa-btn :value="props.row.waPhone" />
            {{ props.row.waPhone }} <br />
          </template>
          <template v-if="props.row.otherPhones">
            Other phones: {{ props.row.otherPhones }}
          </template>
        </q-td>
      </template>
    </my-table>
  </div>
</template>

<script>
import Client from "src/models/Client";
import ClientTotalSalesBtn from "components/buttons/ClientTotalSalesBtn.vue";
import AnimalTypeSelect from "src/components/AnimalTypeSelect.vue";
import DialogHeader from "src/components/DialogHeader.vue";
export default {
  components: {
    ClientTotalSalesBtn,
    AnimalTypeSelect,
    DialogHeader
  },
  data() {
    return {
      loading: false,
      data: [],
      columns: [
        {
          name: "action",
          label: "action",
          field: "action",
          width: "100px",
          align: "center"
        },
        {
          name: "code",
          label: "Code",
          field: "code",
          align: "left"
        },
        {
          name: "name",
          label: "Name",
          field: "name",
          align: "left"
        },
        {
          name: "email",
          label: "Email",
          field: "email",
          align: "left"
        },
        {
          name: "phone",
          label: "Phone",
          field: "phone",
          align: "left"
        },
        {
          name: "Notes",
          label: "Notes",
          field: "notes",
          align: "left"
        },
        {
          name: "icnumber",
          label: "IC",
          field: "icNumber",
          align: "left"
        },
        {
          name: "address",
          label: "Address",
          field: "address",
          align: "left"
        },
        {
          name: "totalsales",
          label: "Total Sales",
          field: "totalSales",
          align: "right",
          format: val => this.$options.filters.money(val)
        },
        {
          name: "totalpets",
          label: "Count of Pets",
          field: "totalPets",
          align: "right",
          format: val => val
        },
        {
          name: "pets",
          label: "Pets",
          field: "patients",
          align: "left",
          style: "max-width: 100px;white-space: break-spaces;min-width: 80px;",
          format: val => {
            if (val && val !== null && val.length) {
              var pets = val
                .map(x => `${this.getAnimalTypeName(x.animalTypeId)} ${x.name}`)
                .join(", ");
              return pets;
            }
          }
        },
        {
          name: "createdat",
          label: "Created At",
          field: "createdAt",
          align: "left",
          format: val => this.$util.toDateString(val)
        },
        {
          name: "modifiedat",
          label: "Last Modified At",
          field: "modifiedAt",
          align: "left",
          format: val => this.$util.toDateString(val)
        },
        {
          name: "id",
          label: "ID",
          field: "id",
          align: "right",
          format: val => val
        }
      ],
      pager: {
        page: 1,
        orderBy: "modifiedat",
        descending: true,
        rowsPerPage: 25,
        rowsNumber: 0
      },
      filter: undefined,
      code: null,
      animalTypeId: null,
      petName: null,
      filterDialog: false
    };
  },
  mounted() {
    this.fetch();
  },
  watch: {
    code() {
      this.fetch();
    },
    petName() {
      this.fetch();
    },
    animalTypeId() {
      this.fetch();
    }
  },
  methods: {
    async fetch(pager) {
      if (this.loading) return;
      this.loading = true;
      pager = pager?.pagination || this.pager;

      pager.code = this.code;
      pager.petName = this.petName;
      pager.animalTypeId = this.animalTypeId;

      try {
        var res = await this.$api.clients.get(pager);
        var dt = res.data;
        this.data = dt.rows.map(x => new Client(x));

        this.columns = this.columns.map(x => {
          return Object.assign({}, x, {
            sortable: dt.sortColumns.indexOf(x.field.toLowerCase()) > -1
          });
        });

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
    add() {
      //console.log("add");
      this.$router.push({ path: `/app/rooms/client-pets` });
    },
    edit(id) {
      this.$router.push({ path: `/app/rooms/vet/signalements/${id}` });
    },
    async del(id) {
      if (this.loading) return;
      this.loading = true;

      try {
        var res = await this.$api.clients.delete(id);
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
