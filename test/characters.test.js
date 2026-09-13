import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { CHARACTER_ROSTER, CyberRunner } from '../src/game/character.js';

test('characters - CHARACTER_ROSTER defines 6 distinct playable heroes with unique archetypes', () => {
  assert.equal(CHARACTER_ROSTER.length, 6, 'Must provide 6 distinct playable heroes');

  const ids = CHARACTER_ROSTER.map(c => c.id);
  assert.ok(ids.includes('cyber_runner'), 'Must include Cyber Runner');
  assert.ok(ids.includes('shadow_shinobi'), 'Must include Shadow Shinobi');
  assert.ok(ids.includes('titan_mech'), 'Must include Titan Juggernaut');
  assert.ok(ids.includes('void_sorcerer'), 'Must include Void Sorcerer');
  assert.ok(ids.includes('neon_valkyrie'), 'Must include Neon Valkyrie');
  assert.ok(ids.includes('magical_rue'), 'Must include Magical Girl');

  // Verify starter hero is free
  const starter = CHARACTER_ROSTER.find(c => c.id === 'cyber_runner');
  assert.equal(starter.cost, 0, 'Starter Cyber Runner must be free (0 coins)');

  // Verify all characters have perks, titles, and stats
  CHARACTER_ROSTER.forEach(char => {
    assert.ok(char.name && char.name.length > 0, `Hero ${char.id} must have a name`);
    assert.ok(char.title && char.title.length > 0, `Hero ${char.id} must have a title`);
    assert.ok(char.perk && char.perk.length > 0, `Hero ${char.id} must have a signature perk`);
    assert.ok(char.stats, `Hero ${char.id} must specify stat modifiers`);
    assert.ok(typeof char.stats.speedMultiplier === 'number', `${char.id} must specify speedMultiplier`);
    assert.ok(typeof char.stats.jumpBonus === 'number', `${char.id} must specify jumpBonus`);
  });
});

test('characters - Titan Mech grants +1 extra starting armor heart', () => {
  const titan = CHARACTER_ROSTER.find(c => c.id === 'titan_mech');
  assert.equal(titan.stats.extraHearts, 1, 'Titan Mech must grant +1 extra armor heart');
});

test('characters - Void Sorcerer grants +5m passive magnet pull', () => {
  const sorcerer = CHARACTER_ROSTER.find(c => c.id === 'void_sorcerer');
  assert.equal(sorcerer.stats.magnetBonus, 5.0, 'Void Sorcerer must grant +5m passive crystal magnet reach');
});

test('characters - Neon Valkyrie grants air glide capability', () => {
  const valkyrie = CHARACTER_ROSTER.find(c => c.id === 'neon_valkyrie');
  assert.equal(valkyrie.stats.airGlide, true, 'Neon Valkyrie must have airGlide active');
});

test('characters - Magical Girl grants air glide, +1 heart, and +4m starlight magnet', () => {
  const girl = CHARACTER_ROSTER.find(c => c.id === 'magical_rue');
  assert.equal(girl.name, 'Magical Girl');
  assert.equal(girl.stats.airGlide, true, 'Magical Girl must have fairy airGlide active');
  assert.equal(girl.stats.extraHearts, 1, 'Magical Girl must grant +1 extra heart');
  assert.equal(girl.stats.magnetBonus, 4.0, 'Magical Girl must grant +4m starlight magnet reach');
});

test('characters - CyberRunner 3D class instantiates unique 3D geometries for all character types', () => {
  const scene = new THREE.Scene();

  // Test Cyber Runner
  const runner = new CyberRunner({ currentCharacter: 'cyber_runner', playerColor: '#00ff00' }, scene);
  assert.ok(runner.jetpackGroup, 'Cyber Runner must possess twin rocket jetpack');

  // Test Shadow Shinobi
  const shinobi = new CyberRunner({ currentCharacter: 'shadow_shinobi', playerColor: '#ff0055' }, scene);
  assert.ok(shinobi.animatedParts.scarf, 'Shadow Shinobi must have trailing fabric scarf');

  // Test Titan Mech
  const titan = new CyberRunner({ currentCharacter: 'titan_mech', playerColor: '#ff8800' }, scene);
  assert.ok(titan.animatedParts.exhaust, 'Titan Mech must have vertical furnace exhaust stacks');

  // Test Void Sorcerer
  const sorcerer = new CyberRunner({ currentCharacter: 'void_sorcerer', playerColor: '#9900ff' }, scene);
  assert.ok(sorcerer.animatedParts.runeRings, 'Void Sorcerer must have orbiting celestial rune rings');
  assert.ok(sorcerer.animatedParts.catalyst, 'Void Sorcerer must have floating astral catalyst orb');

  // Test Neon Valkyrie
  const valkyrie = new CyberRunner({ currentCharacter: 'neon_valkyrie', playerColor: '#00f0ff' }, scene);
  assert.ok(valkyrie.animatedParts.leftWing && valkyrie.animatedParts.rightWing, 'Neon Valkyrie must have dual photonic wings');

  // Test Magical Girl
  const girl = new CyberRunner({ currentCharacter: 'magical_rue', playerColor: '#ff69b4' }, scene);
  assert.ok(girl.animatedParts.fairyLeftWing && girl.animatedParts.fairyRightWing, 'Magical Girl must have fluttering fairy wings');
  assert.ok(girl.animatedParts.pigtailLeft && girl.animatedParts.pigtailRight, 'Magical Girl must have twin ribbons & pigtails');
  assert.ok(girl.animatedParts.starWandGem, 'Magical Girl must wield star heart wand');
});
