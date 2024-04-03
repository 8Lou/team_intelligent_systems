import React, { useRef, useEffect, useState } from "react";
import ColorPicker from "./ColorPicker.tsx";

const CanvasGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ballColor, setBallColor] = useState("#FF0000");
  const [balls, setBalls] = useState([
    { x: 50, y: 50, dx: 2, dy: 1, color: "#FF0000", radius: 20 },
    { x: 150, y: 100, dx: -1, dy: 2, color: "#00FF00", radius: 20 },
    { x: 250, y: 150, dx: 1, dy: -2, color: "#0000FF", radius: 20 },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    const handleMouseMove = (event: MouseEvent) => {
      // ballX = event.clientX - canvas!.offsetLeft;
      // ballY = event.clientY - canvas!.offsetTop;
    };

    const checkCollision = (ball) => {
      balls.forEach((otherBall) => {
        if (ball !== otherBall) {
          const dx = ball.x - otherBall.x;
          const dy = ball.y - otherBall.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < ball.radius + otherBall.radius) {
            const angle = Math.atan2(dy, dx);
            const sine = Math.sin(angle);
            const cosine = Math.cos(angle);

            // Пересчет скоростей шаров при столкновении
            const vx1 = ball.dx * cosine + ball.dy * sine;
            const vy1 = ball.dy * cosine - ball.dx * sine;
            const vx2 = otherBall.dx * cosine + otherBall.dy * sine;
            const vy2 = otherBall.dy * cosine - otherBall.dx * sine;

            // Импульс после столкновения
            const finalVx1 =
              ((ball.radius - otherBall.radius) * vx1 +
                (otherBall.radius + ball.radius) * vx2) /
              (ball.radius + otherBall.radius);
            const finalVx2 =
              ((ball.radius + otherBall.radius) * vx1 +
                (otherBall.radius - ball.radius) * vx2) /
              (ball.radius + otherBall.radius);

            // Обратное преобразование скоростей
            ball.dx = cosine * finalVx1 - sine * vy1;
            ball.dy = cosine * vy1 + sine * finalVx1;
            otherBall.dx = cosine * finalVx2 - sine * vy2;
            otherBall.dy = cosine * vy2 + sine * finalVx2;
          }
        }
      });
    };

    const draw = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        balls.forEach((ball) => {
          ctx.fillStyle = ball.color;
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
          ctx.fill();

          // Обновление координат шаров
          ball.x += ball.dx;
          ball.y += ball.dy;

          // Проверка на столкновение с границами холста
          if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
            ball.dx = -ball.dx;
          }
          if (
            ball.y - ball.radius < 0 ||
            ball.y + ball.radius > canvas.height
          ) {
            ball.dy = -ball.dy;
          }

          checkCollision(ball); // Проверка столкновений с другими шарами
        });
      }

      requestAnimationFrame(draw);
    };

    canvas?.addEventListener("mousemove", handleMouseMove);
    draw();

    return () => canvas?.removeEventListener("mousemove", handleMouseMove);
  }, [balls]);

  const handleColorChange = (color: string) => {
    setBallColor(color);
  };

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={600}></canvas>
      <ColorPicker setColor={handleColorChange} />
    </div>
  );
};

export default CanvasGame;
