<template>
  <div>
    <my-table
      title="Daily client visits"
      :loading="loading"
      :data="data"
      row-key="id"
      :pagination.sync="pager"
      @refresh="fetch"
      add-btn-class="hidden"
      :visible-columns="[
        'num',
        'client',
        'inPatients',
        'signalements',
        'totalSales',
        'clinicFees',
        'visitDate',
        'id'
      ]"
    >
      <template #actions>
        <date-input v-if="false" v-model="date" dense label="Pick date" />
        <date-prev-next v-model="date" dense label="Pick date" />
        <div style="width:12px" />
      </template>

      <template #body-cell-client="props">
        <q-td>
          <q-btn
            dense
            flat
            color="primary"
            :label="props.row.client"
            :to="`/app/rooms/vet/signalements/${props.row.clientId}`"
          />
        </q-td>
      </template>

      <template #body-cell-signalements="props">
        <q-td
          align="left"
          v-html="
            props.row.signalements &&
              props.row.signalements != null &&
              props.row.signalements.replaceAll('\n', '<br>')
          "
        >
        </q-td>
      </template>
      <template #body-cell-totalSales="props">
        <q-td
          align="left"
          v-html="
            props.row.totalSales &&
              props.row.totalSales != null &&
              props.row.totalSales.replaceAll('\n', '<br>')
          "
        >
        </q-td>
      </template>
      <template #body-cell-clinicFees="props">
        <q-td
          align="left"
          v-html="
            props.row.clinicFees &&
              props.row.clinicFees != null &&
              props.row.clinicFees.replaceAll('\n', '<br>')
          "
        >
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
  name: "DailyVisits",
  data() {
    return {
      date: new Date(),
      loading: false,
      data: [],
      pager: {
        rowsPerPage: 100,
        page: 1
      }
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
        var res = await this.$api.reports.getVisit(this.date);
        this.data = res.data;
      } catch (error) {
        this.$toastr.error(error);
      }
      this.loading = false;
    }
  }
};
</script>

<style>
.q-table tbody tr {
  vertical-align: top;
}
</style>
