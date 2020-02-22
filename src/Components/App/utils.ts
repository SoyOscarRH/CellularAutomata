import CellularAutomata from "../../General/CellularAutomata";

const numOfCellsWeCanHave = (size: number, percentageOfWidth: number = 0.7) => {
  const numCells = Math.floor((window.innerWidth * percentageOfWidth) / size);
  const nearest10NumCells = ((numCells - (numCells % 10)) / 10) * 10;

  return nearest10NumCells;
};

const createBits = (numCells: number): Array<number> => {
  const data = new Array(numCells);
  for (let i = 0; i < data.length; ++i) data[i] = 0;
  data[Math.floor(numCells / 2)] = 1;

  return data;
};

const doWork = (
  canvas: React.RefObject<HTMLCanvasElement>,
  cellSize: number,
  iterations: number,
  ruleID: number,
  init: Array<number>
): void => {
  const current_canvas = canvas.current;
  const drawer = current_canvas?.getContext("2d");
  if (!current_canvas || !drawer) return;

  const automata = new CellularAutomata(init);

  drawer.clearRect(0, 0, current_canvas!.width, current_canvas.height);
  drawer.fillStyle = "white";

  const n = cellSize;
  for (let it = 0; it < iterations; ++it) {
    automata.data.forEach((cell, index) => {
      if (cell) drawer.fillRect(index * n, it * n, n, n);
    });

    automata.newEpoch(ruleID);
  }
};

export { numOfCellsWeCanHave, doWork, createBits };
