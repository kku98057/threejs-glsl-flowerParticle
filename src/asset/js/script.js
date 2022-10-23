import * as THREE from "three";
import vertex from "../shaders/vertexParticle.glsl";
import fragment from "../shaders/fragment.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "dat.gui";
import t from "../img/video-01-first.jpg";
export default class App {
  constructor() {
    this.renderer = new THREE.WebGLRenderer();
    this.container = document.querySelector(".webgl");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio >= 2 ? 2 : 1);
    this.container.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      3000
    );
    this.camera.position.set(0, 0, 1500);
    this.time = 0;
    this.scene.add(this.camera);

    new OrbitControls(this.camera, this.renderer.domElement);

    this.addMesh();
    this.setLight();
    this.setResize();
    this.settings();
    this.render();
  }
  settings() {
    let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }
  setLight() {
    this.color = 0xffffff;
    this.intensity = 1;
    this.light = new THREE.DirectionalLight(this.color, this.intensity);
    this.scene.add(this.light);
  }
  addMesh() {
    let number = 512 * 512;

    // this.coordnates = new THREE.BufferAttribute(new Float32Array(number, 3));

    this.geo = new THREE.PlaneGeometry(480 * 1.5, 820 * 1.5, 480, 820);
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable",
      },
      side: THREE.DoubleSide,
      uniforms: {
        progress: {
          type: "f",
          value: 0,
        },
        resolution: {
          type: "v4",
          value: new THREE.Vector4(),
        },
        time: {
          type: "f",
          value: 0,
        },
        t: {
          type: "f",
          value: new THREE.TextureLoader().load(t),
        },
      },
      // wireframe: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });
    // this.material = new THREE.PointsMaterial({
    //   size: 0.1,
    //   color: 0xffffff,
    // });

    this.mesh = new THREE.Points(this.geo, this.material);
    console.log(this.geo);
    this.scene.add(this.mesh);
  }
  setResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }
  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
  update() {
    this.time += 0.05;
    // this.mesh.rotation.x = this.time;
    // this.mesh.rotation.y = this.time;
  }
  render() {
    this.renderer.render(this.scene, this.camera);
    this.update();
    requestAnimationFrame(this.render.bind(this));
  }
}
