import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';

export class NPC {
  constructor(scene, position, audioManager) {
    // Create skater mesh
    const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
    this.mesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.mesh.position.copy(position);
    this.mesh.position.y = 1;
    scene.add(this.mesh);

    // Create skateboard
    this.skateboard = this.createSkateboard();
    this.mesh.add(this.skateboard);

    this.audioManager = audioManager;
    this.target = this.getRandomPosition();
    this.speed = 0.05;
    this.tricks = [];
    
    // Start random tricks
    this.doRandomTricks();
  }

  createSkateboard() {
    const board = new THREE.Group();
    
    const boardGeometry = new THREE.BoxGeometry(0.8, 0.1, 2);
    const boardMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2700 });
    const boardMesh = new THREE.Mesh(boardGeometry, boardMaterial);
    board.add(boardMesh);

    const wheelGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    for (let i = 0; i < 4; i++) {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.x = (i < 2 ? 0.3 : -0.3);
      wheel.position.z = (i % 2 === 0 ? 0.7 : -0.7);
      wheel.position.y = -0.9;
      board.add(wheel);
    }

    return board;
  }

  getRandomPosition() {
    return new THREE.Vector3(
      (Math.random() - 0.5) * 40,
      1,
      (Math.random() - 0.5) * 40
    );
  }

  doRandomTricks() {
    setInterval(() => {
      if (Math.random() < 0.3) {
        this.doTrick();
      }
    }, 3000);
  }

  doTrick() {
    const tricks = ['kickflip', 'heelflip', '360flip'];
    const trick = tricks[Math.floor(Math.random() * tricks.length)];
    
    new TWEEN.Tween(this.mesh.position)
      .to({ y: this.mesh.position.y + 1.5 }, 500)
      .easing(TWEEN.Easing.Quadratic.Out)
      .chain(
        new TWEEN.Tween(this.mesh.position)
          .to({ y: 1 }, 500)
          .easing(TWEEN.Easing.Quadratic.In)
          .onComplete(() => {
            this.audioManager.playRandomPhrase('tricks');
          })
      )
      .start();

    new TWEEN.Tween(this.skateboard.rotation)
      .to({ z: Math.PI * 2 }, 1000)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
  }

  update(playerPosition) {
    const distanceToTarget = this.mesh.position.distanceTo(this.target);
    const distanceToPlayer = this.mesh.position.distanceTo(playerPosition);

    // Occasionally greet or challenge the player
    if (distanceToPlayer < 5 && Math.random() < 0.01) {
      this.audioManager.playRandomPhrase(Math.random() < 0.5 ? 'greetings' : 'challenges');
    }

    // Get new target when reached current one
    if (distanceToTarget < 1) {
      this.target = this.getRandomPosition();
    }

    // Move towards target
    const direction = new THREE.Vector3()
      .subVectors(this.target, this.mesh.position)
      .normalize();

    this.mesh.position.x += direction.x * this.speed;
    this.mesh.position.z += direction.z * this.speed;
    this.mesh.rotation.y = Math.atan2(direction.x, direction.z);
  }
}
