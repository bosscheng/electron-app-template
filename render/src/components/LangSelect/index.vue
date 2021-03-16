<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language"/>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'" command="zh" class="international-item">中文</el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'" command="en" class="international-item">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import {mapState} from 'vuex';
  import {isElectron, switchLanguage} from "../../utils/electron";

  export default {
    computed: {
      ...mapState({
        language: state => state.language,
      }),
    },
    methods: {
      handleSetLanguage(lang) {
        this.$i18n.locale = lang;
        this.$store.commit('SET_LANGUAGE', lang);
        let msg = lang === 'zh' ? '语言切换成功！' : 'Switch Language Success!';
        // message 提示。
        this.$message({
          message: msg,
          type: 'success'
        });

        if (isElectron) {
          switchLanguage(lang);
        }
      }
    }
  }
</script>

<style scoped>
  .international-icon {
    font-size: 20px;
    cursor: pointer;
    vertical-align: -5px !important;
  }

  .international-item {
    line-height: 22px;
  }
</style>

