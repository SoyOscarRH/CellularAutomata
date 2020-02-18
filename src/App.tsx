import React, { useEffect, useRef, useState } from "react";
import styles from "./App.module.css";

import { getLine } from "./automata";
import { getBase, bindIt } from "./utils";

const App = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);
  const [rule, setRule] = useState(126);

  const [size, setSize] = useState(3);

  const [x, y] = [window.innerWidth, window.innerHeight];
  const [steps, setSteps] = useState(getBase(size) * (x < y ? 2 : 1));
  const [n, setN] = useState(getBase(size));

  useEffect(() => {
    const data = Array(n).fill(0);
    data[Math.floor(n / 2)] = 1;

    const current_canvas = canvas.current;
    const drawer = current_canvas?.getContext("2d");
    if (!current_canvas || !drawer) return;

    drawer.clearRect(0, 0, current_canvas!.width, current_canvas.height);
    drawer.fillStyle = "white";

    for (let step = 0, line = data; step < steps; ++step) {
      line.forEach((cell, index) => {
        if (!cell) return;
        drawer.fillRect(index * size, step * size, size, size);
      });

      line = getLine(line, rule);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          onChange={bindIt(setRule)}
        />

        <label htmlFor="size">Size of cell: </label>
        <input
          id="size"
          type="number"
          min="1"
          max="10"
          value={size}
          onChange={bindIt(setSize)}
        />

        <label htmlFor="n">Number of cells: </label>
        <input
          id="n"
          type="number"
          min="10"
          step="10"
          max="600"
          value={n}
          onChange={bindIt(setN)}
        />

        <label htmlFor="steps">Iterations: </label>
        <input
          id="steps"
          type="number"
          min="10"
          step="10"
          max="600"
          value={steps}
          onChange={bindIt(setSteps)}
        />

        <button onClick={() => setCount(c => c + 1)}>Go!</button>

        <canvas ref={canvas} width={size * n} height={size * steps} />
      </main>
    </div>
  );
};

export default App;
