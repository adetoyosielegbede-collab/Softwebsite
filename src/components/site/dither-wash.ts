import { bayer8, BLUE, CELL, coverage, CYAN, field, FRONT, GLYPH_MIN, glyphAt } from "./dither-math";

type Cell = { x: number; y: number; col: number; row: number; threshold: number; field: number };

/**
 * The blue field behind the homepage statement and between pages.
 * Progress rises from the bottom: a cyan glyph edge leads, and every cell
 * that has passed that edge settles into solid brand blue.
 */
export function createDitherWash(canvas: HTMLCanvasElement, scale = 1, noiseScale = 1) {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return null;

  let cells: Cell[] = [];
  let size = CELL * scale;
  let glyph = GLYPH_MIN;
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
    glyph = Math.max(size, GLYPH_MIN * dpr);
    const cols = Math.ceil(w / size);
    const rows = Math.ceil(h / size);
    cells = [];
    for (let row = 0; row < rows; row++) {
      const fromBottom = 1 - (row + 0.5) / Math.max(1, rows);
      for (let col = 0; col < cols; col++) {
        cells.push({
          x: col * size,
          y: row * size,
          col,
          row,
          threshold: bayer8(col, row),
          field: field(col * noiseScale, (rows - 1 - row) * noiseScale, fromBottom),
        });
      }
    }
  };

  const paintGlyphs = (progress: number) => {
    const width = canvas.width;
    const height = canvas.height;
    const cols = Math.ceil(width / glyph);
    const rows = Math.ceil(height / glyph);
    ctx.fillStyle = CYAN;
    ctx.font = `600 ${Math.round(glyph * 0.78)}px ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let row = 0; row < rows; row++) {
      const fromBottom = 1 - (row + 0.5) / Math.max(1, rows);
      const fineRow = Math.floor(((row + 0.5) * glyph) / size);
      for (let col = 0; col < cols; col++) {
        const fineCol = Math.floor(((col + 0.5) * glyph) / size);
        const cover = coverage(progress, field(fineCol * noiseScale, (rows - 1 - row) * noiseScale, fromBottom));
        if (!(cover > 0 && cover < FRONT && bayer8(col, row) < cover)) continue;
        const mark = glyphAt(col, row);
        if (mark === " ") continue;
        const x = col * glyph;
        const y = row * glyph;
        ctx.clearRect(x, y, glyph, glyph);
        ctx.fillText(mark, x + glyph / 2, y + glyph / 2);
      }
    }
  };

  return {
    resize,
    draw(progress: number) {
      const next = Math.round(progress * 1000) / 1000;
      if (next === drawn && canvas.width > 0) return;
      drawn = next;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (next <= 0) return;
      if (next >= 1) {
        ctx.fillStyle = BLUE;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
      }
      for (const cell of cells) {
        const cover = coverage(next, cell.field);
        if (cell.threshold >= cover) continue;
        ctx.fillStyle = cover < FRONT ? CYAN : BLUE;
        ctx.fillRect(cell.x, cell.y, size, size);
      }
      paintGlyphs(next);
    },
  };
}
