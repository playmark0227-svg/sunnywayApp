"use client";

import { useEffect } from "react";

// スクロールに応じて、固定ヘッダー（[data-elevate]）へ薄い影を付ける。
// スクロール領域は [data-scroll-root]（無ければ window）を監視する。
export function HeaderElevation() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-scroll-root]");
    const scroller: HTMLElement | Window = root ?? window;
    const getTop = () => (root ? root.scrollTop : window.scrollY);

    let ticking = false;
    const apply = () => {
      ticking = false;
      const elevated = getTop() > 6;
      document.querySelectorAll<HTMLElement>("[data-elevate]").forEach((el) => {
        el.classList.toggle("is-elevated", elevated);
      });
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
