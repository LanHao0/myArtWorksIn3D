const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
});

module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/myArtWorksIn3D/" : "/",
  configureWebpack: () => {
    if (process.env.NODE_ENV === "production") {
      return {
        externals: {
          vue: "Vue",
          "vue-router": "VueRouter",
          vuex: "Vuex",
        },
      };
    }
  },
};
