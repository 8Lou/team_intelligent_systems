import React, { useRef, useState, useEffect } from "react";
import ColorPicker from "./ColorPicker.tsx";

const BallGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState([
    { id: 1, x: 50, y: 50, dx: 2, dy: 1, color: "#FF0000", radius: 50 },
    { id: 2, x: 150, y: 100, dx: -1, dy: 2, color: "#00FF00", radius: 25 },
    { id: 3, x: 250, y: 150, dx: 1, dy: -2, color: "#0000FF", radius: 30 },
  ]);
  const [selectedBall, setSelectedBall] = useState<number | null>(null);
  const [selectedBallColor, setSelectedBallColor] = useState<string>("");
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const friction = 0.9; // коэффициент трения

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
        setSelectedBallColor(ball.color);

        const speed = 30; // скорость толчка
        const newDx = (dx / distance) * speed;
        const newDy = (dy / distance) * speed;

        // толчок к выбранному шару
        setBalls((prevBalls) =>
          prevBalls.map((b) =>
            b.id === ball.id ? { ...b, dx: newDx, dy: newDy } : b
          )
        );
      }
    });
    const selectedBallIndex = balls.findIndex((b) => b.id === selectedBall);
    if (selectedBallIndex !== -1) {
      const selectedBall = balls[selectedBallIndex];
      setMenuPosition({ x: selectedBall.x, y: selectedBall.y });
    }
  };

  const handleMouseUp = () => {
    setSelectedBall(null);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (selectedBall !== null && canvasRef.current) {
      const selectedBallIndex = balls.findIndex(
        (ball) => ball.id === selectedBall
      );
      const canvas = canvasRef.current;
      const mouseX = event.clientX - canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - canvas.getBoundingClientRect().top;

      if (balls[selectedBallIndex]) {
        const ball = balls[selectedBallIndex];
        const dx = mouseX - ball.x;
        const dy = mouseY - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 5; // скорость шара

        let newDx = (dx / distance) * speed;
        let newDy = (dy / distance) * speed;

        if (
          ball.x + newDx + ball.radius > canvas.width ||
          ball.x + newDx - ball.radius < 0
        ) {
          newDx = -newDx * friction;
        }
        if (
          ball.y + newDy + ball.radius > canvas.height ||
          ball.y + newDy - ball.radius < 0
        ) {
          newDy = -newDy * friction;
        }

        const updatedBalls = balls.map((ball, index) =>
          index === selectedBallIndex ? { ...ball, dx: newDx, dy: newDy } : ball
        );

        setBalls(updatedBalls);
      }
    }
  };

  const handleUpdateColor = (color: string) => {
    const updatedBalls = balls.map((ball) =>
      ball.id === selectedBall ? { ...ball, color: color } : ball
    );
    setBalls(updatedBalls);
  };

  const handleCollisions = () => {
    balls.forEach((ball1, index1) => {
      balls.forEach((ball2, index2) => {
        if (index1 !== index2) {
          const dx = ball2.x - ball1.x;
          const dy = ball2.y - ball1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const totalRadius = ball1.radius + ball2.radius;

          if (distance <= ball1.radius + ball2.radius) {
            // Нормализация вектора
            const normalX = dx / distance;
            const normalY = dy / distance;

            // Расчет относительной скорости
            const relativeVelocityX = ball2.dx - ball1.dx;
            const relativeVelocityY = ball2.dy - ball1.dy;

            // Проекция относительной скорости на нормаль
            const velAlongNormal =
              relativeVelocityX * normalX + relativeVelocityY * normalY;

            // Условие для столкновения (шары удаляются из друг друга)
            if (velAlongNormal > 0) {
              return;
            }

            // Расчет импульса
            const e = 1; // Коэффициент восстановления
            const j = -(1 + e) * velAlongNormal;
            const massSum = ball1.radius + ball2.radius;

            // Изменение скорости шаров
            ball1.dx -= (j * normalX) / massSum;
            ball1.dy -= (j * normalY) / massSum;
            ball2.dx += (j * normalX) / massSum;
            ball2.dy += (j * normalY) / massSum;
          }
        }
      });
    });
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
            ball.x -= ball.dx * friction;
            ball.dx = -ball.dx * friction;
          }
          if (
            ball.y - ball.radius < 0 ||
            ball.y + ball.radius > canvas!.height
          ) {
            ball.y -= ball.dy * friction;
            ball.dy = -ball.dy * friction;
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
    <div style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
      {selectedBall !== null && (
        <div
          style={{
            position: "absolute",
            top: menuPosition.y,
            left: menuPosition.x + 50, // расстояние от шара
          }}
        >
          <ColorPicker
            selectedBallColor={selectedBallColor}
            onUpdateColor={handleUpdateColor}
          />
        </div>
      )}
    </div>
  );
};

export default BallGame;
