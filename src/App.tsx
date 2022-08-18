import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Timeline, Activebar } from "./components";
import { getTimeline, UnitType } from "./components/utils";
import { ConfigContext } from "./components/config-provider";
function App() {
  const [scale, setCount] = useState(30);
  const data = getTimeline(36);
  const unit = 15;
  const type = "hour";
  const pice = UnitType[type] / unit;
  const width = data.length * scale * pice;

  return (
    <div className="App">
      <div className="flex">
        <div className="left">
          <button onClick={() => setCount(scale + 5)}>+</button>
          <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" className="logo" alt="Vite logo" />
          </a>
          <button onClick={() => setCount(scale - 5)}>-</button>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <div className="right">
          <ConfigContext.Provider value={{ unit, type, scale, width }}>
            <Timeline data={data} />
            <Activebar name={"活动中"} start={9} end={16} />
            <Activebar name={"活动2"} start={3} end={8} />
          </ConfigContext.Provider>
        </div>
      </div>
    </div>
  );
}

export default App;
