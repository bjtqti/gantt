import React from "react";
import styled from "styled-components";
import { ConfigContext } from "../config-provider";
import { TaskType } from "../types";
import { UnitType, getTaskStyle } from "../utils";

const DIR_LEFT = "left";
const DIR_RIGHT = "right";
const DIR_MID = "middle";

const Box = styled.div<{ width: number }>`
  position: relative;
  width: ${(props) => props.width}px;
  height: 30px;
  border-bottom: 1px solid #e8e8e8;
  box-sizing: border-box;
`;

const BoxRow = styled.div<{ width: number; left: number; bgColor: string }>`
  position: absolute;
  top: 2px;
  left: ${(props) => props.left}px;
  z-index: 3;
  width: ${(props) => props.width}px;
  height: 25px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${(props) => props.bgColor};
`;

const LabelBar = styled.div`
  font-size: 12px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
`;

const Arrow = styled.div`
  position: absolute;
  top: 0;
  z-index: 1;
  width: 5px;
  height: 100%;
  &:hover {
    background-color: #9410c3;
    cursor: ew-resize;
  }
`;

const ArrowLeft = styled(Arrow)`
  left: 0;
`;

const ArrowRight = styled(Arrow)`
  right: 0;
`;

// 事件数据
export declare type EventRow = {
  x: number;
  y: number;
  keep: boolean;
  action?: string;
  width?: number;
};

export interface ActivebarProps {
  start: number;
  end: number;
  name?: string;
  task?: TaskType;
}

/**
 * 活动进度条
 * @param props
 * @returns React.Node
 */
const Activebar: React.FC<ActivebarProps> = (props) => {
  const { name = "work", start, end, task = "queue" } = props;
  const context = React.useContext(ConfigContext);
  //   console.log(context);
  const { scale, unit, type } = context;
  // 进度条的样式
  const [background, setBackground] = React.useState("inherit");
  // 是否允许拖动
  const [draggable, setDraggable] = React.useState(false);
  // 进度条的左边距
  const [positionLeft, setPostionLeft] = React.useState(scale);
  // 进度条的长度
  const [positionLong, setPositionLong] = React.useState(300);
  // 进度条的光标样式
  const [cursor, setCursor] = React.useState("default");

  // 包装容器
  const rootRef = React.useRef<HTMLDivElement>(null);
  // 进度条本身
  const handRef = React.useRef<HTMLDivElement>(null);
  // 事件相关数据
  const evtRef = React.useRef<EventRow>({ x: 0, y: 0, keep: false });

  // 计算位置
  const getPosition = (s: number) => {
    return (s / unit) * scale;
  };

  React.useEffect(() => {
    const style = getTaskStyle(task);
    setBackground(style.background);
  }, [task]);

  React.useEffect(() => {
    const left = getPosition(start);
    const width = getPosition(end - start);
    setPostionLeft(left);
    setPositionLong(width);
  }, [start, end, scale, unit, type]);

  React.useEffect(() => {
    if (handRef) {
      setTimeout(() => {
        handRef.current?.scrollIntoView();
      }, 100);
    }
  }, [handRef]);

  // 从左边拉
  const onResizeLeftPull = (distance: number) => {
    const left = positionLeft + distance;
    const width = positionLong - distance;
    console.log(distance, "*distance");
    if (left > 0) {
      setPostionLeft(left);
      setPositionLong(width);
      //   debunceLeft();
      console.log("<---left **", left);
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
    console.log("left --> **");
  };

  // 从右边拉
  const onResizeRightPull = (distance: number, offsetLeft: number) => {
    let width = distance + positionLong;
    if (width > context.width - offsetLeft) {
      width = context.width - offsetLeft;
    }
    setPositionLong(width);
    // debunceRight();
    console.log("<--- right");
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
    console.log("right--->");
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
      //   console.log(target.dataset.dir, "**");
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

  return (
    <Box
      ref={rootRef}
      width={context.width}
      onMouseMove={onMouseMove}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      style={{ cursor }}
    >
      <BoxRow
        ref={handRef}
        draggable={draggable}
        left={positionLeft}
        width={positionLong}
        bgColor={background}
      >
        <ArrowLeft data-dir={DIR_LEFT} />
        <LabelBar data-dir={DIR_MID}>{name}</LabelBar>
        <ArrowRight data-dir={DIR_RIGHT} />
      </BoxRow>
    </Box>
  );
};

export default Activebar;
