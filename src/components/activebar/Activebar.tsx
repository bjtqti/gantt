import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { ConfigContext } from "../config-provider";
import { TaskType } from "../types";
import { getBarTime, Themes } from "../utils";
import Tooltip from "../tooltip/Tooltip";

const DIR_LEFT = "left";
const DIR_RIGHT = "right";
const DIR_MID = "middle";

// 占一行的包装容器
const Box = styled.div<{ width: number }>`
  position: relative;
  width: ${(props) => props.width}px;
  height: 30px;
  border-bottom: 1px solid #e8e8e8;
  box-sizing: border-box;
`;

// 进度条
const Bar = styled.div<{ width: number; left: number }>`
  position: absolute;
  top: 2px;
  left: ${(props) => props.left}px;
  z-index: 3;
  width: ${(props) => props.width}px;
  height: 25px;
  background-color: ${(props) => props.theme.main};
`;

// We are passing a default theme for Buttons that arent wrapped in the ThemeProvider
Bar.defaultProps = {
  theme: {
    main: "palevioletred",
    dark: "gray",
  },
};

// 任务条主体
const LabelBar = styled.div`
  position: relative;
  height: 100%;
  font-size: 12px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
`;
// 灵活配置区间容器
const BarTR = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  pointer-events: none;
`;
// 灵活配置区单元格
const BarTd = styled.div<{ width: number; scale: number }>`
  display: flex;
  flex-wrap: nowrap;
  width: ${(props) => props.width}px;
  height: 100%;
  border: 1px solid #e8e8e8;
  background-color: white;
  box-sizing: border-box;
  & > div {
    border-left: 1px solid #e8e8e8;
  }
`;
// 两端剪头区
const Arrow = styled.div`
  position: absolute;
  top: 0;
  z-index: 1;
  width: 5px;
  height: 100%;
  &:hover {
    background-color: ${(p) => p.theme.dark};
    cursor: ew-resize;
  }
`;
// 左边箭头
const ArrowLeft = styled(Arrow)`
  left: 0;
`;
// 右边箭头
const ArrowRight = styled(Arrow)`
  right: 0;
`;
// 悬浮提示层
const TipBar = styled.div`
  padding: 0 10px;
  min-width: 100px;
  background-color: white;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 12px;
