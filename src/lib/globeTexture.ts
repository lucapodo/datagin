// Texture equirettangolare "pergamena" del globo, disegnata una sola volta su
// un <canvas> con d3-geo e applicata come `map` del materiale della sfera.
//
// Perché una texture e non i layer 3D di three-globe (polygonsData +
// showGraticules)? Quei layer sono mesh/linee separate a pochi millesimi dalla
// superficie: i contorni (GL_LINES, senza antialiasing) e le cap dei poligoni
// vanno in z-fighting tra loro e con la sfera, e i reticoli di three-globe
// stanno *esattamente* sul raggio del globo. Il risultato era un tremolio
// continuo di coste e meridiani durante la rotazione. Disegnando tutto in una
// sola texture con mipmap + filtro anisotropico non c'è più nessuna geometria
// sovrapposta: niente z-fighting, linee antialiasate, e una sola draw call.
import { geoEquirectangular, geoGraticule10, geoPath } from 'd3-geo';
import * as THREE from 'three';
import { borders, landCollection } from './geo';

export const PALETTE = {
  ink: '#1B2B22',
  inkSoft: '#3B4A3D',
  parchment: '#F1E8CC',
  parchmentDark: '#E2D6A8',
};

/**
 * Disegna mare, terre, confini e reticolo su un contesto 2D di
 * dimensioni width x height (rapporto 2:1, proiezione equirettangolare: è
 * esattamente la mappatura UV della SphereGeometry di three-globe).
 */
export function drawAtlas(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const projection = geoEquirectangular()
    .scale(width / (2 * Math.PI))
    .translate([width / 2, height / 2])
    .precision(0.1);
  const path = geoPath(projection, ctx);
  // Spessori in texel, proporzionali alla risoluzione (riferimento: 4096px).
  const k = width / 4096;

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Mare
  ctx.fillStyle = PALETTE.parchment;
  ctx.fillRect(0, 0, width, height);

  // Reticolo 10° sotto le terre, come in una carta stampata
  ctx.beginPath();
  path(geoGraticule10());
  ctx.strokeStyle = 'rgba(27, 43, 34, 0.2)';
  ctx.lineWidth = 1.6 * k;
  ctx.stroke();

  // Terre emerse
  ctx.beginPath();
  path(landCollection);
  ctx.fillStyle = PALETTE.parchmentDark;
  ctx.fill();

  // Confini politici leggeri. Le coste non hanno un contorno: il distacco
  // terra/mare è dato solo dal colore di riempimento, per un tratto più morbido.
  ctx.beginPath();
  path(borders);
  ctx.strokeStyle = 'rgba(27, 43, 34, 0.3)';
  ctx.lineWidth = 1.2 * k;
  ctx.stroke();
}

let cachedMaterial: THREE.MeshPhongMaterial | null = null;

/**
 * Materiale della sfera (singleton: la texture viene generata una sola volta
 * per sessione, anche se il componente del globo viene smontato/rimontato).
 */
export function getAtlasGlobeMaterial(): THREE.MeshPhongMaterial {
  if (cachedMaterial) return cachedMaterial;

  // 4096x2048 è supportato da tutti i device WebGL (anche mobile) e resta
  // nitido fino allo zoom massimo consentito dai controlli.
  const width = 4096;
  const height = width / 2;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) drawAtlas(ctx, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8; // ridotto automaticamente al massimo della GPU

  cachedMaterial = new THREE.MeshPhongMaterial({
    map: texture,
    color: 0xffffff, // la texture porta già i colori della palette
    specular: 0x000000, // aspetto carta, non lucido
    shininess: 1,
  });
  return cachedMaterial;
}
