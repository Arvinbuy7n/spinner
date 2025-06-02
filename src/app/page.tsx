"use client";
import { useState, useRef, useEffect } from "react";

const ITEMS = [
  { name: "AK-47 | Redline", weight: 5 },
  { name: "M4A1-S | Cyrex", weight: 3 },
  { name: "AWP | Asiimov", weight: 1 },
  { name: "Glock-18 | Fade", weight: 2 },
  { name: "USP-S | Orion", weight: 2 },
  { name: "Desert Eagle | Blaze", weight: 1 },
  { name: "P90 | Trigon", weight: 3 },
  { name: "MP9 | Hypnotic", weight: 3 },
];

const ITEM_WIDTH = 150;
const REEL_WIDTH = 450;
const DURATION_S = 4;
const DURATION_MS = DURATION_S * 1000;

const RESET_INDEX = 3;
const LOOPS = 10;
const REPEAT_COUNT = RESET_INDEX + LOOPS + 5;

const calculateTranslateX = (index: number) =>
  (REEL_WIDTH - ITEM_WIDTH) / 2 - index * ITEM_WIDTH;

const pickRandomItem = (items: typeof ITEMS) => {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

  let rand = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    rand -= items[i].weight;
    if (rand < 0) return i;
  }

  return items.length - 1;
};

export default function Home() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const resetPosition = (itemIndex: number) => {
    const container = containerRef.current;
    if (!container) return;

    const resetGlobalIndex = RESET_INDEX * ITEMS.length + itemIndex;
    const translateX = calculateTranslateX(resetGlobalIndex);

    requestAnimationFrame(() => {
      container.style.transition = "none";
      container.style.transform = `translateX(${translateX}px)`;
    });
  };

  useEffect(() => {
    resetPosition(0);
  }, []);

  const spin = () => {
    if (spinning || !containerRef.current) return;

    setSpinning(true);
    setResult("");

    const selectedIndex = pickRandomItem(ITEMS);
    const targetIndex = (RESET_INDEX + LOOPS) * ITEMS.length + selectedIndex;
    const targetTranslateX = calculateTranslateX(targetIndex);

    const container = containerRef.current;
    container.style.transition = `transform ${DURATION_S}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
    container.style.transform = `translateX(${targetTranslateX}px)`;

    setTimeout(() => {
      setSpinning(false);
      setResult(ITEMS[selectedIndex].name);
      resetPosition(selectedIndex);
    }, DURATION_MS);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white p-4 font-sans">
      <div className="overflow-hidden w-[450px] h-[100px] border-4 border-yellow-500 bg-zinc-800 relative rounded-lg shadow-xl">
        <div className="absolute top-0 left-1/2 w-1 h-full bg-yellow-400 z-10 shadow-lg -translate-x-1/2" />

        <div ref={containerRef} className="flex h-full">
          {Array.from({ length: REPEAT_COUNT }).flatMap((_, rep) =>
            ITEMS.map((item, i) => (
              <div
                key={`item-${rep}-${i}`}
                className="w-[150px] h-full flex-shrink-0 flex items-center justify-center border-r border-red-700 bg-zinc-700 text-sm font-medium select-none"
              >
                {item.name}
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={spin}
        disabled={spinning}
        className="mt-8 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-zinc-900 font-bold rounded-lg shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95"
      >
        {spinning ? "Opening..." : "Open Case"}
      </button>

      {result && (
        <p className="mt-8 p-4 bg-green-600/20 border border-green-500 rounded-lg shadow-lg text-lg">
          You got: <strong>{result}</strong>
        </p>
      )}
    </main>
  );
}
