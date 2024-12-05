import * as THREE from 'three';

export class Agent {
  constructor(scene, position, audioManager) {
    // Create body
    const bodyGeometry = new THREE.CapsuleGeometry(0.5, 2, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: 0x330000,
      roughness: 0.2,
      metalness: 0.8
    });
    
    this.mesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    this.mesh.position.copy(position);
    this.mesh.position.y = 2;
    this.mesh.castShadow = true;
    scene.add(this.mesh);

    // Create eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    
    this.leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    this.rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    
    this.leftEye.position.set(-0.2, 0.3, 0.4);
    this.rightEye.position.set(0.2, 0.3, 0.4);
    
    this.mesh.add(this.leftEye);
    this.mesh.add(this.rightEye);

    // Create spotlight
    this.spotlight = new THREE.SpotLight(0xff0000, 1);
    this.spotlight.position.set(0, 5, 0);
    this.spotlight.angle = Math.PI / 6;
    this.spotlight.penumbra = 0.5;
    this.spotlight.decay = 2;
    this.spotlight.distance = 10;
    this.spotlight.castShadow = true;
    scene.add(this.spotlight);

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.target = this.getRandomPosition();
    this.speed = 0.03;
    this.audioManager = audioManager;
    this.lastSoundDistance = Infinity;
  }

  getRandomPosition() {
    return new THREE.Vector3(
      (Math.random() - 0.5) * 40,
      2,
      (Math.random() - 0.5) * 40
    );
  }

  update(playerPosition) {
    const distanceToTarget = this.mesh.position.distanceTo(this.target);
    const distanceToPlayer = this.mesh.position.distanceTo(playerPosition);

    // Update spotlight
    this.spotlight.position.copy(this.mesh.position);
    this.spotlight.position.y += 5;

    // Handle sound
    if (distanceToPlayer < 15 && distanceToPlayer > 5) {
      if (distanceToPlayer < this.lastSoundDistance) {
        const volume = Math.max(0, 1 - (distanceToPlayer / 15));
        this.audioManager.playRandomSound(volume);
      }
    }
    this.lastSoundDistance = distanceToPlayer;

    // Handle movement
    if (distanceToPlayer < 10) {
      this.direction.subVectors(this.mesh.position, playerPosition).normalize();
      this.speed = 0.08;
    } else {
      if (distanceToTarget < 1) {
        this.target = this.getRandomPosition();
      }
      this.direction.subVectors(this.target, this.mesh.position).normalize();
      this.speed = 0.03;
    }

    this.mesh.position.x += this.direction.x * this.speed;
    this.mesh.position.z += this.direction.z * this.speed;
    this.mesh.rotation.y = Math.atan2(this.direction.x, this.direction.z);

    // Update eye glow
    const glowIntensity = Math.max(0.5, 1 - (distanceToPlayer / 20));
    this.leftEye.material.color.setRGB(glowIntensity, 0, 0);
    this.rightEye.material.color.setRGB(glowIntensity, 0, 0);
  }
}
