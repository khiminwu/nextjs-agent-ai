'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';


export default function ImageParticles() {
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

  function easeInCubic(t) {
    return t * t * t;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  let particleTexture = null;
  let isMobile = false;
  let scene,
  camera,
  mount,
  renderer,
  controls,
  starMaterial,
  stars,
  ursaMajorGroup
  = null;
  
  const starCount = 1500;
  const starOpacities = new Float32Array(starCount);
  const flickerOffsets = new Float32Array(starCount);
  const flickerSpeeds = new Float32Array(starCount);

  let activeImage = "A";
    
  let isMorphing = false;
  const positionsA = [];
  const positionsB = [];
  const colorsA = [];
  const colorsB = [];
  let currentPositions = [];
  let morphTarget = [];
  
  let morphProgress = 0;
  let morphPhase = 0; // 0 = none, 1 = explode, 2 = reassemble
  let explodedPositions = [];

  useEffect(() => {
    particleTexture = textureLoader.load('/particle-soft.png');
    isMobile = window.innerWidth <= 640; // customize as needed
    
    init();
    setupScene();
    setupConstallations();
    

    loadTextData('HELLO', (positions, colors) => {
      // Build geometry and add to scene
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 2.0,
        map: particleTexture,
        transparent: true,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
    });

    // loadTextData('HELLO', (posA, colA) => {});

  //  loadImageData('/particle2.png', (posA, colA) => {
  //     loadImageData('/particle.png', (posB, colB) => {
  //       const maxLength = Math.max(posA.length, posB.length);
  //       while (posA.length < maxLength) posA.push(0);
  //       while (posB.length < maxLength) posB.push(0);

  //       positionsA.push(...posA);
  //       positionsB.push(...posB);
  //       colorsA.push(...colA);
  //       colorsB.push(...colB);

  //       currentPositions = [...positionsB];
  //       morphTarget = [...positionsA];

  //       const geometry = new THREE.BufferGeometry();
  //       geometry.setAttribute('position', new THREE.Float32BufferAttribute(currentPositions, 3));
  //       geometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsA, 3));

  //       const material = new THREE.PointsMaterial({
  //         size: 1.7,
  //         vertexColors: true,
  //         map: particleTexture,
  //         transparent: true,
  //         blending: THREE.AdditiveBlending,
  //         depthWrite: false,
  //       });

  //       const points = new THREE.Points(geometry, material);
  //       scene.add(points);

  //       // const animate = () => {
  //       //   requestAnimationFrame(animate);

  //       //   const time = performance.now();
  //       //   for (let i = 0; i < starCount; i++) {
  //       //     const base = starOpacities[i];
  //       //     const offset = flickerOffsets[i];
  //       //     const speed = flickerSpeeds[i];
  //       //     const flicker = Math.sin((time + offset) * 0.001 * speed) * 0.5 + 0.5;
  //       //     const alpha = THREE.MathUtils.clamp(base * flicker, 0.2, 1.0);
  //       //     starMaterial.opacity = alpha;
  //       //   }

  //       //   stars.rotation.y += 0.0002;

  //       //   if (isMorphing) {
  //       //     morphProgress += 0.02;
  //       //     if (morphProgress >= 1) {
  //       //       morphProgress = 1;
  //       //       isMorphing = false;
  //       //     }

  //       //     const posAttr = geometry.attributes.position;
  //       //     const positions = posAttr.array;
  //       //     for (let i = 0; i < positions.length; i++) {
  //       //       positions[i] = THREE.MathUtils.lerp(positionsA[i], positionsB[i], morphProgress);
  //       //     }
  //       //     posAttr.needsUpdate = true;
  //       //   }

  //       //   controls.update();
  //       //   renderer.render(scene, camera);
  //       // };

  //       // animate();

  //       // mount.addEventListener('click', triggerMorph);
  //       // mount.addEventListener('touchstart', triggerMorph);

  //       // function triggerMorph() {
  //       //   if (isMorphing) return;
  //       //   isMorphing = true;
  //       //   morphProgress = 0;

  //       //   const temp = [...positionsA];
  //       //   positionsA.splice(0, positionsA.length, ...positionsB);
  //       //   positionsB.splice(0, positionsB.length, ...temp);
  //       //   morphTarget = [...positionsB];
  //       // }
  //     });
  //   });

    


    window.addEventListener('resize', handleResize);

    

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.innerHTML = '';
      renderer.dispose();
    };
  }, []);

  const init=()=>{
    mount = mountRef.current;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      50000
    );
    camera.position.z =  isMobile?1500:350;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enableRotate = true; // optional
    controls.enablePan = false;    // optional
    // controls.minDistance = 300;  // closest zoom-in
    // controls.maxDistance = 1500;
    // Limit vertical (polar) rotation
    controls.minPolarAngle = Math.PI / 4;    // looking slightly down
    controls.maxPolarAngle = Math.PI / 1.4;  // not looking fully below

    // Limit horizontal (azimuth) rotation
    controls.minAzimuthAngle = -Math.PI / 4;
    controls.maxAzimuthAngle = Math.PI / 4;

    
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

      const time = performance.now();
      for (let i = 0; i < starCount; i++) {
        const base = starOpacities[i];
        const offset = flickerOffsets[i];
        const speed = flickerSpeeds[i];
        const flicker = Math.sin((time + offset) * 0.001 * speed) * 0.5 + 0.5;
        const alpha = THREE.MathUtils.clamp(base * flicker, 0.2, 1.0);
        starMaterial.opacity = alpha;
      }

      stars.rotation.y += 0.0002;


      controls.update();
      renderer.render(scene, camera);
    };
    scene.add(stars);
    animate();
  }

  const setupConstallations = () => {
    
    const scaleFactor = 5;
    const verticalOffset = 100;
    const ursaMajorStars = [
        { name: "Dubhe",        pos: [0, 0, 30] },
        { name: "Merak",        pos: [-20, -10, 30] },
        { name: "Phecda",       pos: [-30, -25, 30] },
        { name: "Megrez",       pos: [-15, -30, 30] },
        { name: "Alioth",       pos: [0, -35, 30] },
        { name: "Mizar",        pos: [10, -30, 30] },
        { name: "Alkaid",       pos: [20, -40, 30] },
      ].map(star => ({
      name: star.name,
      pos: [
        star.pos[0] * scaleFactor,
        star.pos[1] * scaleFactor + verticalOffset,
        star.pos[2] * scaleFactor,
      ],
    }));

      ursaMajorGroup = new THREE.Group();
      scene.add(ursaMajorGroup);

      const ursaMaterial = new THREE.SpriteMaterial({
        map: textureLoader.load('/particle-soft.png'),
        color: 0xffffff,
        transparent: true,
        blending: THREE.AdditiveBlending
      });

      ursaMajorStars.forEach((star) => {
        const sprite = new THREE.Sprite(ursaMaterial.clone());
        sprite.position.set(...star.pos);
        sprite.scale.set(10, 10, 1); // small dot
        ursaMajorGroup.add(sprite);
      });


      const connections = [
        [0, 1], [1, 2], [2, 3],
        [3, 4], [4, 5], [5, 6]
      ];

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x88ccff, linewidth: 2 });

    connections.forEach(([startIdx, endIdx]) => {
      const points = [
        new THREE.Vector3(...ursaMajorStars[startIdx].pos),
        new THREE.Vector3(...ursaMajorStars[endIdx].pos)
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      ursaMajorGroup.add(line);
    });
    // ursaMajorGroup.visible = activeImage === "A";
  }
  
  const setupControls = () => {
   // Toggle morph on click/tap
        mount.addEventListener('click', triggerMorph);
        mount.addEventListener('touchstart', triggerMorph);

        function triggerMorph() {
          if (isMorphing) return;

          isMorphing = true;
          morphProgress = 0;
          morphPhase = 1;

          // Store exploded targets
          explodedPositions = positionsB.map((v, i) => {
            return v + (Math.random() - 0.5) * 7000; // explode outward ±250
          });

          // Swap positions A/B for reassembly later
          const temp = [...positionsA];
          positionsA.splice(0, positionsA.length, ...positionsB);
          positionsB.splice(0, positionsB.length, ...temp);
          morphTarget = [...positionsB];

          // Toggle active image
          activeImage = activeImage === "A" ? "B" : "A";
        }
  }

  const handleResize = () => {
    console.log('Resizing canvas');
      isMobile = window.innerWidth <= 768;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.position.z =  isMobile?1500:400;
      //  camera.position.z = 1200;
      renderer.render(scene, camera);
  };

  const loadImageData=(src, callback)=>{
    const img = new Image();
    img.src = src;
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = 1000;
      const height = width * (img.height / img.width);
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height).data;
      const positions = [];
      const colors = [];

      for (let y = 0; y < height; y += 5) {
        for (let x = 0; x < width; x += 5) {
          const i = (y * width + x) * 4;
          const alpha = imageData[i + 3];
          if (alpha > 100) {
            const randX = (Math.random() - 0.5) * 4;
            const randY = (Math.random() - 0.5) * 4;
            const randZ = (Math.random() - 0.5) * 4;
            positions.push(x - width / 2 + randX, height / 2 - y + randY, randZ);
            const color = spaceColors[Math.floor(Math.random() * spaceColors.length)];
            colors.push(color.r, color.g, color.b);
          }
        }
      }

      callback(positions, colors);
    };
  }

  const loadTextData=(text, callback)=>{
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 400;

    canvas.width = width;
    canvas.height = height;

    // Clear and render text
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 50px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);

    // ✅ Debug: Optional to check canvas output
    // document.body.appendChild(canvas); 

    const imageData = ctx.getImageData(0, 0, width, height).data;
    const positions = [];
    const colors = [];

    for (let y = 0; y < height; y += 3) {
      for (let x = 0; x < width; x += 3) {
        const i = (y * width + x) * 4;
        const alpha = imageData[i + 3];
        if (alpha > 50) {
          const randX = (Math.random() - 0.5) * 4;
          const randY = (Math.random() - 0.5) * 4;
          const randZ = (Math.random() - 0.5) * 4;
          positions.push(x - width / 2 + randX, height / 2 - y + randY, randZ);
          colors.push(1, 1, 1); // white color
        }
      }
    }

      callback(positions, colors);
  }

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
}