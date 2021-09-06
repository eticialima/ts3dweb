import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'; 
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {
	AmbientLight,
	CubeTextureLoader,
	DirectionalLight,
	PerspectiveCamera,
	Raycaster,
	sRGBEncoding,
	Vector2
} from "three";
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
@Component({
  selector: 'app-shadow',
  templateUrl: './shadow.component.html',
  styleUrls: ['./shadow.component.css'],
})
export class ShadowComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.main();
  }
  
  reRender() {
    const event = new Event('resize');
    setTimeout(() => {
      dispatchEvent(event);
    });
  }
 
  main() { 
    const gltfLoader = new GLTFLoader()     
    const scene = new THREE.Scene();   
   
    const container = document.querySelector( '.canvas' );   
    document.styleSheets[0].insertRule('canvas { outline:none; border:none; }', 0);  
	  
     //Camera setup
    const aspect = container.clientWidth / container.clientHeight; 
    const camera = new THREE.PerspectiveCamera( 55, aspect, 1, 1000 );  
    camera.position.x = -12;
    camera.position.z = 1;
    camera.position.y = 1;
    scene.add(camera)

    // Light 
    const ambientLight = new AmbientLight(0x323232);
		const mainLight = new DirectionalLight(0xffffff, 1.0);
		mainLight.position.set(-12, 1, 1);
		scene.add(ambientLight, mainLight);
  
    const light = new THREE.DirectionalLight(0x000000, 1);
    light.position.set(50, 50, 10);
    scene.add(light);

    const plight = new THREE.PointLight( 0x6ce0ff, 2, 100 );
    plight.position.set( 50, 50, 50 );
    scene.add( plight );

    const lightProbe = new THREE.LightProbe();
	  scene.add( lightProbe );
  
    //Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance", }) 
    renderer.setSize(container.clientWidth, container.clientHeight) 
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) 
    container.appendChild(renderer.domElement) 
    renderer.shadowMap.enabled = true;   
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;   
    // tone mapping
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;   
    
    //Load Model
    gltfLoader.load('../../assets/untitled.gltf', (gltf) => { 
      gltf.scene.scale.set(5, 5, 5)
      gltf.scene.rotation.set(0, -1, 0)
      gltf.scene.position.set(1, -4, 1)   
      scene.add(gltf.scene) 
    }) 
     
    // Controls Livre 
    const controls = new OrbitControls( camera, renderer.domElement ); 
    controls.target.set( 1, 1, 1 );
    controls.enableZoom = false
    controls.enablePan = false  
    controls.update();
  
    const clock = new THREE.Clock() 
        
    const tick = () => {    
        controls.update() 
        renderer.render(scene, camera) 
        window.requestAnimationFrame(tick)
    } 
    tick()   
  } 
}
