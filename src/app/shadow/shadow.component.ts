import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap';


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
    texture.magFilter = THREE.NearestFilter;
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
    const gui = new dat.GUI() 
    const canvas: any = document.querySelector('#canvas'); 
    const scene = new THREE.Scene(); 
    let tl = gsap.timeline() 
    this.addPlane(scene);


    //3d  
    gltfLoader.load('../../assets/aranha4.gltf', (gltf) => {

      gltf.scene.scale.set(0.1, 0.1, 0.1)
      gltf.scene.rotation.set(0, 1.1, 0)

      scene.add(gltf.scene)

      gui.add(gltf.scene.rotation, 'x').min(0).max(9)
      gui.add(gltf.scene.rotation, 'y').min(0).max(9)
      gui.add(gltf.scene.rotation, 'z').min(0).max(9) 
    })

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
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 0
    camera.position.y = 0
    camera.position.z = 2
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.enablePan = true; 
    controls.update();
    
    
    /**
     * Renderer
     */  
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
    })
    renderer.shadowMap.enabled = true;
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
   
    /**
   * Animate
   */

    const clock = new THREE.Clock()

    const tick = () =>
    {

        const elapsedTime = clock.getElapsedTime()

        // Update objects
        //sphere.rotation.y = .5 * elapsedTime

        // Update Orbital Controls
        controls.update()

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()
 
  }
}
