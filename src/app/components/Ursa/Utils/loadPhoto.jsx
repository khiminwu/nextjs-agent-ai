import * as THREE from 'three';
import { FontLoader } from 'three-stdlib';
import { TextGeometry } from 'three-stdlib';

export const  loadPhoto = (src, callback) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;

  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const width = 512;
    const height = width * (img.height / img.width);

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height).data;
    const positions = [];
    const colors = [];

    for (let y = 0; y < height; y += 2) {
      for (let x = 0; x < width; x += 2) {
        const i = (y * width + x) * 4;
        const r = imageData[i] / 255;
        const g = imageData[i + 1] / 255;
        const b = imageData[i + 2] / 255;
        const alpha = imageData[i + 3];

        const brightness = (r + g + b) / 3;
        if (alpha > 100 && brightness < 0.5) {
          const posX = x - width / 2;
          const posY = height / 2 - y;
          const posZ = (Math.random() - 0.5) * 40;

          positions.push(posX, posY, posZ);

          colors.push(0.8, 0.9, 1.0); // bluish white
        }
      }
    }


    callback(positions, colors);
  };
};