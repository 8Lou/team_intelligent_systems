import React, { useRef, useEffect, useState } from "react";
import ColorPicker from "./ColorPicker.tsx";

const BallGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState([
    { id: 1, x: 50, y: 50, dx: 2, dy: 1, color: "#FF0000", radius: 20 },
    { id: 2, x: 150, y: 100, dx: -1, dy: 2, color: "#00FF00", radius: 15 },
    { id: 3, x: 250, y: 150, dx: 1, dy: -2, color: "#0000FF", radius: 10 },
  ]);
  const [selectedBall, setSelectedBall] = useState<number | null>(null);

  const handleMouseDown = (event: React.MouseEvent) => {
    const mouseX =
      event.clientX - canvasRef.current!.getBoundingClientRect().left;
    const mouseY =
      event.clientY - canvasRef.current!.getBoundingClientRect().top;

    balls.forEach((ball) => {
      const dx = mouseX - ball.x;
      const dy = mouseY - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= ball.radius) {
        setSelectedBall(ball.id);
      }
    });
  };

  const handleColorChange = (color: string) => {
    setBalls((prevBalls) =>
      prevBalls.map((ball) =>
        ball.id === selectedBall ? { ...ball, color } : ball
      )
    );
    setSelectedBall(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const draw = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas!.width, canvas!.height);
        balls.forEach((ball) => {
          ctx.fillStyle = ball.color;
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
          ctx.fill();

          if (
            ball.x - ball.radius < 0 ||
            ball.x + ball.radius > canvas!.width
          ) {
            ball.dx = -ball.dx;
          }
          if (
            ball.y - ball.radius < 0 ||
            ball.y + ball.radius > canvas!.height
          ) {
            ball.dy = -ball.dy;
          }

          ball.x += ball.dx;
          ball.y += ball.dy;
        });
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, [balls]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
      ></canvas>
      {selectedBall !== null && (
        <div style={{ position: "absolute", top: 15, left: 15 }}>
          <input
            type="color"
            onChange={(e) => handleColorChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default BallGame;
