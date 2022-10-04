/*
Author: LanHao
Time: 10/4/2022 22:30:56
*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";

export default function loadScene(store) {
  store.commit("setTitle", "猴🐒");
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
    75,
    window.innerWidth / window.innerHeight,
    3,
    1000
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 200;
  document.getElementById("displayArea").innerHTML = "";
  document.getElementById("displayArea").appendChild(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  // const light3 = new THREE.AmbientLight(0x404040); // soft white light
  // scene.add(light3);
  const loader = new FBXLoader(manager);
  const light = new THREE.PointLight(new THREE.Color(255, 255, 255), 0.0002, 0);
  light.position.set(0, 2, 70);
  light.castShadow = true;
  scene.add(light);

  const light2 = new THREE.PointLight(new THREE.Color(200, 200, 200), 0.008, 0);
  light2.position.set(0, 0, -20);
  light2.castShadow = true;
  scene.add(light2);

  loader.load(
    "./assets/monkeyhead.fbx",
    function (object) {
      scene.add(object);
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
