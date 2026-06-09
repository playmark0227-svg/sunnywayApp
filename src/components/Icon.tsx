// 手描きの SVG ラインアイコン & コスメのイラスト（サーバー/クライアント両用の純粋表示）
import React from "react";

const ICON: Record<string, string> = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20.5 20.5-3.7-3.7"/>',
  bag: '<path d="M6 8.5h12l-1 10.5a2.2 2.2 0 0 1-2.2 2H9.2A2.2 2.2 0 0 1 7 19L6 8.5Z"/><path d="M9 8.5a3 3 0 0 1 6 0"/>',
  chat: '<path d="M5 6.5h14a1.2 1.2 0 0 1 1.2 1.2v7.6A1.2 1.2 0 0 1 19 16.5H10l-4 3v-3a1.2 1.2 0 0 1-1.2-1.2V7.7A1.2 1.2 0 0 1 5 6.5Z"/>',
  user: '<circle cx="12" cy="8.3" r="3.6"/><path d="M5.2 20a6.8 6.8 0 0 1 13.6 0"/>',
  bell: '<path d="M6.2 10a5.8 5.8 0 0 1 11.6 0c0 4.4 1.8 5.6 1.8 5.6H4.4S6.2 14.4 6.2 10Z"/><path d="M10.2 19.2a1.9 1.9 0 0 0 3.6 0"/>',
  heart: '<path d="M12 20s-6.8-4.2-9.1-8.6A4.4 4.4 0 0 1 12 6.6a4.4 4.4 0 0 1 9.1 4.8C18.8 15.8 12 20 12 20Z"/>',
  chevron: '<path d="m9.5 6 6 6-6 6"/>',
  back: '<path d="m14.5 5.5-6.5 6.5 6.5 6.5"/>',
  plus: '<path d="M12 5.5v13M5.5 12h13"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  send: '<path d="M5 12 20 5l-5 15-3.5-6.5L5 12Z"/>',
  edit: '<path d="M5 19h4l9.5-9.5a2 2 0 0 0-2.8-2.8L6 16v3Z"/><path d="M14.5 7.5 17 10"/>',
  pin: '<path d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"/><circle cx="12" cy="11" r="2.2"/>',
  link: '<path d="M9 13a4 4 0 0 0 6 .5l2.5-2.5a4 4 0 1 0-5.7-5.7L10.6 6.4"/><path d="M15 11a4 4 0 0 0-6-.5L6.5 13a4 4 0 1 0 5.7 5.7l1.2-1.2"/>',
  card: '<rect x="3.5" y="6" width="17" height="12" rx="2.4"/><path d="M3.5 10h17"/>',
  receipt: '<path d="M6 3.5h12v17l-2.2-1.4-2 1.4-2-1.4-2 1.4-2-1.4L6 20.5v-17Z"/><path d="M9 8h6M9 12h6"/>',
  bellgear: '<path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4.2 1.7 5.4 1.7 5.4H4.8S6.5 14.2 6.5 10Z"/><path d="M10.2 19a1.9 1.9 0 0 0 3.6 0"/>',
  logout: '<path d="M14 5h4.5v14H14"/><path d="M10 12h8M14.5 8.5 18 12l-3.5 3.5"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>',
  store: '<path d="M5 9.5 6 5h12l1 4.5M5 9.5h14M5 9.5v9.5h14V9.5M5 9.5a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0"/>',
  spark: '<path d="M12 3c.7 4.6 1.4 5.3 6 6-4.6.7-5.3 1.4-6 6-.7-4.6-1.4-5.3-6-6 4.6-.7 5.3-1.4 6-6Z"/>',
  sun: '<circle cx="12" cy="12" r="4.3"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.2"/><path d="m4 7 8 6 8-6"/>',
  insta: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none"/>',
  shield: '<path d="M12 3 19 6v5c0 5-3.2 8-7 10-3.8-2-7-5-7-10V6l7-3Z"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 1.7"/>',
  tag: '<path d="M4 11V5h6l9 9-6 6-9-9Z"/><circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none"/>',
};

export function Icon({
  name,
  className = "h-6 w-6",
  fill = false,
}: {
  name: string;
  className?: string;
  fill?: boolean;
}) {
  const stroke = fill
    ? { fill: "currentColor" }
    : { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" className={className} {...stroke} dangerouslySetInnerHTML={{ __html: ICON[name] || "" }} />
  );
}

export function SunMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span className={`grid place-items-center rounded-full bg-sunrise text-white ${className}`} style={{ padding: "18%" }}>
      <Icon name="sun" className="h-full w-full" />
    </span>
  );
}

// コスメのラインイラスト
const ART: Record<string, string> = {
  serum: '<rect x="23" y="33" width="18" height="34" rx="7"/><path d="M28 33v-5h8v5"/><rect x="29" y="15" width="6" height="9" rx="2"/><path d="M32 24v5"/><path d="M27 47h10"/>',
  jar: '<rect x="18" y="39" width="28" height="25" rx="10"/><rect x="23" y="27" width="18" height="12" rx="5"/><path d="M26 50h12"/>',
  lipstick: '<rect x="25" y="41" width="14" height="25" rx="4"/><path d="M27 41v-7h10v7"/><path d="M28.5 34l3.5-9 3.5 9"/>',
  tube: '<path d="M27 25h10v5l-1.6 35a3 3 0 0 1-3 2.8h-.8a3 3 0 0 1-3-2.8L27 30v-5Z"/><rect x="29" y="19" width="6" height="6" rx="2"/>',
};

export const ART_BY_CATEGORY = (category: string): string =>
  category === "メイクアップ" ? "lipstick" : category === "ヘアケア" ? "tube" : category === "スキンケア" ? "serum" : "jar";

export const TINT: Record<string, string> = {
  serum: "linear-gradient(135deg,#FDEFE7,#FBE6EC)",
  jar: "linear-gradient(135deg,#F4EFE6,#FBEFD9)",
  lipstick: "linear-gradient(135deg,#FBE6EC,#F6DCEA)",
  tube: "linear-gradient(135deg,#EFEFE9,#F4EFE6)",
};

export function ArtTile({
  art,
  className = "h-44",
  svgClass = "h-24 w-24",
}: {
  art: string;
  className?: string;
  svgClass?: string;
}) {
  const kind = ART[art] ? art : "jar";
  return (
    <div className={`relative w-full overflow-hidden ${className}`} style={{ background: TINT[kind] }}>
      <div className="absolute right-3 top-3 h-10 w-10 rounded-full bg-white/35" />
      <div className="absolute inset-0 grid place-items-center text-ink/55">
        <svg
          viewBox="0 0 64 80"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.1}
          strokeLinejoin="round"
          strokeLinecap="round"
          dangerouslySetInnerHTML={{ __html: ART[kind] }}
        />
      </div>
    </div>
  );
}

export function Pill({ label, className }: { label: string; className: string }) {
  return <span className={`badge ${className}`}>{label}</span>;
}

/** 商品サムネ: 画像があれば画像、なければコスメのイラスト */
export function Thumb({ imageUrl, art, className = "h-44", svgClass = "h-24 w-24" }: { imageUrl?: string; art: string; className?: string; svgClass?: string }) {
  if (imageUrl) {
    return (
      <div className={`relative w-full overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      </div>
    );
  }
  return <ArtTile art={art} className={className} svgClass={svgClass} />;
}
