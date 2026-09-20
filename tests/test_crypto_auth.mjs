import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword, SECURE_DEFAULT_PASSWORD_HASH } from '../src/engine/cryptoAuth.js';

test('Seguridad Criptográfica: Hashing determinista SHA-256 de contraseñas', () => {
  const hash1 = hashPassword('MiClaveSegura2026!');
  const hash2 = hashPassword('MiClaveSegura2026!');
  const hash3 = hashPassword('OtraClaveDistinta');

  assert.equal(typeof hash1, 'string');
  assert.equal(hash1.length, 64, 'El hash SHA-256 debe tener exactamente 64 caracteres hexadecimales');
  assert.equal(hash1, hash2, 'El hashing debe ser determinista para la misma entrada');
  assert.notEqual(hash1, hash3, 'Diferentes contraseñas deben generar hashes distintos');
  assert.notEqual(hash1, 'MiClaveSegura2026!', 'El hash nunca debe coincidir con el texto plano');
});

test('Seguridad Criptográfica: Verificación de contraseñas contra hash almacenado', () => {
  const plain = 'AjedrezFamiliar#1';
  const hashed = hashPassword(plain);

  assert.ok(verifyPassword(plain, hashed), 'Debe verificar exitosamente la contraseña correcta');
  assert.equal(verifyPassword('ClaveIncorrecta', hashed), false, 'Debe rechazar contraseñas inválidas');
  assert.equal(verifyPassword('', hashed), false, 'Debe rechazar cadenas vacías');
});

test('Seguridad Criptográfica: Hash predeterminado corporativo', () => {
  assert.equal(typeof SECURE_DEFAULT_PASSWORD_HASH, 'string');
  assert.equal(SECURE_DEFAULT_PASSWORD_HASH.length, 64);
  assert.ok(verifyPassword('JunV1ll123', SECURE_DEFAULT_PASSWORD_HASH), 'El hash predeterminado debe validar las credenciales de fábrica');
});
