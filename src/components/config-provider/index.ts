import * as React from "react";
import { TimelineType } from "../types";

/**
 * @params unit 单元代表的刻度值
 * @params scale 比例
 * @params type 时间轴的类型
 */
export interface ConfigConsumerProps {
  width: number;
  unit: number;
  scale: number;
  type: TimelineType;
}

// 默认时间刻度15（分钟|时|天|月|年）
const defaultUnit = 15;
const defaultScale = 30;
const defaultType = "hour";
const defaultWidth = 4320;

export const ConfigContext = React.createContext<ConfigConsumerProps>({
  width: defaultWidth,
  unit: defaultUnit,
  scale: defaultScale,
  type: defaultType,
});

export const ConfigConsumer = ConfigContext.Consumer;
