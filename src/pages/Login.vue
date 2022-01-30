<template>
  <transition
    appear
    enter-active-class="animated bounceInUp slower"
    leave-active-class="animated fadeOut slower"
  >
    <div
      class="window-height row items-center text-center justify-center col-6 col-sm-12"
    >
      <my-circular-progress v-if="initLoading" />
      <q-card
        v-else
        key="content"
        class="my-card col-4 col-xs-10"
        style="max-width:400px;"
      >
        <q-toolbar
          class="q-pb-md"
          style="background-image: linear-gradient(81deg, rgb(201, 178, 34), rgb(148 114 168) 0%)"
        >
          <q-avatar size="6em">
            <img src="/favicon.png" />
          </q-avatar>
          <q-toolbar-title>
            <span class="letters-logo">
              <i class="text-negative"> M.</i><i class="text-positive">A.</i
              ><i class="text-warning">D.</i><i class="text-primary">E</i>
            </span>
            <div class="line-logo-letters-separator" />

            <span class="letters-sub-logo">
              <span class="text-positive">Pets </span>
              <span class="text-primary">Care</span>
            </span>
          </q-toolbar-title>
        </q-toolbar>
        <q-toolbar class="bg-accent">
          <q-item-section>
            <q-item-label class="text-white">
              Please login using your credential below
            </q-item-label>
          </q-item-section>
        </q-toolbar>

        <q-card-section class="ma-sm bg-white">
          <q-form class="q-gutter-md" @submit="onSubmit">
            <!-- <q-avatar size="5rem"> -->
            <!-- <img src="statics/app-logo-128x128.png" /> -->

            <!-- </q-avatar> -->
            <validation-summary
              :value="$store.state.errors"
              @input="$store.commit('clearErrors')"
            />

            <q-input
              v-model="name"
              v-validate="'required'"
              outlined
              rounded
              label="Username *"
              name="username"
              hint=""
              :error="errors.has('username')"
              :error-message="errors.first('username')"
            >
              <template #prepend>
                <q-icon name="las la-user-tie" />
              </template>
            </q-input>

            <q-input
              v-model="password"
              v-validate="'required'"
              outlined
              rounded
              type="password"
              label="Password *"
              name="password"
              :error="errors.has('password')"
              :error-message="errors.first('password')"
            >
              <template #prepend>
                <q-icon name="las la-key" />
              </template>
            </q-input>

            <div class="text-left" style="margin-top:0">
              <q-checkbox
                name="rememberMe"
                v-model="rememberMe"
                label="Remember Me"
              />
            </div>
            <div>
              <submit-button :is-loading="loading">
                Login
              </submit-button>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions vertical align="center" />
      </q-card>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      initLoading: false,
      loading: false,
      name: null,
      password: null,
      rememberMe: false,
      errorMessages: []
    };
  },
  computed: {},
  mounted() {
    if (!this.$store.state.app.loaded) {
      this.initLoad();
    }
  },
  methods: {
    async initLoad() {
      try {
        if (this.initLoading) return;
        this.initLoading = true;

        var res = await this.$api.auth.get();
        // var res = await new Promise(res => {
        //   setTimeout(() => {
        //     res({ code: 200, data: { userName: "admmin", email: "admmin" } });
        //   }, 5000);
        // });
        if (res.status < 300) {
          this.$store.commit("auth/login", res.data);
        } else {
          this.$toastr.warning(res.statusText);
        }
      } catch (e) {}
      this.initLoading = false;
      this.$store.commit("app/loaded");

      if (this.$store.getters["auth/loggedIn"]) {
        if (this.$store.state.returnTo) {
          this.$router.replace(this.$store.state.returnTo);
        } else {
          this.$router.replace("/app/rooms");
        }
      }
    },
    async onSubmit() {
      if (!(await this.$validator.validateAll())) {
        return;
      }
      if (this.loading) return;
      this.loading = true;

      try {
        var res = await this.$api.auth.login({
          username: this.name,
          password: this.password,
          rememberMe: this.rememberMe
        });
        this.$store.commit("auth/login", res.data);
        console.log("returnTo", this.$store.state.returnTo);
        if (this.$store.state.returnTo) {
          this.$router.replace(this.$store.state.returnTo);
        } else {
          this.$router.replace("/app/rooms");
        }
      } catch (e) {
        this.$toastr.error(e);
      }

      this.loading = false;
    }
  }
};
</script>

<style lang="sass" scoped>
.letters-logo
  padding: 5px 15px 0 5px
  font-size: 1.5em

.letters-sub-logo
  padding: 0 15px 5px 5px
  font-size: 0.8em

.letters-sub-logo span
  font-style: italic

.letters-logo i
    font-family: 'MochiyPopOne-Regular'
    text-shadow: 1px 1px 1px white

.line-logo-letters-separator
  margin-top: -3px
  margin-bottom: -3px
  height: 5px
  width: 100%
  border-radius: 25px
  background-image: linear-gradient(45deg, $negative, $positive, $warning, $primary)

.my-toolbar
  background-image: $lin-bg-dark

@media screen and (min-width: $breakpoint-md)
  #logo
    width: 80px
    height: 80px

  .letters-logo
    font-size: 2em

  .letters-sub-logo
    font-size: 1.2em
</style>
