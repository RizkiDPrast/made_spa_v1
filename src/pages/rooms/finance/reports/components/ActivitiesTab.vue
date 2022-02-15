<template>
  <div>
    <my-table
      title="Employee activities"
      :loading="loading"
      :data="data"
      row-key="id"
      :pagination.sync="pager"
      @refresh="fetch"
      add-btn-class="hidden"
      :visible-columns="visible"
      :columns="columns"
      :filter.sync="filter"
      table-class="mtable"
    >
      <template #actions>
        <date-input v-if="false" v-model="date" dense label="Pick date" />
        <date-prev-next v-model="date" dense label="Pick date" />
        <div style="width:12px" />
      </template>
      <template #body-cell-employee="props">
        <q-td>
          <q-btn
            icon="las la-filter"
            no-caps
            size="sm"
            flat
            @click="filter = props.row.employee"
          >
            {{ props.row.employee }}
            <q-tooltip v-if="$q.screen.gt.sm">
              Buat filter dengan nama ini
            </q-tooltip>
          </q-btn>
        </q-td>
      </template>
      <template #body-cell-pet="props">
        <q-td align="left">
          <q-btn
            flat
            size="13px"
            rounded
            color="accent"
            no-caps
            :to="`/app/rooms/vet/signalements/${props.row.clientId}`"
          >
            {{ props.row.clientCode }}
          </q-btn>

          <q-btn
            flat
            size="13px"
            rounded
            color="primary"
            no-caps
            :to="
              `/app/rooms/vet/signalements/${props.row.clientId}/${props.row.petId}`
            "
          >
            {{ props.row.pet }}
          </q-btn>
        </q-td>
      </template>
    </my-table>
  </div>
</template>

<script>
import DateInput from "src/components/DateInput.vue";
import DatePrevNext from "src/components/DatePrevNext.vue";
export default {
  components: { DateInput, DatePrevNext },
  name: "ActivitiesTab",
  data() {
    return {
      date: new Date(),
      loading: false,
      data: [],
      filter: undefined,
      pager: {
        rowsPerPage: 100,
        page: 1
      },
      columns: [
        {
          name: "userId",
          field: "userId",
          label: "#",
          format: (val, row) => this.data.indexOf(row) + 1
        },
        {
          name: "employee",
          field: "employee",
          label: "Employee",
          align: "left"
        },
        {
          name: "pet",
          field: "pet",
          label: "Pet",
          align: "left"
        },
        {
          name: "clinicScore",
          field: "clinicScore",
          label: "Clinic Score",
          format: val =>
            val && val !== null && val !== 0 ? val.toFixed(2) : ""
        },
        {
          name: "assistanceScore",
          field: "assistanceScore",
          label: "Assistance Score",
          format: val =>
            val && val !== null && val !== 0 ? val.toFixed(2) : ""
        },
        {
          name: "groomingScore",
          field: "groomingScore",
          label: "Grooming Score",
          format: val =>
            val && val !== null && val !== 0 ? val.toFixed(2) : ""
        },
        {
          name: "clinicFee",
          field: "clinicFee",
          label: "Cinic Fee",
          format: val => this.$options.filters.money(val)
        }
      ],
      visible: [
        "userId",
        "employee",
        "pet",
        "clinicScore",
        "assistanceScore",
        "groomingScore",
        "clinicFee"
      ]
    };
  },
  mounted() {
    this.fetch();
  },
  watch: {
    date() {
      this.fetch();
    }
  },
  methods: {
    async fetch() {
      if (this.loading) return;
      this.loading = true;
      try {
        var res = await this.$api.reports.getActivity(this.date);
        this.data = res.data;
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    }
  }
};
</script>
