import { Header } from "../../widgets/header/Header";
import { Footer } from "../../widgets/footer/Footer";
import { useEffect, useRef, useState } from "react";
import skierImg from "../../assets/skier.png";
import treeImg from "../../assets/tree.png";
import BackGame from "../../assets/back-game.jpg";

interface Tree {
  x: number;
  y: number;
}

export default function SkiGame() {
  const [playerX, setPlayerX] = useState(150);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [isGameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState(3);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidth = 800;
  const canvasHeight = 600;
  const treeWidth = 60;
  const treeHeight = 60;
  const playerWidth = 110;
  const playerHeight = 130;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") {
        setPlayerX((x) => Math.max(0, x - 15));
      } else if (e.key === "ArrowRight" || e.key === "d") {
        setPlayerX((x) => Math.min(canvasWidth - playerWidth, x + 15));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (isGameOver) return;

    const gameLoop = setInterval(() => {
      setTrees((prev) => {
        const updated = prev
          .map((tree) => ({ ...tree, y: tree.y - difficulty }))
          .filter((t) => t.y + treeHeight > 0);

        const newTree =
          Math.random() < 0.03
            ? {
                x: Math.random() * (canvasWidth - treeWidth),
                y: canvasHeight + treeHeight,
              }
            : null;

        if (newTree) {
          setScore((s) => s + 1);
        }

        return [...updated, ...(newTree ? [newTree] : [])];
      });

      setDifficulty((d) => Math.min(d + 0.02, 10));
    }, 40); // быстрее движение

    return () => clearInterval(gameLoop);
  }, [isGameOver]);

  // ⛷ перерисовка игры (с правильной логикой рестарта)
  useEffect(() => {
    let animationFrame: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const skier = new Image();
    skier.src = skierImg;
    const tree = new Image();
    tree.src = treeImg;
    const background = new Image();
    background.src = BackGame;

    const draw = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight); // ⬅ рисуем фон

      ctx.drawImage(skier, playerX, 10, playerWidth, playerHeight);

      for (const t of trees) {
        ctx.drawImage(tree, t.x, t.y, treeWidth, treeHeight);
      }

      for (const t of trees) {
        if (
          t.y <= 10 + playerHeight &&
          t.y + treeHeight >= 10 &&
          t.x < playerX + playerWidth &&
          t.x + treeWidth > playerX
        ) {
          setGameOver(true);
          return;
        }
      }

      if (!isGameOver) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    // skier.onload = tree.onload = () => {
    //   animationFrame = requestAnimationFrame(draw);
    // };

    let loaded = 0;
    const tryStart = () => {
      loaded++;
      if (loaded === 3) animationFrame = requestAnimationFrame(draw);
    };

    skier.onload = tryStart;
    tree.onload = tryStart;
    background.onload = tryStart;

    return () => cancelAnimationFrame(animationFrame);
  }, [trees, playerX, isGameOver]);

  const restartGame = () => {
    setPlayerX(150);
    setTrees([]);
    setScore(0);
    setDifficulty(4);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mt-12 mx-auto p-8 transition-all duration-300 animate-fade-in">
          <div className="flex flex-col items-center gap-4 py-6">
            <h2 className="text-2xl font-bold text-gray-900">⛷ Игра: Лыжник</h2>
            <p className="text-sm text-gray-700">Счёт: {score}</p>
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className="border border-gray-400 rounded"
            />
            {isGameOver && (
              <>
                <div className="text-red-600 font-semibold text-lg">
                  💥 Столкновение! Игра окончена
                </div>
                <button
                  onClick={restartGame}
                  className="mt-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800"
                >
                  Начать заново
                </button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
