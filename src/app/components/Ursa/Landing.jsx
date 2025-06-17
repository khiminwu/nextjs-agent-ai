import * as THREE from 'three';
import { loadImageData } from './Utils/imageLoader';
import {fontLoader} from './Utils/fontLoader';
import { createCustomEvent } from '@/app/utils/createCustomEvent';
import { easeOutExpo } from './Utils/easing';

export default function Landing(scene,mount,mouse,camera,renderer,onClickExplore) {
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('/particle-soft.png');
    const raycaster = new THREE.Raycaster();
    
    let textMesh=null
    let hoverBox = null;
    let explodeStart = null;
    let geometry = new THREE.BufferGeometry();
    const velocities = [];
    let startPositions=[];
    let exploded = false;
    let startTime = null;
    const duration = 4000;  // total animation duration
    const delay = 1000;
    let isMounted = false;
    let textGroup=null;
    let points = null
    loadImageData('/particle.png', (posA, colA) => {
        
        // startPositions = [...posA];

        for (let i = 0; i < posA.length; i += 3) {
            const x = posA[i];
            const y = posA[i + 1];
            const z = posA[i + 2];

            startPositions.push(x, y, z);

            // Random direction vector
            const dir = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize();

            const distance = 300 + Math.random() * 300; // random explosion strength
            dir.multiplyScalar(distance); // apply strength

            velocities.push(dir.x, dir.y, dir.z);
        }

        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(posA, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colA, 3));

        // Alpha attribute for fading
        const alphas = new Float32Array(posA.length / 3).fill(0); // start fully transparent (exploded)
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));


        const material = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: particleTexture },
            },
            vertexShader: `
                attribute float alpha;
                varying float vAlpha;
                varying vec3 vColor;
                void main() {
                vAlpha = alpha;
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = 1.7 * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying float vAlpha;
                varying vec3 vColor;
                void main() {
                gl_FragColor = vec4(vColor, vAlpha);
                gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
                }
            `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
        });

        points = new THREE.Points(geometry, material);
        scene.add(points);
        
       
        
      
        
        
        const animate = (time) => {
            requestAnimationFrame(animate);
            // console.log(time,'time')
            if (exploded && startTime !== null) {
                
                const elapsed = time - startTime;
                const t = Math.min(elapsed / duration, 1);
                const ease = easeOutExpo(t);

                const positions = geometry.attributes.position.array;
                const alphas = geometry.attributes.alpha.array;
                for (let i = 0; i < positions.length; i++) {
                    const start = startPositions[i];
                    const target = velocities[i];
                    positions[i] = start + (target - start) * ease;
                     alphas[i / 3] = 1 - ease;
                }

                geometry.attributes.position.needsUpdate = true;
                geometry.attributes.alpha.needsUpdate = true;
            }

            if(isMounted && startTime !== null){
                const elapsed = time - startTime;
                const duration = 3000; // total animation duration
                const delay = 0; // delay before starting the animation
                let t = 0;
                if (elapsed < delay) {
                // Before delay: particles stay exploded and invisible
                t = 0;
                } else {
                // After delay, animate from exploded to original position and fade in
                t = Math.min((elapsed - delay) / (duration - delay), 1);
                }
                const ease = easeOutExpo(t);

                const positions = geometry.attributes.position.array;
                const alphas = geometry.attributes.alpha.array;

                for (let i = 0; i < positions.length; i++) {
                // Move from exploded (velocities) back to startPositions
                positions[i] = startPositions[i] + (velocities[i] - startPositions[i]) * (1 - ease);
                // Fade in from 0 to 1 opacity
                alphas[i / 3] = ease;
                }

                geometry.attributes.position.needsUpdate = true;
                geometry.attributes.alpha.needsUpdate = true;
                if(elapsed>= duration + delay){
                    // console.log(elapsed,'elapsed')
                    isMounted=false;
                    startTime = null;
                    const event = createCustomEvent('onPageChangeFinished', {});
                    window.dispatchEvent(event);
                }
                
                // isMounted=false;
            }

            raycaster.setFromCamera(mouse, camera);

   

            // renderer.render(scene, camera);
        };

        animate();

        startTime = performance.now();
        window.addEventListener('resize', handleResize);
        window.addEventListener('exploreClicked', (e) => {
            startTime = performance.now();
            exploded=true;
        });
        
        handleResize();

    });
    
    

    const handleResize=()=>{
        const scaleDevice = (window.innerWidth/1440);
        // const newWidth = window.innerWidth - ((220*scaleDevice)*2)
        // const scale =  newWidth/1000;
        // points.scale.set(scale, scale, scale);
        // console.log( scale,scaleDevice , newWidth,'resize')
                
            
    }

    const destroy=()=>{
        startTime = performance.now();
        isMounted=false;
    }
    
    const show=()=>{
        startTime = performance.now();
        isMounted=true;
        exploded=true;
    }

    return {
        show,
        destroy
    };
}