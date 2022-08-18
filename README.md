# react-gantt

[![npm](https://img.shields.io/npm/v/react-gantt.svg?style=flat-square)](https://www.npmjs.com/package/web-react-gantt)
[![npm](https://img.shields.io/npm/dt/react-gantt.svg?style=flat-square)](https://www.npmjs.com/package/web-react-gantt)
[![GitHub stars](https://img.shields.io/github/stars/codejamninja/react-gantt.svg?style=social&label=Stars)](https://github.com/bjtqti/gantt)

> Gantt chart react component

Please ★ this repo if you found it useful ★ ★ ★

[Submit](https://github.com/bjtqti/gantt/issues/new) your ReactGantt use cases and
I will feature them in the in the [used by](#used-by) section

## Built by Vite

[![index](https://vitejs.cn/logo.svg)](https://vitejs.cn/config/#build-rollupoptions)
Vite
Next generation frontend tooling

## Features

- Multiple steps
- Custom styles
- Dynamic bounds
- zoom
- drag
- typescript support

## Demo

See a [demo](https://github.com/bjtqti/gantt)

## Installation

```sh
npm i web-react-gantt --save
# or yarn add  web-react-gantt --save
```

## Dependencies

- [NodeJS](https://nodejs.org)
- [React](https://reactjs.org)
- [React DOM](https://reactjs.org/docs/react-dom.html)

## Usage

```tsx
import React, { useState } from "react";

import {
  Timeline,
  Activebar,
  getTimeline,
  UnitType,
  ConfigContext,
} from "web-react-gantt";

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

          <button onClick={() => setCount(scale - 5)}>-</button>
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
```

## Props

#### ReactGantt

Timeline

Activebar

#### Timeline

| Prop Name | Type

width: number;
unit: number;
scale: number;
type: TimelineType;
data: TimelineDataProps[];
scale?: number;
type?: TimelineType;
unit?: number;

#### Activebar

| Prop Name | Type

start: number;
end: number;
name?: string;

## Screenshots

![react-gantt](https://github.com/bjtqti/gantt/blob/master/20220818162735.jpg)

## Contributing

Review the [guidelines for contributing](https://github.com/bjtqti/gantt/blob/master/CONTRIBUTING.md)

## License

[MIT License](https://github.com/bjtqti/gantt/blob/master/LICENSE)

[ouyangli](email:278500368@qq.com) © 2022

## Changelog

Review the [changelog](https://github.com/bjtqti/gantt/blob/master/CHANGELOG.md)

## Credits

- [ouyangli](email:278500368@qq.com) - Author
