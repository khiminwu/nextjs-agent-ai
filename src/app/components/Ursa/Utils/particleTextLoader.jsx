import * as THREE from 'three';

export const loadTextData=(text,opt, callback)=>{
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const width = 1000;
    const height = 400;

    canvas.width = width;
    canvas.height = height;

    // Clear and render text
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold '+(opt?.size+'px' || '54px')+' krul';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);

    // ✅ Debug: Optional to check canvas output
    // document.body.appendChild(canvas); 

    const imageData = ctx.getImageData(0, 0, width, height).data;
    const positions = [];
    const velocities =[];
    const colors = [];

    for (let y = 0; y < height; y += 5) {
      for (let x = 0; x < width; x += 5) {
        const i = (y * width + x) * 4;
        const alpha = imageData[i + 3];
        if (alpha > 50) {
          const randX = (Math.random() - 0.5);
          const randY = (Math.random() - 0.5);
          const randZ = (Math.random() - 0.5);
          positions.push(x - width / 2, height / 2 - y, randZ);
          colors.push(1, 1, 1); // white color
        }
      }
    }

    for (let i = 0; i < positions.length; i += 3) {
        

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

     const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const alphas = new Float32Array(positions.length / 3).fill(0); // start fully transparent (exploded)
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

    // const material = new THREE.PointsMaterial({
    //     size: 0.5,
    //     // map: particleTexture,
    //     transparent: false,
    //     vertexColors: true,
    //     depthWrite: false,
    //     // blending: THREE.AdditiveBlending
    // });

    const material = new THREE.ShaderMaterial({
                uniforms: {
                  size: { value: 2},
                  pointTexture: { value: new THREE.TextureLoader().load('/particle_square.svg') }
                },
                vertexShader: `
                  uniform float size;
                  attribute float alpha;
                  varying float vAlpha;
                  varying vec3 vColor;
                  void main() {
                    vAlpha = alpha;
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
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
                vertexColors: true
            });
    

      callback(positions,velocities,geometry,material);
  }