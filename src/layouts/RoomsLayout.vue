<template>
  <q-layout view="hhh Lpr fff" class="room-layout">
    <RoomSelectHeader ref="rselect"> </RoomSelectHeader>
    <q-page-container class="screen-height">
      <transition appear enter-active-class="animated fadeIn">
        <router-view class="no-padding" :key="new Date().getMilliseconds()" />
      </transition>
    </q-page-container>

    <RoomDrawer :mini.sync="mini" class="my-page-drawer" />

    <MadeFooter />
  </q-layout>
</template>

<script>
import MadeFooter from "./components/MadeFooter";
import RoomSelectHeader from "./components/RoomSelectHeader";
import RoomDrawer from "./components/RoomDrawer";

export default {
  name: "RoomsLayout",
  components: {
    MadeFooter,
    RoomSelectHeader,
    RoomDrawer
  },
  data() {
    return {};
  },
  computed: {
    selectedClass() {
      if (!this.$refs.rselect || !this.$refs.rselect.selected) {
        return "bg-primary";
      }
      return this.$refs.rselect.selected.class;
    },
    mini() {
      return this.$store.state.app.miniLeft;
    },
    rooms() {
      return this.$store.state.app.rooms;
    }
  },
  methods: {
    async initHub() {
      await this.$hub.init();

      const self = this;

      // this.$hub.on("clientAdded", client => {
      //   // console.log("clientAdded", client);
      //   if (client && client.name) {
      //     self.$toastr.success(
      //       `New client: ${client.name.toUpperCase()} was added by ${
      //         client.createdByName
      //       }`
      //     );
      //   }
      // });

      // this.$hub.on("petAdded", pet => {
      //   // console.log("petAdded", pet);
      //   if (pet && client.name) {
      //     self.$toastr.success(
      //       `New client: ${client.name.toUpperCase()} was added by ${
      //         client.createdByName
      //       }`
      //     );
      //   }
      // });

      // this.$hub.on("petBoarded", ({ petName, byUser }) => {
      //   console.log("petBoarded", petName, byUser);
      // });
    }
  },
  mounted() {
    this.$api.animalTypes.get();
    this.$api.categories.get();
    this.$api.units.get();

    if (this.$q.screen.lt.md) {
      this.$store.commit("app/toggleMiniLeft", false);
    }

    this.$store.commit(
      "app/selectedRoom",
      this.rooms.find(
        x => x.id === (this.$q.localStorage.getItem("defaultRoom") || "fd")
      )
    );
    this.initHub();
  }
};
</script>
<style lang="scss" scoped>
.my-page-toolbar,
::v-deep .my-page-drawer .q-drawer {
  z-index: 1;
}

.my-page-toolbar::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  // background: #8f7f62;
  // filter: blur(37px);
  height: 100%;
  z-index: -1;
}

// ::v-deep .my-page-drawer .q-drawer {
//   background: rgba(211, 169, 95, 0.8);
//   background: blue;
//   // background-image: url(/images/pattern1.png);
// }

// ::v-deep .my-page-drawer .q-drawer::before {
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: red;
//   background-image: url(/images/pattern1.png);
//   filter: blur(25px);
// }

// ::v-deep .my-page-drawer .q-drawer:hover {
//   background: rgba(211, 169, 95, 1);
// }

.room-layout {
  // background-image: url(/images/pattern1.png);
  background-repeat: repeat;
  background-position: -42px -129px;
}
</style>
