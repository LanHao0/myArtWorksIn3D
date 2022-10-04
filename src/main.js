import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { createStore } from "vuex";

// 创建一个新的 store 实例
const store = createStore({
  state() {
    return {
      loading: true,
      downloadProcess: 0,
      title: "异次元赛车手",
      current: "racer",
      camera: {
        x: 0,
        y: 0,
        z: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
      },
    };
  },
  mutations: {
    setLoading(state, condition) {
      state.loading = condition;
    },
    setDownloadProcess(state, process) {
      state.downloadProcess = process;
    },
    setTitle(state, name) {
      state.title = name;
    },
    setCurrent(state, current) {
      state.current = current;
    },
    setCamera(state, camera) {
      state.camera = camera;
    },
  },
});

createApp(App).use(router).use(store).mount("#app");
