import React, { useRef, useEffect, useState } from "react";
import ColorPicker from "./ColorPicker.tsx";

const BallGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState([
    { id: 1, x: 50, y: 50, dx: 2, dy: 1, color: "#FF0000", radius: 20 },
    { id: 2, x: 150, y: 100, dx: -1, dy: 2, color: "#00FF00", radius: 15 },
    { id: 3, x: 250, y: 150, dx: 1, dy: -2, color: "#0000FF", radius: 10 },
  ]);
  const [selectedBall, setSelectedBall] = useState<{
    id: number;
    color: string;
  } | null>(null);

  let isMouseDown = false;
  let startMouseX = 0;
  let startMouseY = 0;
  let endMouseX = 0;
  let endMouseY = 0;

  const handleBallClick = (ballId: number, color: string) => {
    setSelectedBall({ id: ballId, color });
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    isMouseDown = true;
    startMouseX = event.clientX;
    startMouseY = event.clientY;
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isMouseDown) {
      endMouseX = event.clientX;
      endMouseY = event.clientY;

      const canvas = canvasRef.current;

      if (canvas) {
        const dx = (endMouseX - startMouseX) / 10;
        const dy = (endMouseY - startMouseY) / 10;

        setBalls((prevBalls) =>
          prevBalls.map((ball) => {
            if (ball.id === 1) {
              const newX = ball.x + dx;
              const newY = ball.y + dy;

              let newDx = ball.dx;
              let newDy = ball.dy;

              if (newX - ball.radius < 0 || newX + ball.radius > canvas.width) {
                newDx = -ball.dx;
              }
              if (
                newY - ball.radius < 0 ||
                newY + ball.radius > canvas.height
              ) {
                newDy = -ball.dy;
              }

              return { ...ball, x: newX, y: newY, dx: newDx, dy: newDy };
            } else {
              return ball;
            }
          })
        );
      }
    }
  };

  const handleMouseUp = () => {
    if (isMouseDown) {
      const canvas = canvasRef.current;
      const dx = (endMouseX - startMouseX) / 10;
      const dy = (endMouseY - startMouseY) / 10;

      if (canvas) {
        setBalls((prevBalls) =>
          prevBalls.map((ball) => (ball.id === 1 ? { ...ball, dx, dy } : ball))
        );
      }

      isMouseDown = false;
    }
  };

  const handleCollisions = () => {
    for (let i = 0; i < balls.length; i++) {
      for (let j = i + 1; j < balls.length; j++) {
        const ballA = balls[i];
        const ballB = balls[j];
        const dx = ballB.x - ballA.x;
        const dy = ballB.y - ballA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ballA.radius + ballB.radius) {
          const angle = Math.atan2(dy, dx);
          const sine = Math.sin(angle);
          const cosine = Math.cos(angle);

          const vx1 = ballA.dx;
          const vy1 = ballA.dy;
          const vx2 = ballB.dx;
          const vy2 = ballB.dy;

          const newVx1 =
            ((ballA.radius - ballB.radius) * vx1 + 2 * ballB.radius * vx2) /
            (ballA.radius + ballB.radius);
          const newVy1 =
            ((ballA.radius - ballB.radius) * vy1 + 2 * ballB.radius * vy2) /
            (ballA.radius + ballB.radius);
          const newVx2 =
            ((ballB.radius - ballA.radius) * vx2 + 2 * ballA.radius * vx1) /
            (ballA.radius + ballB.radius);
          const newVy2 =
            ((ballB.radius - ballA.radius) * vy2 + 2 * ballA.radius * vy1) /
            (ballA.radius + ballB.radius);

          ballA.dx = newVx1;
          ballA.dy = newVy1;
          ballB.dx = newVx2;
          ballB.dy = newVy2;
        }
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const draw = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        balls.forEach((ball) => {
          ctx.fillStyle = ball.color;
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
          ctx.fill();

          if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
            ball.dx = -ball.dx;
          }
          if (
            ball.y - ball.radius < 0 ||
            ball.y + ball.radius > canvas.height
          ) {
            ball.dy = -ball.dy;
          }

          ball.x += ball.dx;
          ball.y += ball.dy;
        });

        handleCollisions();
      }

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
      {selectedBall && (
        <ColorPicker
          selectedBallColor={selectedBall.color}
          onUpdateColor={(color) => {
            if (selectedBall && selectedBall.id !== null) {
              setBalls((prevBalls) =>
                prevBalls.map((ball) =>
                  ball.id === selectedBall.id ? { ...ball, color } : ball
                )
              );
              setSelectedBall({ ...selectedBall, color });
            }
          }}
        />
      )}
    </div>
  );
};

export default BallGame;
