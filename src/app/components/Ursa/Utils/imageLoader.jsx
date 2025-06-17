import * as THREE from 'three';
const spaceColors = [
    new THREE.Color(0xffffff), // white
    new THREE.Color(0x99ccff), // soft blue
    new THREE.Color(0x66ffff), // cyan
    new THREE.Color(0xcc99ff), // purple
    new THREE.Color(0xffffcc), // soft yellow
  ];
export const loadImageData=(src, callback)=>{
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

      for (let y = 0; y < height; y += 3) {
        for (let x = 0; x < width; x += 3) {
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