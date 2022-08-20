import { TaskType, TimelineType } from "../types";
// 时间类型对就的单位价值
export const UnitType = {
  hour: 60,
  day: 24,
  month: 30,
  year: 12,
};

// 时间数据
export const getTimeline = (max: number) => {
  const arr = [];
  let isNext = false;
  for (let i = 0; i < max; i++) {
    const t = i % 24;
    arr.push({
      label: `${t}:00`,
      value: i,
      isNext: isNext,
    });
    // 下一天
    if (t === 23) {
      isNext = !isNext;
    }
  }
  return arr;
};

export const queue = "queue";
export const meal = "meal";
export const rest = "break";
export const meeting = "meeting";
export const training = "training";
export const logout = "logout";
export const reserved = "reserved";

export const formatTime = (value: number) => {
  return value < 10 ? "0" + value : value;
};

// 进度条类型
export const getTaskType = (type: TaskType) => {
  const task = new Map();
  task.set(queue, "ON_QUEUE");
  task.set(meal, "MEAL");
  task.set(rest, "BREAK");
  task.set(meeting, "MEETING");
  task.set(training, "TRAINING");
  task.set(logout, "LOG_OUT");
  task.set(reserved, "PLACE_HOLD");
  return task.get(type);
};

export const getBarTime = (value: number, type: TimelineType) => {
  const unit = UnitType[type];
  const M = value % unit;
  const H = (value - M) / unit;
  const arr = [H, M].map((v) => formatTime(v));
  return arr.join(":");
};

/**
 * @desc 函数节流:连续触发事件但是在 n 秒中只执行一次函数
 * @param func 函数
 * @param wait 延迟执行毫秒数，控制频率
 */
export const throttle = (func: Function, wait: number) => {
  let timeout: number | null;
  return function (this: any, ...args: any[]) {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        func.apply(this, args);
      }, wait);
    }
  };
};

// 进度条样式
export const Themes = {
  queue: {
    main: "#b3e8fb",
    dark: "#b2c5fe",
  },
  break: {
    main: "#e7c5af",
    dark: "#8d786a",
  },
  meal: {
    main: "#f2e0a9",
    dark: "#a5966b",
  },
  meeting: {
    main: "#f7b0ae",
    dark: "#936261",
  },
  training: {
    main: "#8edfb9",
    dark: "#52846d",
  },
  logout: {
    main: "#e9c3ee",
    dark: "black",
  },
  reserved: {
    main: "#f5f5f5",
    dark: "green",
  },
};
