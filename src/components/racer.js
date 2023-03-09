/*
Author: LanHao
Time: 10/4/2022 11:48:43
*/
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader";
import { VRButton } from "three/addons/webxr/VRButton";
import { XRControllerModelFactory } from "three/addons/webxr/XRControllerModelFactory";

let renderer;
let controller1, controller2, controllerGrip2, controllerGrip1;
let obj = null;
let selectStart;
function onSelectStart() {
  // const controller = event.target;
  //todo 移动位置
}
function onSelectStart2() {
  // const controller = event.target;
  obj.rotation.y -= 0.1;
  selectStart = setInterval(() => {
    obj.rotation.y -= 0.1;
  }, 100);
}

function onSelectEnd() {
  clearInterval(selectStart);
  // const controller = event.target;
}

function onSqueezeEvent(event) {
  switch (event.type) {
    case "squeezestart":
      selectStart = setInterval(() => {
        obj.scale.x += 0.1;
        obj.scale.y += 0.1;
        obj.scale.z += 0.1;
      }, 100);
      break;
    case "squeezeend":
      clearInterval(selectStart);
      break;
  }
}

function onSqueezeEvent2(event) {
  switch (event.type) {
    case "squeezestart":
      selectStart = setInterval(() => {
        obj.scale.x -= 0.1;
        obj.scale.y -= 0.1;
        obj.scale.z -= 0.1;
      }, 100);
      break;
    case "squeezeend":
      clearInterval(selectStart);
      break;
  }
}
export default function loadScene(store) {
  store.commit("setTitle", "异次元赛车手");
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
  renderer = new THREE.WebGLRenderer();
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
  document.getElementById("displayArea").innerHTML = "";
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
    process.env.VUE_APP_3D_MODELS_CDN + "lanhao1.gltf",
    function (gltf) {
      obj = gltf.scene;
      scene.add(obj);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
  document.body.appendChild(VRButton.createButton(renderer)); // 添加VR按钮
  renderer.xr.enabled = true;

  // renderer.xr.addEventListener(
  //   "sessionstart",
  //   () => (baseReferenceSpace = renderer.xr.getReferenceSpace())
  // );
  controller1 = renderer.xr.getController(0);
  controller1.addEventListener("selectstart", onSelectStart);
  controller1.addEventListener("selectend", onSelectEnd);
  scene.add(controller1);
  controller1.addEventListener("squeezestart", onSqueezeEvent2);
  controller1.addEventListener("squeezeend", onSqueezeEvent2);

  controller2 = renderer.xr.getController(1);
  controller2.addEventListener("selectstart", onSelectStart2);
  controller2.addEventListener("selectend", onSelectEnd);

  controller2.addEventListener("squeezestart", onSqueezeEvent);
  controller2.addEventListener("squeezeend", onSqueezeEvent);

  scene.add(controller2);

  const controllerModelFactory = new XRControllerModelFactory();

  controllerGrip1 = renderer.xr.getControllerGrip(0);
  controllerGrip1.add(
    controllerModelFactory.createControllerModel(controllerGrip1)
  );
  scene.add(controllerGrip1);

  controllerGrip2 = renderer.xr.getControllerGrip(1);
  controllerGrip2.add(
    controllerModelFactory.createControllerModel(controllerGrip2)
  );
  scene.add(controllerGrip2);
  const geometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, -1),
  ]);

  const line = new THREE.Line(geometry);
  line.name = "line";
  line.scale.z = 5;

  controller1.add(line.clone());
  controller2.add(line.clone());

  renderer.setAnimationLoop(function () {
    renderer.render(scene, camera);
  });
}
