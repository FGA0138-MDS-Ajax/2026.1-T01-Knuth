import modulo1 from './modulo1';
import modulo2 from './modulo2';
import modulo3 from './modulo3';
import modulo4 from './modulo4';
import modulo5 from './modulo5';
import modulo6 from './modulo6';
import modulo7 from './modulo7';
import modulo8 from './modulo8';

export const modulos = [modulo1, modulo2, modulo3, modulo4, modulo5, modulo6, modulo7, modulo8];

export function getModuloById(id) {
  return modulos.find((m) => m.id === Number(id));
}

export function getProximoModulo(id) {
  const indice = modulos.findIndex((m) => m.id === Number(id));
  return indice >= 0 && indice < modulos.length - 1 ? modulos[indice + 1] : null;
}
