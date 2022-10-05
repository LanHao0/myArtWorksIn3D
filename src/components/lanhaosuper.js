/*
Author: LanHao
Time: 10/4/2022 11:48:43
*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

export default function loadScene(store) {
  store.commit("setTitle", "我是超人🦸");
  store.commit("setLoading", true);
  const manager = new THREE.LoadingManager();
  manager.onStart = function (url, itemsLoaded, itemsTotal) {
    store.commit("setDownloadProcess", 0);
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
    store.commit("setLoading", false);
  };

  manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    store.commit(
      "setDownloadProcess",
      ((itemsLoaded / itemsTotal) * 100).toFixed(2)
    );
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
    15,
    window.innerWidth / window.innerHeight,
    0.01,
    0
  );
  camera.position.x = 120;
  camera.position.y = 0;
  camera.position.z = 100;
  document.getElementById("displayArea").innerHTML = "";
  document.getElementById("displayArea").appendChild(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  const loader = new FBXLoader(manager);
  const light = new THREE.PointLight(new THREE.Color(200, 255, 50), 0.01, 0);
  light.position.set(3, -2, 2);
  light.castShadow = true;
  scene.add(light);

  const light2 = new THREE.PointLight(
    new THREE.Color(255, 255 * 0.1, 150),
    0.01,
    0
  );
  light2.position.set(-5, -1, 1);
  light2.castShadow = true;
  scene.add(light2);

  loader.load(
    process.env.VUE_APP_3D_MODELS_CDN + "lanhaosuper.fbx",
    function (obj) {
      obj.position.x += 30;
      obj.position.y -= 150;
      scene.add(obj);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    // store.commit("setCamera", {
    //   x: camera.position.x,
    //   y: camera.position.y,
    //   z: camera.position.z,
    //   rotateX: camera.rotation.x,
    //   rotateY: camera.rotation.y,
    //   rotateZ: camera.rotation.z,
    // });
    renderer.render(scene, camera);
  }
  animate();
}
