import * as THREE from "three";
import vertex from "../shaders/vertexParticle.glsl";
import fragment from "../shaders/fragment.glsl";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { gsap } from "gsap";
import dat from "dat.gui";
import t1End from "../img/p.png";
import t2Start from "../img/e.png";

export default class App {
  constructor() {
    this.renderer = new THREE.WebGLRenderer();
    this.container = document.querySelector(".webgl");
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio >= 2 ? 2 : 1);
    this.container.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();

    // this.video1 = document.getElementById("video1");

    // this.video1.play();

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
    this.addPost();
    this.setResize();
    this.settings();
    let once = true;

    const tl1 = gsap.timeline();
    tl1
      .to(
        this.material.uniforms.distortion,
        { delay: 3, value: 3, duration: 2, ease: "power2.inOut" },
        ">-=0.1"
      )
      .to(
        this.bloomPass,
        {
          strength: 10,
          duration: 2,
          ease: "power2.out",
        },
        ">-=2"
      )
      .to(this.material.uniforms.distortion, {
        value: 0,
        duration: 2,
        ease: "power2.inOut",
      })
      .to(
        this.bloomPass,
        {
          strength: 0,
          ease: "power2.out",
          duration: 2,
        },
        ">-=2"
      )
      .to(
        this.material.uniforms.progress,
        {
          value: 1,
        },
        ">-=1.5"
      );

    this.render();
  }
  addPost() {
    this.renderScene = new RenderPass(this.scene, this.camera);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    this.bloomPass.threshold = this.settings.bloomThreshold;
    this.bloomPass.strength = this.settings.bloomStrength;
    this.bloomPass.radius = this.settings.bloomRadius;

    this.composer = new EffectComposer(this.renderer);

    this.composer.addPass(this.renderScene);
    this.composer.addPass(this.bloomPass);
  }
  settings() {
    let that = this;
    this.settings = {
      distortion: 0,
      bloomStrength: 0,
      bloomThreshold: 0,
      bloomRadius: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "distortion", 0, 3, 0.01);
    this.gui.add(this.settings, "bloomStrength", 0, 10, 0.01);
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

    this.geo = new THREE.PlaneGeometry(480 * 1.747, 820 * 1.747, 480, 820);
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
        t1: {
          type: "f",
          value: new THREE.TextureLoader().load(t1End),
        },
        t2: {
          type: "f",
          value: new THREE.TextureLoader().load(t2Start),
        },

        distortion: {
          type: "f",
          value: 0,
        },
      },
      // wireframe: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

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
    this.composer.setSize(window.innerWidth, window.innerHeight);
    this.camera.updateProjectionMatrix();
  }
  update() {
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    // gsap애니메이션 끝나고 재렌더링되기때문에 제거
    // this.material.uniforms.distortion.value = this.settings.distortion;
    // this.bloomPass.strength = this.settings.bloomStrength;
  }
  render() {
    // this.renderer.render(this.scene, this.camera);
    this.composer.render(this.scene, this.camera);
    this.update();
    requestAnimationFrame(this.render.bind(this));
  }
}
