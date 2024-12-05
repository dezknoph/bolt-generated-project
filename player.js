import * as THREE from 'three';

export class Player {
  constructor(camera) {
    this.camera = camera;
    this.sanity = 100;
    this.flashlight = this.createFlashlight();
    this.lastAgentDistance = Infinity;
    this.sanityDecreaseRate = 0.1;
    this.sanityIncreaseRate = 0.05;
  }

  createFlashlight() {
    const flashlight = new THREE.SpotLight(0xffffff, 1);
    flashlight.position.set(0, 0, 0);
    flashlight.angle = Math.PI / 6;
    flashlight.penumbra = 0.1;
    flashlight.decay = 2;
    flashlight.distance = 15;
    flashlight.castShadow = true;
    flashlight.visible = false;

    this.camera.add(flashlight);
    flashlight.target.position.set(0, 0, -1);
    this.camera.add(flashlight.target);

    return flashlight;
  }

  toggleFlashlight() {
    this.flashlight.visible = !this.flashlight.visible;
  }

  updateSanity(agents) {
    let closestDistance = Infinity;
    
    agents.forEach(agent => {
      const distance = this.camera.position.distanceTo(agent.mesh.position);
      closestDistance = Math.min(closestDistance, distance);
    });

    // Decrease sanity when agents are close
    if (closestDistance < 10) {
      this.sanity -= this.sanityDecreaseRate * (1 + (10 - closestDistance) / 5);
    } else {
      // Slowly recover sanity when agents are far
      this.sanity = Math.min(100, this.sanity + this.sanityIncreaseRate);
    }

    // Clamp sanity between 0 and 100
    this.sanity = Math.max(0, Math.min(100, this.sanity));

    // Update UI
    document.getElementById('sanity-fill').style.width = `${this.sanity}%`;
  }

  getPosition() {
    const position = new THREE.Vector3();
    this.camera.getWorldPosition(position);
    return position;
  }
}
