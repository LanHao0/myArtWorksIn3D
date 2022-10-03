<template>
  <div>
    <div class="title">
      <h1>我的3D作品 - 异次元赛车手</h1>
      <div v-if="loading">
        <h2>加载中...</h2>
        <h2>{{ downloadProcess }} %</h2>
      </div>
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
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";

export default {
  name: "HomeView",
  components: {},
  data() {
    return {
      loading: true,
      downloadProcess: null,
    };
  },
  mounted() {
    const manager = new THREE.LoadingManager();
    const _this = this;
    manager.onStart = function (url, itemsLoaded, itemsTotal) {
      _this.downloadProcess = ((itemsLoaded / itemsTotal) * 100).toFixed(2);
      console.log(
        "Started loading file: " +
          url +
          ".\nLoaded " +
          itemsLoaded +
          " of " +
          itemsTotal +
          " files."
      );
    };

    manager.onLoad = function () {
      console.log("Loading complete!");
      _this.loading = false;
    };

    manager.onProgress = function (url, itemsLoaded, itemsTotal) {
      _this.downloadProcess = ((itemsLoaded / itemsTotal) * 100).toFixed(2);
      console.log(
        "Loading file: " +
          url +
          ".\nLoaded " +
          itemsLoaded +
          " of " +
          itemsTotal +
          " files."
      );
    };

    manager.onError = function (url) {
      console.log("There was an error loading " + url);
    };

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.x = -2;
    camera.position.z = 5;
    camera.position.y = -1;
    document.getElementById("displayArea").appendChild(renderer.domElement);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    // const light3 = new THREE.AmbientLight(0x404040); // soft white light
    // scene.add(light3);
    const loader = new GLTFLoader(manager);
    const light = new THREE.PointLight(
      new THREE.Color(255, 255 * 0.335, 0),
      0.01,
      12
    );
    light.position.set(3, -2, 2);
    light.castShadow = true;
    scene.add(light);

    const light2 = new THREE.PointLight(
      new THREE.Color(255 * 0.01, 255 * 0.2, 70),
      0.01,
      0
    );
    light2.position.set(-5, -1, 1);
    light2.castShadow = true;
    scene.add(light2);

    loader.load(
      "./assets/lanhao1.gltf",
      function (gltf) {
        scene.add(gltf.scene);
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    animate();
  },
};
</script>
