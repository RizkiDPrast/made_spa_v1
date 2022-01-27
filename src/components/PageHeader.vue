<template>
  <div>
    <q-toolbar
      class="my-page-toolbar bg-primary text-white q-mb-md"
      style="position:sticky;top:12px;border-radius:25px;filter: drop-shadow(2px 4px 6px black);"
    >
      <slot name="left-action">
        <!-- <q-btn
          v-if="!isRoot"
          icon="las la-arrow-left"
          flat
          round
          @click="back"
        /> -->
        <!-- <q-btn
          v-if="isRoot || $q.screen.gt.sm"
          icon="las la-bars"
          flat
          round
          @click="toggleAppDrawer"
        /> -->

        <q-btn
          flat
          round
          dense
          :icon="mini ? 'las la-window-maximize' : 'las la-window-minimize'"
          @click="toggleDrawer"
        />
      </slot>
      <slot>
        <q-toolbar-title class="text-center">
          {{ title || $route.meta.title }}
        </q-toolbar-title>

        <template v-if="$q.screen.gt.sm">
          <calendar-btn />
          <slot name="actions">
            <!-- <q-btn flat round dense icon="las la-ellipsis-v" /> -->
          </slot>
        </template>
        <template v-else>
          <q-btn icon="las la-ellipsis-v" flat round>
            <q-menu>
              <q-list>
                <calendar-btn />
                <slot name="actions">
                  <!-- <q-btn flat round dense icon="las la-ellipsis-v" /> -->
                </slot>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
      </slot>
    </q-toolbar>
    <validation-summary
      :value="$store.state.errors"
      @input="$store.commit('clearErrors')"
    />
  </div>
</template>
<script>
export default {
  name: "page-header",
  props: {
    title: {
      type: String,
      default: () => undefined
    }
  },
  methods: {
    toggleDrawer() {
      this.$store.commit("app/toggleMiniLeft");
    }
  },
  computed: {
    mini() {
      return this.$store.state.app.miniLeft;
    },
    isRoot() {
      return this.$route.path === "" || this.$route.path === "";
    }
  }
};
</script>
