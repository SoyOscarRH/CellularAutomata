import React, { useEffect, useRef, useState } from "react";
import styles from "./App.module.css";

import { useInput } from "../../Hooks/useInput";
import { useToggle } from "../../Hooks/useToggle";
import { numOfCellsWeCanHave, createBits, doWork } from "./utils";

const App = () => {
  const [ruleID, bindRule] = useInput(126);
  const [cellSize, bindSize] = useInput(2);

  const cellsInit = numOfCellsWeCanHave(cellSize);
  const [numCells, bindNCells] = useInput(cellsInit);

  const [init, changeInit] = useState([] as Array<number>);

  const isVertical = window.innerWidth < window.innerHeight;
  const stepsInit = isVertical ? 2 * cellsInit : cellsInit;
  const [steps, bindSteps] = useInput(stepsInit);
  const [intenseMode, toggleMode] = useToggle(!isVertical);

  const backgroundColor = `rgba(255, 255, 255, ${intenseMode ? 0.7 : 0.1})`;
  const doIt = () => doWork(canvas, cellSize, steps, ruleID, init, intenseMode);
  const props = { className: styles.intenseButton, style: { backgroundColor } };

  const canvas = useRef<HTMLCanvasElement>(null);
  const [width, height] = [cellSize * numCells, cellSize * steps];
  const propsCanvas = { width, height, className: styles.display };

  useEffect(() => {
    if (intenseMode) changeInit(createBits(numCells));
  }, [numCells, intenseMode]);

  useEffect(() => {
    if (intenseMode) doWork(canvas, cellSize, steps, ruleID, init, intenseMode);
  }, [intenseMode, canvas, cellSize, steps, ruleID, init]);

  const getInit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = e => {
      const text = e.target?.result as string;
      let data = text.split(",").map(i => Number(i)) as Array<number>;
      // @ts-ignore
      bindNCells.onChange({ target: { value: data.length } });
      changeInit(data);
    };
  };

  return (
    <div className={styles.app}>
      <main className={styles.appMain}>
        <h2>Cellular Automata</h2>

        <section className={styles.container}>
          <button onClick={toggleMode} {...props}>
            Simple Mode {intenseMode ? "on" : "off"}{" "}
          </button>
        </section>

        <section className={styles.container}>
          <label htmlFor="ruleID">Rule: </label>
          <input id="ruleID" min="0" max="255" {...bindRule} />

          <label htmlFor="cellSize">Size of cell: </label>
          <input id="cellSize" min="1" max="15" {...bindSize} />

          <label htmlFor="nCells">Number of cells: </label>
          <input id="nCells" min="10" step="10" max="900" {...bindNCells} />

          <label htmlFor="steps">Iterations: </label>
          <input id="steps" min="10" step="10" {...bindSteps} />
        </section>

        {!intenseMode && (
          <section className={styles.container}>
            <input type="file" id="file" onChange={getInit} />
            <button onClick={doIt}>Simulate automata</button>
          </section>
        )}

        <canvas ref={canvas} {...propsCanvas} />
        <div id="graph" style={{visibility: intenseMode? "hidden" : "initial"}} />
      </main>
    </div>
  );
};

export default App;
