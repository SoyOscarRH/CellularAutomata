import React, { useEffect, useRef } from "react";
import styles from "./App.module.css";

const data = [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0];

const App = () => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const drawer = canvas.current?.getContext("2d");
    if (!drawer) return;

    drawer.fillStyle = "white";
    let currentLine = 0;
    const size = 20;

    for (let i = 0, current = 0; i < data.length; ++i) {
      console.log(data[i], current, currentLine, current + size, currentLine + size)
      if (data[i]) drawer.fillRect(current, currentLine, current + size, currentLine + size);
      current += size
    }

  }, []);

  return (
    <div className={styles.app}>
      <main className={styles.appMain}>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>

        <canvas ref={canvas} width="400" height="400" />
      </main>
    </div>
  );
};

export default App;
