import React, { useRef, useEffect } from "react";

const BilliardsGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    let ballX = 50;
    let ballY = 50;

    const handleMouseMove = (event: MouseEvent) => {
      ballX = event.clientX - canvas!.offsetLeft;
      ballY = event.clientY - canvas!.offsetTop;
    };

    const draw = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FF0000";

        ctx.beginPath();
        ctx.arc(ballX, ballY, 20, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(draw);
    };

    canvas?.addEventListener("mousemove", handleMouseMove);
    draw();

    return () => canvas?.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return React.createElement("canvas", {
    ref: canvasRef,
    width: 800,
    height: 600,
  });
};

export default BilliardsGame;
