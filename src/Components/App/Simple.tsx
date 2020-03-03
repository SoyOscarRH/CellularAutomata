import React, { useEffect, useRef, useState } from "react";
import styles from "../App/Game.module.css";

import { numOfCellsWeCanHave, createSimpleBits } from "../../General/utils";
import { doWork } from "../../General/utils";
import { useInput } from "../../Hooks/useInput";

const App = () => {
  const [ruleID, bindRule] = useInput(126);
  const [cellSize, bindSize] = useInput(2);

  const cellsInit = numOfCellsWeCanHave(cellSize);
  const [numCells, bindNCells] = useInput(cellsInit);

  const [init, changeInit] = useState([] as Array<number>);

  const isVertical = window.innerWidth < window.innerHeight;
  const stepsInit = isVertical ? 2 * cellsInit : cellsInit;
  const [steps, bindSteps] = useInput(stepsInit);

  const canvas = useRef<HTMLCanvasElement>(null);
  const [width, height] = [cellSize * numCells, cellSize * steps];

  useEffect(() => {
    changeInit(createSimpleBits(numCells));
  }, [numCells]);

  useEffect(() => {
    doWork(canvas, cellSize, steps, ruleID, init, true);
  }, [canvas, cellSize, steps, ruleID, init]);

  return (
    <section className={styles.segment}>
      <div className={styles.container}>
        <label htmlFor="ruleID">Rule: </label>
        <input id="ruleID" min="0" max="255" {...bindRule} />

        <label htmlFor="cellSize">Size of cell: </label>
        <input id="cellSize" min="1" max="15" {...bindSize} />

        <label htmlFor="nCells">Number of cells: </label>
        <input id="nCells" min="10" step="10" max="900" {...bindNCells} />

        <label htmlFor="steps">Iterations: </label>
        <input id="steps" min="10" step="10" {...bindSteps} />
      </div>

      <canvas ref={canvas} {...{ width, height, className: styles.display }} />
    </section>
  );
};

export default App;
