import React, { useEffect, useRef, useState } from "react";

import CellularAutomata from "../../General/CellularAutomata";

import { numOfCellsWeCanHave, createSimpleBits } from "../../General/utils";
import { doWork, createPercentageBits } from "../../General/utils";

import { useInput } from "../../Hooks/useInput";
import { useToggle } from "../../Hooks/useToggle";

import styles from "./Game.module.css";

const Advance: React.FC = () => {
  const [ruleID, bindRule] = useInput(126);
  const [cellSize, bindSize] = useInput(2);

  const [percentage, bindPercentage] = useInput(50);
  const [usePercentage, togglePercentage] = useToggle(true);

  const cellsInit = numOfCellsWeCanHave(cellSize);
  const [numCells, bindNCells] = useInput(cellsInit);

  const [init, changeInit] = useState([] as Array<number>);

  useEffect(() => {
    if (usePercentage) changeInit(createPercentageBits(numCells, percentage));
  }, [numCells, percentage, usePercentage]);

  useEffect(() => {
    if (!usePercentage) changeInit(createSimpleBits(numCells));
  }, [numCells, usePercentage]);

  const isVertical = window.innerWidth < window.innerHeight;
  const stepsInit = isVertical ? 2 * cellsInit : cellsInit;
  const [steps, bindSteps] = useInput(stepsInit);
 
  const canvas = useRef<HTMLCanvasElement>(null);
  const [width, height] = [cellSize * numCells, cellSize * steps];
  const propsCanvas = { width, height, className: styles.display };

  const automata = useRef<CellularAutomata>();

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

  const backgroundColor = `rgba(255, 255, 255, ${!usePercentage ? 0.7 : 0.1})`;
  const style = { backgroundColor };
  const props = { className: styles.intenseButton, style };

  const doIt = () => {
    doWork(canvas, cellSize, steps, ruleID, init, false);
  }

  return (
    <>
      <section className={styles.segment}>
        <div className={styles.container}>
          <label htmlFor="ruleID">Rule: </label>
          <input id="ruleID" min="0" max="255" {...bindRule} />

          <button onClick={togglePercentage} {...props}>
            1 at the center {!usePercentage ? "on" : "off"}
          </button>

          {usePercentage && (
            <>
              <label htmlFor="percentage">Percentage: </label>
              <input id="percentage" min="1" max="100" {...bindPercentage} />
            </>
          )}

          <br />

          <label htmlFor="cellSize">Size of cell: </label>
          <input id="cellSize" min="1" max="15" {...bindSize} />

          <label htmlFor="nCells">Number of cells: </label>
          <input id="nCells" min="10" step="10" max="900" {...bindNCells} />

          <label htmlFor="steps">Iterations: </label>
          <input id="steps" min="10" step="10" {...bindSteps} />
        </div>

        <div className={styles.container}>
          <input type="file" id="file" onChange={getInit} />
          <button onClick={doIt}>Simulate automata</button>
        </div>

        <canvas ref={canvas} {...propsCanvas} />
      </section>

      <hr style={{ width: "80%", borderWidth: "0.1rem" }} />

      <section className={styles.segment}>
        <h2>Analysis</h2>

        {automata.current && (
          <div className={styles.analysisData}>
            <p>Average: {automata.current.average}</p>
            <p>Variance: {automata.current.variance} </p>
          </div>
        )}

        <div id="graph" />
      </section>
    </>
  );
};

export default Advance;
