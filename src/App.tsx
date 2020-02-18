import React, { useEffect, useRef, useState } from "react";
import styles from "./App.module.css";

import { getLine } from "./automata";

const App = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);
  const [rule, setRule] = useState(126);

  const [size, setSize] = useState(3);
  const [steps, setSteps] = useState(300);
  const [n, setN] = useState(Math.floor(window.innerWidth * 0.8 / size));

  useEffect(() => {
    const data = Array(n).fill(0);
    data[n / 2] = 1;

    const current_canvas = canvas.current;
    const drawer = current_canvas?.getContext("2d");
    if (!drawer) return;

    drawer.clearRect(0, 0, current_canvas!.width, current_canvas!.height);
    drawer.fillStyle = "white";

    for (let step = 0, line = data; step < steps; ++step) {
      line.forEach((cell, index) => {
        if (!cell) return;
        drawer.fillRect(index * size, step * size, size, size);
      });

      line = getLine(line, rule);
    }
  }, [count]);

  return (
    <div className={styles.app}>
      <main className={styles.appMain}>
        <h2>Cellular Automata</h2>

        <label htmlFor="rule">Rule: </label>
        <input
          id="rule"
          type="number"
          min="0"
          max="255"
          value={rule}
          onChange={e => setRule(Number(e.target.value))}
        />

        <label htmlFor="size">Size of cell: </label>
        <input
          id="size"
          type="number"
          min="1"
          max="10"
          value={size}
          onChange={e => setSize(Number(e.target.value))}
        />

        <label htmlFor="n">Number of cells: </label>
        <input
          id="n"
          type="number"
          min="10"
          step="10"
          max="600"
          value={n}
          onChange={e => setN(Number(e.target.value))}
        />

        <label htmlFor="steps">Iterations: </label>
        <input
          id="steps"
          type="number"
          min="10"
          step="10"
          max="600"
          value={steps}
          onChange={e => setSteps(Number(e.target.value))}
        />

        <button onClick={() => setCount(c => c + 1)}>Go!</button>

        <canvas
          ref={canvas}
          width={size * n}
          height={size * steps}
          style={{
            border: "0.1rem solid rgba(255, 255, 255, .5)",
            margin: "2rem",
            padding: 0
          }}
        />
      </main>
    </div>
  );
};

export default App;
