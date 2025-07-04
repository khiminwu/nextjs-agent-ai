export const spaceColors = [
    new THREE.Color(0xffffff), // white
    new THREE.Color(0x99ccff), // soft blue
    new THREE.Color(0x66ffff), // cyan
    new THREE.Color(0xcc99ff), // purple
    new THREE.Color(0xffffcc), // soft yellow
  ];

  import * as THREE from 'three';

// Fungsi untuk mendapatkan posisi Y paling atas dalam world space
export function getTopY(camera) {
  if(!camera) return;
  const topScreen = new THREE.Vector3(0, 1, -1); // (x, y, z) normalized device coords
  topScreen.unproject(camera); // ubah ke world space
  return topScreen.y;
}