<template>
  <div>
    <div class="title">
      <h1>我的3D作品 {{ title }}</h1>
      <div v-if="loading">
        <h2>加载中...</h2>
        <h2>{{ downloadProcess }} %</h2>
      </div>
      <button @click="toScene('racer')">异次元赛车手</button>
      <button @click="toScene('dushiqi')">创造宇宙的她</button>
      <!--      <div>-->
      <!--        <h3>camera helper</h3>-->
      <!--        <p>position</p>-->
      <!--        <span>{{ camera.x }},</span>-->
      <!--        <span>{{ camera.y }},</span>-->
      <!--        <span>{{ camera.z }}</span>-->

      <!--        <p>rotation</p>-->
      <!--        <span>{{ camera.rotateX }},</span>-->
      <!--        <span>{{ camera.rotateY }},</span>-->
      <!--        <span>{{ camera.rotateZ }}</span>-->
      <!--      </div>-->
    </div>
    <div id="displayArea"></div>
  </div>
</template>
<style scoped>
.title {
  position: absolute;
}
</style>
<script>
import loadScene from "@/components/racer";
import { mapState } from "vuex";
import loadDuScene from "@/components/dushiqi";

export default {
  name: "HomeView",
  components: {},
  computed: mapState({
    title: (state) => state.title,
    loading: (state) => state.loading,
    downloadProcess: (state) => state.downloadProcess,
    current: (state) => state.current,
    camera: (state) => state.camera,
  }),
  data() {
    return {};
  },
  mounted() {
    loadScene(this.$store);
  },
  methods: {
    toScene(name) {
      //以下方法仅供临时使用，复用率差
      if (name === "dushiqi") {
        this.$store.commit("setCurrent", "dushiqi");
        loadDuScene(this.$store);
      } else if (name === "racer") {
        this.$store.commit("setCurrent", "racer");
        loadScene(this.$store);
      }
    },
  },
};
</script>
