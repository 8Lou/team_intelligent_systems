import React, { useRef, useState, useEffect } from "react";

const BallGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [balls, setBalls] = useState([
    { id: 1, x: 50, y: 50, dx: 2, dy: 1, color: "#FF0000", radius: 50 },
    { id: 2, x: 150, y: 100, dx: -1, dy: 2, color: "#00FF00", radius: 25 },
    { id: 3, x: 250, y: 150, dx: 1, dy: -2, color: "#0000FF", radius: 30 },
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

      setBalls((prevBalls) =>
        prevBalls.map((ball, index) => {
          if (index === selectedBallIndex) {
            const dx = mouseX - ball.x;
            const dy = mouseY - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = 5; // adjust speed as needed

            let newDx = (dx / distance) * speed;
            let newDy = (dy / distance) * speed;

            if (
              ball.x + newDx + ball.radius > canvas.width ||
              ball.x + newDx - ball.radius < 0
            ) {
              newDx = -newDx; // reverse dx if ball hits vertical canvas borders
            }
            if (
              ball.y + newDy + ball.radius > canvas.height ||
              ball.y + newDy - ball.radius < 0
            ) {
              newDy = -newDy; // reverse dy if ball hits horizontal canvas borders
            }

            return { ...ball, dx: newDx, dy: newDy };
          }
          return ball;
        })
      );
    }
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
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
    </div>
  );
};

export default BallGame;
