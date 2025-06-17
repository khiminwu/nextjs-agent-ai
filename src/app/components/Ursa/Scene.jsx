'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import Landing from './Landing';
import About from './About';
import Team from './Team';
import Service from './Service';
import Works from './Works';
import Contact from './Contact';

export default function Scene() {
  const mountRef = useRef();
  const textureLoader = new THREE.TextureLoader();
  

  const spaceColors = [
    new THREE.Color(0xffffff), // white
    new THREE.Color(0x99ccff), // soft blue
    new THREE.Color(0x66ffff), // cyan
    new THREE.Color(0xcc99ff), // purple
    new THREE.Color(0xffffcc), // soft yellow
  ];

  let mouse = new THREE.Vector2();
  let isHovering = false;
  let pulses = [];
  const pages =['about','team','service','works','contact'];
  let currentPage = pages[0];

  let particleTexture = null;
  let isMobile = false;
  let scene,
  camera,
  mount,
  renderer,
  controls,
  starMaterial,
  stars
  = null;
  let hash = '';
  let onChangePage = true;
  const starCount = 1500;
  const starOpacities = new Float32Array(starCount);
  const flickerOffsets = new Float32Array(starCount);
  const flickerSpeeds = new Float32Array(starCount);
  let aboutPage,servicePage,workPage,contactPage,landingPage,teamPage = false;

  useEffect(() => {
    particleTexture = textureLoader.load('/particle-soft.png');
    isMobile = window.innerWidth <= 640; // customize as needed
    
    init();
    setupScene();
    
    landingPage = Landing(scene,mount,mouse,camera,renderer,onClickExplore);
    aboutPage = About(scene,mount,mouse,camera,renderer);
    teamPage = Team(scene,mount,mouse,camera,renderer);
    servicePage = Service(scene,mount,mouse,camera,renderer);
    workPage = Works(scene,mount,mouse,camera,renderer);
    contactPage = Contact(scene,mount,mouse,camera,renderer);

    // Service(scene,mount,mouse,camera,renderer);
    window.addEventListener('resize', handleResize);
    window.addEventListener('wheel', handleScroll,{ passive: true });
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('onPageChangeFinished', pageChangeFinished);
    

     handleHashChange();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('onPageChangeFinished', pageChangeFinished);
      mount.innerHTML = '';
      renderer.dispose();
    };
  }, []);

  const onClickExplore = () => {
    window.location.hash = 'about';
    console.log('Explore clicked');
  }

  const init=()=>{
    mount = mountRef.current;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      50000
    );
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enableRotate = false; // optional
    controls.enablePan = false;    // optional
    // controls.minDistance = 300;  // closest zoom-in
    // controls.maxDistance = 1500;
    // Limit vertical (polar) rotation
    controls.minPolarAngle = Math.PI / 4;    // looking slightly down
    controls.maxPolarAngle = Math.PI / 1.4;  // not looking fully below

    // Limit horizontal (azimuth) rotation
    controls.minAzimuthAngle = -Math.PI / 4;
    controls.maxAzimuthAngle = Math.PI / 4;

    handleResize()
    
  }

  const setupScene = () => {
    

    // 🌌 Add Milky Way sky sphere
    // const loader = new THREE.TextureLoader();
    // loader.load('/milkyway.jpg', (texture) => {
    //   const sphereGeometry = new THREE.SphereGeometry(15000, 64, 64);
    //   const sphereMaterial = new THREE.MeshBasicMaterial({
    //     map: texture,
    //     side: THREE.BackSide,
    //   });
    //   const skySphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    //   scene.add(skySphere);
    // });

    // ✨ Starfield particles

    // Light
    const light = new THREE.PointLight(0xffffff, 1);
    light.position.set(50, 50, 50);
    scene.add(light);
    
    const starPositions = [];
    

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 10000;
      const y = (Math.random() - 0.5) * 10000;
      const z = (Math.random() - 0.5) * 10000;
      starPositions.push(x, y, z);
      starOpacities[i] = 0.5 + Math.random() * 0.5; // base brightness
      flickerOffsets[i] = Math.random() * 1000; // random time offset
      flickerSpeeds[i] = 0.5 + Math.random(); // flicker speed
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('aBaseAlpha', new THREE.BufferAttribute(starOpacities, 1));
    starGeometry.setAttribute('aFlickerOffset', new THREE.BufferAttribute(flickerOffsets, 1));
    starGeometry.setAttribute('aFlickerSpeed', new THREE.BufferAttribute(flickerSpeeds, 1));
    

    starMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: particleTexture }
      },
      vertexShader: `
        uniform float uTime;
        attribute float aBaseAlpha;
        attribute float aFlickerOffset;
        attribute float aFlickerSpeed;
        varying float vAlpha;

        void main() {
          float time = uTime + aFlickerOffset;
          float flicker = sin(time * aFlickerSpeed) * 0.5 + 0.5;
          vAlpha = clamp(flicker * aBaseAlpha, 0.1, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 5.0;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying float vAlpha;

        void main() {
          vec4 texColor = texture2D(uTexture, gl_PointCoord);
          gl_FragColor = vec4(texColor.rgb, texColor.a * vAlpha);
        }
      `,
    });

    stars = new THREE.Points(starGeometry, starMaterial);

    const animate = () => {
      requestAnimationFrame(animate);

      const time = performance.now() * 0.001;
      for (let i = 0; i < starCount; i++) {
        const base = starOpacities[i];
        const offset = flickerOffsets[i];
        const speed = flickerSpeeds[i];
        const flicker = Math.sin((time + offset) * 0.001 * speed) * 0.5 + 0.5;
        const alpha = THREE.MathUtils.clamp(base * flicker, 0.2, 1.0);
        starMaterial.opacity = alpha;
      }
      
      stars.rotation.y += 0.0002;
      starMaterial.uniforms.uTime.value = time;



      controls.update();
      renderer.render(scene, camera);
    };
    scene.add(stars);
    animate();
  }


  const handleResize = () => {
    
      isMobile = window.innerWidth < 1080;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      const isPortrait = camera.aspect < 1
      
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      console.log('Resizing canvas',camera.aspect);
      // camera.position.z =  isMobile?1500:400;
      //  camera.position.z = 380;
       
        const size = new THREE.Vector3();
        const aspect = (1440/window.innerWidth)
       const fitWidthDistance = size.x / (2 * Math.tan((camera.fov * Math.PI) / 360));
      let zPos = (aspect*400) ;
      
      if(isMobile) zPos = 340
      if(isPortrait) zPos = zPos + ((aspect-1)*1100) ;
      if(isMobile && isPortrait) zPos = 800 + (((860/window.innerWidth)-1)*500);
      // if(camera.aspect>1 & !isMobile) zPos = 380;
      // if(camera.aspect<1 & !isMobile) zPos = zPos + ((aspect-1)*550)

      // if(camera.aspect>1 & isMobile) zPos = 100;

      //  console.log(isPortrait,isMobile,aspect,zPos,'fitWidthDistance')
      camera.position.z = zPos;
      renderer.render(scene, camera);
  };

  const handleScroll = (e) => {
    if(currentPage=='' || onChangePage) return false;

    // let index = pages.findIndex(page => page === currentPage);
    // if (e.deltaY > 0) {
    //   index+=1;
    //   console.log('Scrolled down ⬇️');
    // } else {
    //   index-=1;
    //   console.log('Scrolled up ⬆️');
    // }
    // if(index<=0) index=0;
    // if(index>(pages.length-1)) index=pages.length-1;
    
    // window.location.hash = pages[index];

  };

  const handleHashChange = () => {
    
      hash = window.location.hash.replace(/^#/, '').toLowerCase();
      currentPage = hash;
      // setHash(window.location.hash);
      console.log('Hash changed to:', hash);
      if(landingPage) landingPage.destroy();
      if(aboutPage) aboutPage.destroy();
      if(servicePage) servicePage.destroy();
      if(workPage) workPage.destroy();
      if(contactPage) contactPage.destroy();
      if(teamPage) teamPage.destroy();
      
      switch(hash){
        case 'about':
          if(aboutPage) aboutPage.show();
          break;
        case 'team':
          if(teamPage) teamPage.show();
          break;
        case 'service':
          if(servicePage) servicePage.show();
          break;
        case 'works':
          if(workPage) workPage.show();
          break;
        case 'contact':
          if(contactPage) contactPage.show();
          break;
        default:
          if(landingPage) landingPage.show();
          break;
      }
      onChangePage=true;
  };

  const pageChangeFinished = ()=>{
    onChangePage=false;
  }

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
}