// 依存ライブラリなしの紙吹雪。大きな成功（応募完了・投稿提出・案件完了など）で一瞬だけ舞う。
// canvas を一時生成 → 物理で落下 → 自動で後始末。視差効果オフ時は何もしない。

type Origin = { x: number; y: number };

const COLORS = ["#F26B1F", "#FF6B7D", "#FFB6C8", "#F9AE66", "#7CB342", "#FFD9A8"];

type Piece = {
  x: number; y: number; vx: number; vy: number;
  size: number; rot: number; vr: number; color: string; shape: 0 | 1;
};

/**
 * 紙吹雪を発火する。
 * @param origin 0〜1 の相対座標（既定: 上中央 0.5, 0.28）。クリック位置を渡すと気持ちよい。
 * @param count  枚数（既定 90）
 */
export function fireConfetti(origin?: Partial<Origin>, count = 90): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  const ox = (origin?.x ?? 0.5);
  const oy = (origin?.y ?? 0.28);

  const canvas = document.createElement("canvas");
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  Object.assign(canvas.style, {
    position: "fixed", inset: "0", width: "100%", height: "100%",
    pointerEvents: "none", zIndex: "9999",
  } as CSSStyleDeclaration);
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) { canvas.remove(); return; }
  ctx.scale(dpr, dpr);

  const cx = ox * W;
  const cy = oy * H;
  const pieces: Piece[] = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 6 + Math.random() * 9;
    return {
      x: cx, y: cy,
      vx: Math.cos(angle) * speed * (0.6 + Math.random() * 0.8),
      vy: Math.sin(angle) * speed - (4 + Math.random() * 4),
      size: 6 + Math.random() * 7,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      shape: Math.random() > 0.5 ? 1 : 0,
    };
  });

  const gravity = 0.32;
  const drag = 0.992;
  const start = performance.now();
  const LIFE = 2600;

  let raf = 0;
  const frame = (t: number) => {
    const elapsed = t - start;
    ctx.clearRect(0, 0, W, H);
    let alive = false;
    for (const p of pieces) {
      p.vx *= drag;
      p.vy = p.vy * drag + gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y < H + 30) alive = true;
      const fade = Math.max(0, 1 - elapsed / LIFE);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = fade;
      ctx.fillStyle = p.color;
      if (p.shape === 1) {
        ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    if (alive && elapsed < LIFE) {
      raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf);
      canvas.remove();
    }
  };
  raf = requestAnimationFrame(frame);
}
