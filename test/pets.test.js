import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { PetCompanion } from '../src/game/pets.js';

test('pets - Cyber Dog (Robo-Pup) instantiates with 4 legs, tail, and 11m fetch reach', () => {
  const scene = new THREE.Scene();
  const pet = new PetCompanion('dog', scene);

  assert.equal(pet.petId, 'dog');
  assert.equal(pet.isGroundFollower, true);
  assert.equal(pet.magnetReach, 11.0);
  assert.equal(pet.legs.length, 4);
  assert.ok(pet.tail);
  assert.ok(scene.children.includes(pet.group));

  // Test trot kinematics when moving
  const initialPos = new THREE.Vector3(0, 0, 0);
  pet.update(0.016, 1.0, initialPos, { isMoving: true, speed: 6 });

  // Verify legs animate when moving
  const hasAnimatedLegs = pet.legs.some(leg => leg.rotation.x !== 0);
  assert.ok(hasAnimatedLegs, 'Cyber Dog legs must animate during motion');

  // Verify smooth ground elevation follow convergence
  const highPlatformPos = new THREE.Vector3(5, 4.6, 5);
  for (let f = 0; f < 30; f++) {
    pet.update(0.016, 2.0 + f * 0.016, highPlatformPos);
  }
  assert.ok(Math.abs(pet.group.position.y - 4.6) < 0.2, 'Cyber Dog must converge smoothly to platform elevation height');

  pet.destroy();
  assert.ok(!scene.children.includes(pet.group));
});

test('pets - Cyber Falcon instantiates with flapping wings and 9m fetch reach', () => {
  const scene = new THREE.Scene();
  const pet = new PetCompanion('falcon', scene);

  assert.equal(pet.petId, 'falcon');
  assert.equal(pet.isGroundFollower, false);
  assert.equal(pet.magnetReach, 9.0);
  assert.equal(pet.wings.length, 2);

  // Update kinematics
  pet.update(0.016, 1.0, new THREE.Vector3(0, 0, 0));
  const hasFlappingWings = pet.wings.some(w => w.mesh.rotation.z !== 0);
  assert.ok(hasFlappingWings, 'Cyber Falcon wings must flap during flight');

  pet.destroy();
});

test('pets - Cyber Drone, Magic Pixie, and Fire Sprite magnet reaches and accessories', () => {
  const scene = new THREE.Scene();

  const drone = new PetCompanion('drone', scene);
  assert.equal(drone.magnetReach, 6.0);
  assert.ok(drone.propeller);
  drone.update(0.016, 1.0, new THREE.Vector3(0, 0, 0));
  assert.notEqual(drone.propeller.rotation.y, 0);
  drone.destroy();

  const pixie = new PetCompanion('pixie', scene);
  assert.equal(pixie.magnetReach, 8.0);
  assert.equal(pixie.wings.length, 2);
  pixie.destroy();

  const sprite = new PetCompanion('sprite', scene);
  assert.equal(sprite.magnetReach, 10.0);
  assert.ok(sprite.ember);
  sprite.destroy();
});
