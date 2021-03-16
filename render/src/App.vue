<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import {isElectron, getAppConfig} from "./utils/electron";

  export default {
    name: "app",
    async created() {
      if (isElectron) {
        const appConfig = await getAppConfig();
        console.log(appConfig);
        this.$store.commit('UPDATE_ELECTRON_CONFIG', appConfig);
      }
    }
  }
</script>

<style scoped>

</style>
