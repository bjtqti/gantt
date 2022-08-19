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

// 获取进度条内置样式
export const getTaskStyle = (type: TaskType) => {
  const style = {
    queue: {
      background: "#b3e8fb",
    },
    break: {
      background: "#e7c5af",
    },
    meal: {
      background: "#f2e0a9",
    },
    meeting: {
      background: "#f7b0ae",
    },
    training: {
      background: "#8edfb9",
    },
    logout: {
      background: "#e9c3ee",
    },
    reserved: {
      background: "#f5f5f5",
    },
  };
  return style[type] || {};
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
