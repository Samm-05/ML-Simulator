import * as THREE from 'three';

export const mountHeroScene = (container: HTMLDivElement): (() => void) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f172a);

  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const pointsCount = 280;
  const positions = new Float32Array(pointsCount * 3);
  const colors = new Float32Array(pointsCount * 3);
  const palette = [new THREE.Color(0x6366f1), new THREE.Color(0x14b8a6), new THREE.Color(0x64748b)];

  for (let i = 0; i < pointsCount; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

    const selectedColor = palette[i % palette.length];
    colors[i * 3] = selectedColor.r;
    colors[i * 3 + 1] = selectedColor.g;
    colors[i * 3 + 2] = selectedColor.b;
  }

  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pointsMaterial = new THREE.PointsMaterial({
    size: 0.07,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
  });

  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  scene.add(points);

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x94a3b8,
    transparent: true,
    opacity: 0.25,
  });

  const lineGroup = new THREE.Group();
  for (let i = 0; i < 45; i += 1) {
    const start = new THREE.Vector3((Math.random() - 0.5) * 9, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
    const end = start.clone().add(new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2));
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    lineGroup.add(line);
  }
  scene.add(lineGroup);

  let mouseX = 0;
  let mouseY = 0;

  const onMouseMove = (event: MouseEvent) => {
    const rect = container.getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.8;
    mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.8;
  };

  const onResize = () => {
    if (!container.clientWidth || !container.clientHeight) {
      return;
    }
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };

  container.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onResize);

  let animationFrame = 0;
  const animate = () => {
    animationFrame = window.requestAnimationFrame(animate);
    points.rotation.y += 0.0015;
    points.rotation.x += 0.0007;
    lineGroup.rotation.y += 0.0009;
    camera.position.x += (mouseX - camera.position.x) * 0.02;
    camera.position.y += (-mouseY - camera.position.y) * 0.02;
    renderer.render(scene, camera);
  };
  animate();

  return () => {
    window.cancelAnimationFrame(animationFrame);
    container.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
    pointsGeometry.dispose();
    pointsMaterial.dispose();
    lineMaterial.dispose();
    lineGroup.children.forEach((child) => {
      if (child instanceof THREE.Line) {
        child.geometry.dispose();
      }
    });
    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };
};
