import * as THREE from 'three';

export class LevelManager {
  constructor(scene) {
    this.scene = scene;
    this.currentLevel = 1;
    this.levels = {
      1: this.createLevel1.bind(this),
      2: this.createLevel2.bind(this),
      3: this.createLevel3.bind(this)
    };
  }

  async transitionToNextLevel() {
    const transition = document.getElementById('level-transition');
    transition.style.opacity = '1';

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clear current level
    while(this.scene.children.length > 0) { 
      this.scene.remove(this.scene.children[0]);
    }

    this.currentLevel++;
    if (this.currentLevel > 3) this.currentLevel = 1;

    // Create new level
    this.levels[this.currentLevel]();
    document.getElementById('level').textContent = this.currentLevel;

    await new Promise(resolve => setTimeout(resolve, 500));
    transition.style.opacity = '0';
  }

  createLevel1() {
    // Yellow backrooms level (default)
    this.scene.background = new THREE.Color(0xF5DD90);
    this.scene.fog = new THREE.Fog(0xF5DD90, 0, 30);
    this.createBasicStructure(0xE8D5A9);
  }

  createLevel2() {
    // Dark concrete level
    this.scene.background = new THREE.Color(0x1a1a1a);
    this.scene.fog = new THREE.Fog(0x1a1a1a, 0, 20);
    this.createBasicStructure(0x333333);
  }

  createLevel3() {
    // Red emergency light level
    this.scene.background = new THREE.Color(0x0a0a0a);
    this.scene.fog = new THREE.Fog(0x0a0a0a, 0, 15);
    this.createBasicStructure(0x2a0000);

    // Add emergency lights
    for (let i = 0; i < 20; i++) {
      const light = new THREE.PointLight(0xff0000, 0.5, 10);
      light.position.set(
        (Math.random() - 0.5) * 40,
        3.5,
        (Math.random() - 0.5) * 40
      );
      this.scene.add(light);
    }
  }

  createBasicStructure(color) {
    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);

    // Create floor, ceiling, and walls
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.8,
      metalness: 0.2,
    });

    const floor = new THREE.Mesh(floorGeometry, material);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const ceiling = floor.clone();
    ceiling.position.y = 4;
    this.scene.add(ceiling);

    // Create walls
    const wallGeometry = new THREE.BoxGeometry(4, 4, 0.1);
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (Math.random() > 0.7) {
          const wall = new THREE.Mesh(wallGeometry, material);
          wall.position.set(
            (i - 10) * 4,
            2,
            (j - 10) * 4
          );
          wall.castShadow = true;
          wall.receiveShadow = true;
          this.scene.add(wall);

          if (Math.random() > 0.5) {
            const perpWall = wall.clone();
            perpWall.rotation.y = Math.PI / 2;
            this.scene.add(perpWall);
          }
        }
      }
    }
  }
}
