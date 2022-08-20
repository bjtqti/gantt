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
  const onClick = (e: any) => {
    console.log(e);
  };
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
            <Activebar
              name={"在线"}
              start={480}
              end={1080}
              task="queue"
              focus={true}
            />
            <Activebar name={"休息"} start={780} end={810} task="break" />
            <Activebar
              name={"用餐"}
              start={720}
              end={780}
              earliestStart={720}
              latestStart={740}
              flexible={true}
              duration={45}
              click={onClick}
              task="meal"
            />
            <Activebar name={"会议"} start={840} end={960} task="meeting" />
            <Activebar name={"培训"} start={840} end={1020} task="training" />
          </ConfigContext.Provider>
        </div>
      </div>
    </div>
  );
}

export default App;
