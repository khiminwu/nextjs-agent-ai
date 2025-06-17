import * as THREE from 'three';
import { FontLoader } from 'three-stdlib';
import { TextGeometry } from 'three-stdlib';

export const fontLoader=(text, opt,callback)=>{
    let textGroup=null;
    let textMesh=null
    let hoverBox = null;
    const loader = new FontLoader();
    loader.load('/fonts/krub.typeface.json', (font) => {
        const textGeometry = new TextGeometry(text, {
            font: font,
            size: opt.size || 10,
            height: 0,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0.5,
            bevelSegments: 5,
        });
        
        textGeometry.center();

        const material = new THREE.MeshStandardMaterial({ color: opt.color || 0xffffff });
        textMesh = new THREE.Mesh(textGeometry, material);
        
        // textMesh.position.set(0, -150, 0);

        textGeometry.computeBoundingBox();
        const boundingBox = textGeometry.boundingBox;
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        textGroup = new THREE.Group();
        textGroup.add(textMesh);
        
        if(opt.button){
            const boxGeometry = new THREE.BoxGeometry(size.x + 10, size.y + 10, size.z + 10);
            const boxMaterial = new THREE.MeshBasicMaterial({  visible: false, wireframe: true, color: 0x00ff00 }); // invisible
            hoverBox = new THREE.Mesh(boxGeometry, boxMaterial);
            hoverBox.name = 'exploreBtn';
            hoverBox.position.copy(textMesh.position);
            textGroup.add(hoverBox);
        }
        

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(0, 0, 10);

        const ambient = new THREE.AmbientLight(0xffffff, 1);

        
        
        textGroup.add(ambient);
        textGroup.add(light);
        callback(textGroup,textMesh,hoverBox);
        // Optional: move entire group down instead of individual mesh
        // textGroup.position.set(0, -1500, 0);
    },undefined,
  (err) => {
    alert('Font load error:', err);
  });

    
}