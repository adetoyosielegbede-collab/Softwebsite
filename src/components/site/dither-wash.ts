import { bayer8, CELL, coverage, CYAN, field } from "./dither-math";

type Cell = { x: number; y: number; threshold: number; field: number };

/**
 * Full-screen cyan pixel wash. `draw(progress)` reveals cells from the
 * bottom of the frame as progress moves from 0 to 1.
 */
export function createDitherWash(canvas: HTMLCanvasElement, scale = 1) {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return null;

  let cells: Cell[] = [];
  let size = CELL * scale;
  let drawn = -1;
  let builtFor = "";

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    const key = `${w}x${h}`;
    if (key === builtFor) return;
    builtFor = key;
    canvas.width = w;
    canvas.height = h;
    drawn = -1;
    size = CELL * scale * dpr;
    const cols = Math.ceil(w / size);
    const rows = Math.ceil(h / size);
    cells = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const fromBottom = 1 - (row + 0.5) / Math.max(1, rows);
        cells.push({
          x: col * size,
          y: row * size,
          threshold: bayer8(col, row),
          field: field(col, row, fromBottom),
        });
      }
    }
    drawn = -1;
  };

  return {
    resize,
    draw(progress: number) {
      const next = Math.round(progress * 1000) / 1000;
      if (next === drawn && canvas.width > 0) return;
      drawn = next;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (next <= 0) return;
      ctx.fillStyle = CYAN;
      const s = size * 0.86;
      for (const cell of cells) {
        if (cell.threshold < coverage(next, cell.field)) ctx.fillRect(cell.x, cell.y, s, s);
      }
    },
  };
}
