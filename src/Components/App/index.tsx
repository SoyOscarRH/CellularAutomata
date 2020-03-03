import React from "react";

import { useToggle } from "../../Hooks/useToggle";

import Simple from "./Simple";
import Advance from "./Advance";

import stylesApp from "./App.module.css";
import stylesGame from "./Game.module.css";

const App: React.FC = () => {
  const [simpleMode, toggleMode] = useToggle(true);

  const style = {backgroundColor: `rgba(255, 255, 255, ${simpleMode ? 0.7 : 0.1})`};
  const props = { className: stylesGame.intenseButton, style };

  const Game = simpleMode? <Simple /> : <Advance />

  return (
    <div className={stylesApp.app}>
      <main className={stylesApp.appMain}>
        <h2>Cellular Automata</h2>

        <section className={stylesGame.segment}>
          <div className={stylesGame.container}>
            <button onClick={toggleMode} {...props}>
              Simple Mode {simpleMode ? "on" : "off"}
            </button>
          </div>
        </section>

        {Game}

      </main>
    </div>
  );
};

export default App;
