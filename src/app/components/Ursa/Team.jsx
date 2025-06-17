import * as THREE from 'three';
import { loadImageData } from './Utils/imageLoader';
import {fontLoader} from './Utils/fontLoader';
import {loadTextData} from './Utils/particleTextLoader'
import { easeOutExpo } from './Utils/easing';
import { createCustomEvent } from '@/app/utils/createCustomEvent';
import {loadPhoto} from './Utils/loadPhoto';
export default function Service(scene,mount,mouse,camera,renderer) {
    const colors = [];
    let isMounted=false;
    let isDestroy=false;
    let startTime = null;
    const duration = 4000;  // total animation duration
    const delay = 1000;
    let velocities = [];
    let startPositions=[];
    let geometry = null
    let points=null

    

    loadTextData('Our Team', {size:120,button:false},(positions,explodePosition,geo,material)=>{
                startPositions=positions;
                velocities=explodePosition;

                geometry = geo;
         

            points = new THREE.Points(geometry, material);
            points.position.y=150
            points.visible=false;
            scene.add(points);
        

        // 🧠 Animate explode → form
        
        const animate = (time) => {
            requestAnimationFrame(animate);
            // console.log('aaaa',isMounted,startTime)
            if(isMounted && startTime !== null){
                // console.log('aaaa')
                const elapsed = time - startTime;
                const duration = 3000; // total animation duration
                const delay = 500; // delay before starting the animation
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
                // console.log('aaaa')
                for (let i = 0; i < positions.length; i++) {
                // Move from exploded (velocities) back to startPositions
                    positions[i] = startPositions[i] + (velocities[i] - startPositions[i]) * (1 - ease);
                    alphas[i / 3] = ease;
                // Fade in from 0 to 1 opacity
                
                }
                // console.log(positions)
                geometry.attributes.position.needsUpdate = true;
                geometry.attributes.alpha.needsUpdate = true;
                if(elapsed>= duration + delay){
                    
                    
                    startTime = null;
                    const event = createCustomEvent('onPageChangeFinished', {});
                    window.dispatchEvent(event);
                }
                
                // isMounted=false;
            }

            if (isDestroy && startTime !== null) {
                
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
                if(elapsed>= duration + delay){
                    points.visible=false;
                    isDestroy=false;
                    startTime = null;
                    
                }

                geometry.attributes.position.needsUpdate = true;
                geometry.attributes.alpha.needsUpdate = true;
            }

            renderer.render(scene, camera);
        };

        animate();

        startTime = performance.now();

       

    })

//     loadPhoto('/bear.png', (positions, colors) => {
//         const bearGeo = new THREE.BufferGeometry();
//         bearGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
//         bearGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

//         const bearMaterial = new THREE.PointsMaterial({
//   size: 2.5,
//   vertexColors: true,
//   transparent: true,
//   depthWrite: false,
//   blending: THREE.AdditiveBlending,
// });

//         const bears = new THREE.Points(bearGeo, bearMaterial);
//         scene.add(bears);
//         });

    // loadImageData('/bear.png', (posA, colA) => {
    //  const bearGeo =  new THREE.BufferGeometry()
    //     bearGeo.setAttribute('position', new THREE.Float32BufferAttribute(posA, 3));
    //     bearGeo.setAttribute('color', new THREE.Float32BufferAttribute(colA, 3));
    //     const bearMaterial = new THREE.PointsMaterial({
    //         size: 2,
    //         vertexColors: true,
    //         transparent: true,
    //         opacity: 0.8,
    //         depthWrite: false
    //     });

    //     const bears = new THREE.Points(bearGeo, bearMaterial);
    //     bears.position.y=100
    //     scene.add(bears);
    // });



    const show=()=>{
        // console.log('init')
        startTime = performance.now();
        isMounted=true;
        isDestroy=false;
        points.visible=true;
    }

    const destroy=()=>{
        if(isMounted){
            startTime = performance.now();
            isMounted=false;
            isDestroy=true;
        }
    }

    return {
        show,
        destroy
    };
}