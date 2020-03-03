import CellularAutomata from "./CellularAutomata";

const numOfCellsWeCanHave = (size: number, percentageOfWidth: number = 0.6) => {
  const numCells = Math.floor((window.innerWidth * percentageOfWidth) / size);
  const nearest10NumCells = ((numCells - (numCells % 10)) / 10) * 10;

  return nearest10NumCells;
};

const createSimpleBits = (numCells: number): Array<number> => {
  const data = new Array(numCells);
  for (let i = 0; i < data.length; ++i) data[i] = 0;
  data[Math.floor(numCells / 2)] = 1;

  return data;
};

const createPercentageBits = (
  numCells: number,
  percentage: number
): Array<number> => {
  const data = new Array(numCells);
  for (let i = 0; i < data.length; ++i)
    data[i] = Math.random() < percentage / 100 ? 1 : 0;

  return data;
};

const drawGraph = (
  histogram: Array<number>,
  average: number,
  desviation: number
) => {
  const trace1 = {
    y: histogram,
    type: "bar",
    opacity: 0.6,
    marker: { color: "rgb(158,202,225)" },
    name: "Histogram"
  };

  const trace2 = {
    y: [average, average],
    x: [0, histogram.length - 1],
    mode: 'lines',
    opacity: 0.5,
    marker: { color: "#FC7A7A" },
    name: "Average"
  };

  const trace3 = {
    y: [average + desviation, average + desviation],
    x: [0, histogram.length - 1],
    mode: 'lines',
    opacity: 0.5,
    marker: { color: "#09999" },
    name: "sqrt derivation +"
  };


  const trace4 = {
    y: [average - desviation, average - desviation],
    x: [0, histogram.length - 1],
    mode: 'lines',
    opacity: 0.9,
    marker: { color: "#09999" },
    name: "sqrt derivation -"
  };


  const data = [trace1, trace2, trace3, trace4];

  var layout = {
    title: "Number of ones",
    showlegend: false
  };

  // @ts-ignore
  Plotly.newPlot("graph", data, layout);
};

const doWork = (
  canvas: React.RefObject<HTMLCanvasElement>,
  cellSize: number,
  iterations: number,
  ruleID: number,
  init: Array<number>,
  simpleMode: boolean
): CellularAutomata | undefined => {
  console.log("hey");
  const current_canvas = canvas.current;
  const drawer = current_canvas?.getContext("2d");
  if (!current_canvas || !drawer) return undefined;

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

  if (!simpleMode)
    drawGraph(automata.histogram, automata.average, Math.sqrt(automata.variance));

  return automata;
};

export { numOfCellsWeCanHave, doWork, createSimpleBits, createPercentageBits };
