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
    const canvas: any = document.querySelector('#canvas'); 
    const container = document.getElementById( 'canvas' );
    const scene = new THREE.Scene(); 
    let tl = gsap.timeline()  
	  let directionalLight;


    //Camera 
    const camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 0.1, 100 );
    camera.rotation.y = 45/180*Math.PI;
    camera.position.x = -1;
    camera.position.z = 4;
    camera.position.y = 2;
    scene.add(camera)


    //Scene 
    gltfLoader.load('../../assets/aranha4.gltf', (gltf) => { 
      gltf.scene.scale.set(0.3, 0.3, 0.3)
      gltf.scene.rotation.set(0, 1.1, 0)
      gltf.scene.position.set(0, 1, 0)
      scene.add(gltf.scene) 
    }) 


    // Lights
    const hlight = new THREE.AmbientLight (0x404040,1);
    scene.add(hlight);

    directionalLight = new THREE.DirectionalLight(0xffffff,1);
    directionalLight.position.set(0,1,0);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
 
    const light = new THREE.PointLight(0xc4c4c4,1);
    light.position.set(0,10,1);
    scene.add(light);

    const light2 = new THREE.PointLight(0xc4c4c4,1);
    light2.position.set(1,1,0);
    scene.add(light2);

    const light3 = new THREE.PointLight(0xc4c4c4,1);
    light3.position.set(0,1,-10);
    scene.add(light3);

    const light4 = new THREE.PointLight(0xc4c4c4,1);
    light4.position.set(-1,1,1);
    scene.add(light4);   

    const gridHelper = new THREE.GridHelper( 10, 20, 0x888888, 0x444444 );
    gridHelper.position.set(0, 1.2, 0)
    scene.add( gridHelper );
 
    //Renderer   
    const renderer = new THREE.WebGLRenderer({  
      antialias: true, 
    })
    renderer.setPixelRatio( window.devicePixelRatio );
  	renderer.setSize( window.innerWidth, window.innerHeight ); 
    container.appendChild( renderer.domElement );
 
    // Controls Livre 
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.screenSpacePanning = true;
    controls.minDistance = 5;
    controls.maxDistance = 40;
    controls.target.set( 0, 2, 0 );
    controls.update();
    
    window.addEventListener( 'resize', onWindowResize );
    function onWindowResize() { 
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix(); 
      renderer.setSize( window.innerWidth, window.innerHeight ); 
    }

    const clock = new THREE.Clock() 
        const tick = () => {    
        controls.update() 
        renderer.render(scene, camera) 
        window.requestAnimationFrame(tick)
       } 
        tick() 
        function render() {  
          renderer.render( scene, camera ); 
        }  
        render()
  } 
}
