/*
Author: LanHao
Time: 10/4/2022 22:30:56
*/
import * as THREE from "three";
import * as GaussianSplats3D from "@mkkellogg/gaussian-splats-3d";

export default function loadScene(store) {
  store.commit("setTitle", "板凳上的我");
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

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    500
  );
  camera.position.copy(new THREE.Vector3().fromArray([0, -0.5, -3]));
  camera.up = new THREE.Vector3().fromArray([0, -1, 0]).normalize();
  camera.lookAt(new THREE.Vector3().fromArray([0, -3, 2]));

  document.getElementById("displayArea").innerHTML = "";
  document.getElementById("displayArea").appendChild(renderer.domElement);

  const viewer = new GaussianSplats3D.Viewer({
    selfDrivenMode: false,
    renderer: renderer,
    camera: camera,
    useBuiltInControls: true,
    ignoreDevicePixelRatio: false,
    gpuAcceleratedSort: true,
    halfPrecisionCovariancesOnGPU: true,
    sharedMemoryForWorkers: true,
    integerBasedSort: true,
    dynamicScene: false,
    webXRMode: GaussianSplats3D.WebXRMode.None,
    renderMode: GaussianSplats3D.RenderMode.OnChange,
    sceneRevealMode: GaussianSplats3D.SceneRevealMode.Instant,
    antialiased: false,
    focalAdjustment: 1.0,
    logLevel: GaussianSplats3D.LogLevel.None,
    sphericalHarmonicsDegree: 2,
  });
  viewer
    .addSplatScene("./assets/sit.ksplat", {
      streamView: true,
    })
    .then(() => {
      store.commit("setLoading", false);

      function update() {
        requestAnimationFrame(update);

        viewer.update();
        viewer.render();
      }
      requestAnimationFrame(update);
    });
}
