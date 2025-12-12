"use client";

import { useEffect } from "react";

export default function NoiseLayer() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.mixBlendMode = "soft-light";
    canvas.style.opacity = "0.18";
    canvas.style.zIndex = "0";

    document.body.appendChild(canvas);

    function drawNoise() {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const buffer = imageData.data;

      for (let i = 0; i < buffer.length; i += 4) {
        const g = Math.random() * 255;
        buffer[i] = g;
        buffer[i + 1] = g;
        buffer[i + 2] = g;
        buffer[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
    }

    drawNoise();

    // Cleanup on hot reload
    return () => {
      canvas.remove();
    };
  }, []);

  return null;
}
