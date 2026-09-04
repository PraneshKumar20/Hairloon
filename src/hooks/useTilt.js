import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useTilt({ maxTilt = 16, yOffset = -4, duration = 0.6 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set 3D perspective
    gsap.set(el, { transformPerspective: 1000, transformStyle: "preserve-3d" });

    // Create GSAP quickTo functions for smooth animation
    const xTo = gsap.quickTo(el, "rotationY", { duration, ease: "power3" });
    const yTo = gsap.quickTo(el, "rotationX", { duration, ease: "power3" });
    const transYTo = gsap.quickTo(el, "y", { duration, ease: "power3" });

    const onPointerMove = (e) => {
      if (e.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const tiltX = ((x / rect.width) - 0.5) * maxTilt;
      const tiltY = ((y / rect.height) - 0.5) * -maxTilt;
      
      xTo(tiltX);
      yTo(tiltY);
      transYTo(yOffset);
    };

    const onPointerLeave = (e) => {
      if (e.pointerType === "touch") return;
      xTo(0);
      yTo(0);
      transYTo(0);
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);

    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [maxTilt, yOffset, duration]);

  return ref;
}
