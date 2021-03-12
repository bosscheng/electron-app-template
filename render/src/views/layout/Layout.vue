<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <app-main></app-main>
      <div class="app-footer">Copyright © 2018-current <strong><a href="http://monibuca.com/"
                                                                  target="_blank">M7s</a></strong> All Rights Reserved.
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from "vuex";
  import {Navbar, Sidebar, AppMain} from './components';
  import ResizeMixin from './mixin/ResizeHandler'

  export default {
    name: "layout",
    components: {
      Navbar,
      Sidebar,
      AppMain //
    },
    mixins: [ResizeMixin],
    computed: {
      ...mapState({
        sidebar: state => state.sidebar,
        device: state => state.device,
      }),
      classObj() {
        return {
          hideSidebar: !this.sidebar.opened,
          withoutAnimation: this.sidebar.withoutAnimation,
          mobile: this.device === 'mobile'
        }
      }
    },
    methods: {
      handleClickOutside() {
        this.$store.dispatch('closeSideBar', {withoutAnimation: false})
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../../../src/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .main-container {
    position: relative;
  }


  .app-footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #ccc;
    font-size: 12px;

    a {
      font-weight: bold;
      color: #999;
    }
  }
</style>
