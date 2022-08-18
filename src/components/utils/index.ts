// 时间类型对就的单位价值
export const UnitType = {
  hour: 60,
  day: 24,
  month: 30,
  year: 12,
};

// 时间不足10前面补0
const formatTime = (num: number) => {
  return num < 10 ? `0${num}` : num;
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

// 分钟数换成时间轴坐标
export const parseTimeToArray = (minute: number) => {
  return minute / 60;
};

// 把坐标转换成分钟
export const transferLineToMinute = (
  position: number,
  unit: number,
  pice: number
) => {
  const colunm = Math.trunc(position / unit);
  const minute = Math.trunc(60 / pice) * colunm;
  return minute;
};

// 把坐标值转换时间格式
export const transLineToTime = (
  position: number,
  unit: number,
  pice: number
) => {
  const colunm = Math.trunc(position / unit);
  const m = colunm % pice;
  const hours = (colunm - m) / pice;
  const minute = Math.trunc(60 / pice) * m;
  return [hours, minute].map((v) => formatTime(v)).join(":");
};