`;

// 事件数据
export declare type EventRow = {
  x: number;
  y: number;
  keep: boolean;
  action?: string;
  width?: number;
};

// 活动数据
export interface ActivebarProps {
  start: number;
  end: number;
  name?: string;
  task?: TaskType;
  focus?: boolean;
  earliestStart?: number;
  latestStart?: number;
  flexible?: boolean;
  duration?: number;
  click?: (e?: any) => void;
}

/**
 * 活动进度条
 * @param props
 * @returns React.Node
 */
const Activebar: React.FC<ActivebarProps> = (props) => {
  const {
    start,
    end,
    name = "",
    task = "queue",
    focus = false,
    earliestStart = 0,
    latestStart = 0,
    flexible = false,
    duration = 0,
  } = props;
  const context = React.useContext(ConfigContext);
  //   console.log(context);
  const { scale, unit } = context;

  // 进度条的左边距
  const [positionLeft, setPostionLeft] = React.useState(scale);
  // 进度条的长度
  const [positionLong, setPositionLong] = React.useState(0);
  // 进度条的光标样式
  const [cursor, setCursor] = React.useState("default");
  // 区间提示内容
  const [tips, setTips] = React.useState("");

  // 当前活动悬浮提示
  const [activeItem, setActiveItem] = React.useState<EventRow>({
    x: 0,
    y: 0,
    keep: false,
  });

  // 包装容器
  const rootRef = React.useRef<HTMLDivElement>(null);
  // 进度条本身
  const handRef = React.useRef<HTMLDivElement>(null);
  // 事件相关数据
  const evtRef = React.useRef<EventRow>({ x: 0, y: 0, keep: false });

  // 时间转换成长度
  const getPosition = (minute: number) => {
    return (minute / unit) * scale;
  };

  React.useEffect(() => {
    const left = getPosition(start);
    const width = getPosition(end - start + duration);
    const st = getBarTime(start, "hour");
    const et = getBarTime(end, "hour");
    setPostionLeft(left);
    setPositionLong(width);
    setTips(`${st} - ${et}`);
  }, [start, end, scale, unit]);

  React.useEffect(() => {
    if (handRef && focus) {
      setTimeout(() => {
        handRef.current?.scrollIntoView();
      }, 100);
    }
  }, [handRef, focus]);

  React.useEffect(() => {
    // 拖动在进度条之外释放
    const wrap = rootRef?.current?.parentNode as HTMLElement;
    if (wrap) {
      wrap.addEventListener("mouseup", onMouseUp, false);
    }
    return () => {
      wrap.removeEventListener("mouseup", onMouseUp, false);
    };
  }, [rootRef]);

  // 从左边拉
  const onResizeLeftPull = (distance: number) => {
    const left = positionLeft + distance;
    const width = positionLong - distance;
    console.log(distance, "*distance");
    if (left > 0) {
      setPostionLeft(left);
      setPositionLong(width);
      //   debunceLeft();
      // console.log("<---left **", left);
    }
  };

  // 从左边推
  const onResizeLeftPush = (distance: number) => {
    let left = positionLeft + distance;
    let width = positionLong - distance;
    if (width < scale) {
      // 保留最小宽度
      width = scale;
      left = positionLeft;
    }
    setPostionLeft(left);
    setPositionLong(width);
    // debunceLeft();
    // console.log("left --> **");
  };

  // 从右边拉
  const onResizeRightPull = (distance: number, offsetLeft: number) => {
    let width = distance + positionLong;
    if (width > context.width - offsetLeft) {
      width = context.width - offsetLeft;
    }
    setPositionLong(width);
    // debunceRight();
    // console.log("<--- right");
  };

  // 从右边推
  const onResizeRightPush = (distance: number) => {
    let width = distance + positionLong;
    if (width < scale) {
      // 保留最小宽度
      width = scale;
    }
    setPositionLong(width);
    // debunceRight();
    // console.log("right--->");
  };

  // 改变活动区大小
  const onResize = (clientX: number) => {
    // const distance = clientX - evtRef.current.x;
    const element = handRef.current as HTMLDivElement;
    const rec = element.getBoundingClientRect();
    if (evtRef.current.x > clientX) {
      if (evtRef.current.action === DIR_LEFT) {
        // 从左边往左拉
        onResizeLeftPull(clientX - rec.left);
      } else {
        // 从右往左推
        onResizeRightPush(clientX - rec.right);
      }
    } else {
      if (evtRef.current.action === DIR_LEFT) {
        // 从左往右推
        onResizeLeftPush(clientX - rec.left);
      } else {
        // 从右边向右拉
        onResizeRightPull(clientX - rec.right, element.offsetLeft);
      }
    }
  };

  // 水平位移
  const onMoveH = (clientX: number) => {
    const distance = clientX - evtRef.current.x;
    const clientWidth = evtRef.current.width || 0;
    let left = distance + positionLeft;
    if (left < 0) {
      left = 0;
    }
    if (left > context.width - clientWidth) {
      left = context.width - clientWidth;
    }
    setPostionLeft(left);
    evtRef.current.x = clientX;
    // debunceMove();
    console.log("move <--+-->", distance, positionLong);
  };

  // 更新光标形状
  const updateCursor = (name: string | undefined) => {
    switch (name) {
      case DIR_LEFT:
        setCursor("ew-resize");
        evtRef.current.action = DIR_LEFT;
        break;
      case DIR_RIGHT:
        setCursor("ew-resize");
        evtRef.current.action = DIR_RIGHT;
        break;
      case DIR_MID:
        setCursor("move");
        evtRef.current.action = DIR_MID;
        break;
      default:
        setCursor("default");
        break;
    }
  };

  // 鼠标移动
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    // 非按住鼠标的情况下更新光标
    if (!evtRef.current.keep) {
      // 更新光标状态
      updateCursor(target.dataset.dir);
    } else {
      // 水平方向改变大小
      if (cursor === "ew-resize") {
        onResize(e.clientX);
      } else if (cursor === "move") {
        // 左右平移
        onMoveH(e.clientX);
      }
    }
  };

  // 按下鼠标
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const w = element.clientWidth;
    evtRef.current = {
      ...evtRef.current,
      width: w,
      x: e.clientX,
      y: e.pageY,
      keep: true,
    };
    setActiveItem({ x: 0, y: 0, keep: false });
  };

  // 释放鼠标
  const onMouseUp = () => {
    const keep = evtRef.current.keep;
    evtRef.current = {
      x: 0,
      y: 0,
      keep: false,
      action: "",
      width: 0,
    };

    if (keep) {
    }
  };

  // 鼠标进入进提示
  const onMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    let x = e.pageX;
    let y = e.pageY - 30;
    setActiveItem({ x, y, keep: true });
  };

  // 鼠标移出时关闭提示
  const onMouseLeave = () => {
    setActiveItem({ x: 0, y: 0, keep: false });
  };

  // 点击进度条
  const handleClickBar = () => {
    if (props.click) {
      const { click, ...rest } = props;
      const start = (positionLeft / scale) * unit;
      const end = ((positionLong + positionLeft) / scale) * unit;
      props.click({ ...rest, start, end });
    }
  };

  // 生成任务条
  const renderTaskBar = () => {
    // console.log(task, queue);

    if (flexible && duration > 0) {
      const width = getPosition(duration);
      const rest = width % scale;
      const pice = (width - rest) / scale;
      const arr = new Array(pice).fill(scale);
      // 余下的分钟数做一个格子
      if (rest > 0) {
        arr.push(rest);
      }
      return (
        <BarTR onClick={handleClickBar}>
          <BarTd width={width} scale={scale}>
            {arr.map((v, i) => (
              <div key={i} style={{ width: v }}></div>
            ))}
          </BarTd>
          <div style={{ flex: 1 }}>{name}</div>
        </BarTR>
      );
    }
    return name;
  };

  return (
    <Box
      ref={rootRef}
      width={context.width}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      style={{ cursor }}
    >
      <ThemeProvider theme={Themes[task]}>
        <Bar
          draggable={false}
          ref={handRef}
          left={positionLeft}
          width={positionLong}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <ArrowLeft data-dir={DIR_LEFT} />
          <LabelBar data-dir={DIR_MID} data-task={task}>
            {renderTaskBar()}
          </LabelBar>
          <ArrowRight data-dir={DIR_RIGHT} />
          {activeItem.keep && (
            <Tooltip top={activeItem.y} left={activeItem.x}>
              <TipBar>{tips}</TipBar>
            </Tooltip>
          )}
        </Bar>
      </ThemeProvider>
    </Box>
  );
};

export default Activebar;
