import React, { useEffect, useRef, useState } from "react";
import styles from "./App.module.css";

import { useInput } from "../../Hooks/useInput";
import { useToggle } from "../../Hooks/useToggle";
import { numOfCellsWeCanHave, createBits, doWork } from "./utils";
import CellularAutomata from "../../General/CellularAutomata";

const App = () => {
  const [ruleID, bindRule] = useInput(126);
  const [cellSize, bindSize] = useInput(2);

  const cellsInit = numOfCellsWeCanHave(cellSize);
  const [numCells, bindNCells] = useInput(cellsInit);

  const [init, changeInit] = useState([] as Array<number>);

  const isVertical = window.innerWidth < window.innerHeight;
  const stepsInit = isVertical ? 2 * cellsInit : cellsInit;
  const [steps, bindSteps] = useInput(stepsInit);
  const [simpleMode, toggleMode] = useToggle(true);

  const backgroundColor = `rgba(255, 255, 255, ${simpleMode ? 0.7 : 0.1})`;
  const doIt = () => doWork(canvas, cellSize, steps, ruleID, init, simpleMode);
  const props = { className: styles.intenseButton, style: { backgroundColor } };

  const canvas = useRef<HTMLCanvasElement>(null);
  const [width, height] = [cellSize * numCells, cellSize * steps];
  const propsCanvas = { width, height, className: styles.display };

  const automata = useRef<CellularAutomata>();

  useEffect(() => {
    if (simpleMode) changeInit(createBits(numCells));
  }, [numCells, simpleMode]);

  useEffect(() => {
    if (simpleMode) {
      automata.current = doWork(
        canvas,
        cellSize,
        steps,
        ruleID,
        init,
        simpleMode
      );
    }
  }, [simpleMode, canvas, cellSize, steps, ruleID, init]);

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

  useEffect(() => {
    if (simpleMode) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://cdn.plot.ly/plotly-latest.min.js";
    document.body.appendChild(script);
  }, [simpleMode]);

  return (
    <div className={styles.app}>
      <main className={styles.appMain}>
        <h2>Cellular Automata</h2>

        <section className={styles.segment}>
          <div className={styles.container}>
            <button onClick={toggleMode} {...props}>
              Simple Mode {simpleMode ? "on" : "off"}{" "}
            </button>
          </div>

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

          {!simpleMode && (
            <div className={styles.container}>
              <input type="file" id="file" onChange={getInit} />
              <button onClick={doIt}>Simulate automata</button>
            </div>
          )}

          <canvas ref={canvas} {...propsCanvas} />
        </section>

        <hr style={{ visibility: simpleMode ? "hidden" : "initial", width: "80%", borderWidth: "0.1rem" }} />

        <section
          className={styles.segment}
          style={{ visibility: simpleMode ? "hidden" : "initial" }}
        >
          <h2>Analysis</h2>

          {automata.current && (
            <div className={styles.analysisData}>
              <p>Average: {automata.current.average}</p>
              <p>Variance: {automata.current.variance} </p>
            </div>
          )}

          <div id="graph" />
        </section>
      </main>
    </div>
  );
};

export default App;
