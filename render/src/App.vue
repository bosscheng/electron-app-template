<template>
  <div id="app">
    <router-view></router-view>
    <el-dialog
      title="关于"
      :visible.sync="dialogVisible"
      width="30%">
      <span>这是个关于页面。。。。。。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {isElectron, getAppConfig, addEventListener, EVENTS} from "./utils/electron";

  export default {
    name: "app",
    data() {
      return {
        dialogVisible: false
      }
    },
    async created() {
      if (isElectron) {
        const appConfig = await getAppConfig();
        console.log(appConfig);
        this.$store.commit('UPDATE_ELECTRON_CONFIG', appConfig);
        //
        addEventListener(EVENTS.openSetting, () => {
          this.dialogVisible = true;
        })
      }
    },
    methods: {}
  }
</script>

<style scoped>

</style>
