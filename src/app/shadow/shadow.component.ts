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

  addPlane(scene) {
    const planeSize = 10;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = 4;
    texture.magFilter = THREE.NearestFilter;
    texture.encoding = THREE.sRGBEncoding;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.receiveShadow = true;
    mesh.rotation.x = Math.PI * -0.5; 
    mesh.position.y = 0; 
    scene.add(mesh);
    this.reRender();
  }

  reRender() {
    const event = new Event('resize');
    setTimeout(() => {
      dispatchEvent(event);
    });
  }



  main() {
    const gltfLoader = new GLTFLoader()  
    //const gui = new dat.GUI() 
    const canvas: any = document.querySelector('#canvas'); 
    const scene = new THREE.Scene(); 
    let tl = gsap.timeline() 
    //this.addPlane(scene); 

    let spotLight, lightHelper, shadowCameraHelper;
    let lightProbe;
	  let directionalLight;
			// linear color space
	  const API = {
				lightProbeIntensity: 1.0,
				directionalLightIntensity: 0.2,
				envMapIntensity: 1
			}; 



    //3d  
    gltfLoader.load('../../assets/aranha4.gltf', (gltf) => {

      gltf.scene.scale.set(0.3, 0.3, 0.3)
      gltf.scene.rotation.set(0, 1.1, 0)
      gltf.scene.children[0]; 
      
      scene.add(gltf.scene)

      //gui.add(gltf.scene.rotation, 'x').min(0).max(9)
      //gui.add(gltf.scene.rotation, 'y').min(0).max(9)
      //gui.add(gltf.scene.rotation, 'z').min(0).max(9) 
    })
    // SCENE
    

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



    /*
    scene.background = new THREE.Color( 0x000000 );
    scene.fog = new THREE.Fog( 0x000000, 250, 1400 );
    
    const ambientLight = new AmbientLight(0x323232);
		const mainLight = new DirectionalLight(0xffffff, 1.0);
		mainLight.position.set(-1, 1, 1);

		scene.add(ambientLight, mainLight);
    // LIGHTS
    
    const dirLight = new THREE.DirectionalLight( 0xffffff, 0.125 );
    dirLight.position.set( 0, 0, 1 ).normalize();
    scene.add( dirLight );
  
    const spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 100, 1000, 100 );

    spotLight.castShadow = true;

    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    scene.add( spotLight );
    // Lights 
    
		const ambientLight = new AmbientLight(0x323232);
		const mainLight = new DirectionalLight(0xffffff, 1.0);
		mainLight.position.set(-1, 1, 1);

		scene.add(ambientLight, mainLight);
    
    // Lights 
     
    const pointLight = new THREE.AmbientLight(0xffffff, .1)
    pointLight.position.x = 2
    pointLight.position.y = 3
    pointLight.position.z = 4
    scene.add(pointLight)
  
    const light1 = new THREE.DirectionalLight(0xffffff, 0.8);
    light1.position.set(0, 10, 0);
    
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.castShadow = true;
    light2.position.set(-5, 4, -5);

    const light3 = new THREE.DirectionalLight(0xffffff, 0.8);
    light3.position.set(10, 4, 10);

    scene.add(light1);
    scene.add(light2);
    scene.add(light3);
    */
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })


   
    


    /**
   * Camera
   */
    // Base camera  
    const camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 1000 );
    //const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.rotation.y = 45/180*Math.PI;
    camera.position.x = -4;
    camera.position.z = 4;
    camera.position.y = 2;
    scene.add(camera)
  

    // Controls Fixo
    // const controls = new OrbitControls( camera, canvas );
    // controls.maxPolarAngle = 0.9 * Math.PI / 2;
    // controls.enableZoom = false;

    // Controls Livre 
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.enableZoom = true
    controls.enablePan = true  
    controls.update(); 
    
    
    /**
     * Renderer
     */  
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      //powerPreference: "high-performance",
      //antialias: false,
      //stencil: false,
      //depth: false
    })
    renderer.shadowMap.enabled = true;
    //renderer.setSize(window.innerWidth, window.innerHeight) 
    //renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) 
    //renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding; 
    //renderer.toneMapping = THREE.ReinhardToneMapping;  
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;  
    //document.body.appendChild( canvas );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
 
   
    /**
   * Animate
   */
    
    const clock = new THREE.Clock() 
    const tick = () => { 
        const elapsedTime = clock.getElapsedTime()
  
        // Update Orbital Controls
        controls.update()

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick() 
       
    function render() { 
      lightHelper.update(); 
      shadowCameraHelper.update(); 
      renderer.render( scene, camera ); 
    } 
  } 
}
