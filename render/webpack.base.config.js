const path = require('path');
// 新版本的 vue-loader 必须使用这个插件
const {VueLoaderPlugin} = require('vue-loader');

//
module.exports = {

  // resolve
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },

  // plugins
  plugins: [new VueLoaderPlugin()]
};
