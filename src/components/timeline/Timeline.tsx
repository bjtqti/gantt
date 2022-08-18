import React from "react";
import styled from "styled-components";
import { ConfigContext } from "../config-provider";
import { TimelineType } from "../types";
import { UnitType } from "../utils";

const Nav = styled.div<{ width: number | string }>`
  width: ${(props) => props.width}px;
  background-color: #f6f6f6;
  box-sizing: border-box;
  font-size: 12px;
  border-bottom: 2px solid #75a8ff;
`;

const NavUl = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const NavLi = styled.li<{ pice: number; scale: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${(props) => props.pice * props.scale}px;
  text-align: left;
`;

const NavTxt = styled.div`
  height: 16px;
  margin-left: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 700;
  font-family: Arial, Helvetica, sans-serif;
`;

const NavMark = styled.div`
  display: flex;
  align-items: flex-end;
  height: 10px;
  border-left: 1px solid #cbcbcb;
`;

const NavMarkItem = styled.div<{ scale: number }>`
  width: ${(props) => props.scale}px;
  height: 5px;
  border-right: 1px solid #cbcbcb;
  box-sizing: border-box;
`;

export declare type TimelineDataProps = {
  label: string;
  value: number;
  isNext: boolean;
};

export interface TimelineProps {
  data: TimelineDataProps[];
  scale?: number;
  type?: TimelineType;
  unit?: number;
}

/**
 * 时间轴
 * @param props
 * @returns
 */
const Timeline: React.FC<TimelineProps> = (props) => {
  const { data } = props;
  // const scale = 30;
  // const unit = 15;
  // const type = "hour";
  const context = React.useContext(ConfigContext);
  console.log(context);
  const { width, scale = 30, unit = 15, type = "hour" } = context;

  const markNodes = React.useMemo(() => {
    const pice = UnitType[type] / unit;
    const items = [];
    for (let i = 1; i < pice; i++) {
      items.push(<NavMarkItem key={i} scale={scale}></NavMarkItem>);
    }
    return <NavMark>{items}</NavMark>;
  }, [type, scale, unit]);

  // 生成时间轴
  const timeLineNodes = React.useMemo(() => {
    const pice = UnitType[type] / unit;
    return (
      <NavUl>
        {data.map((item) => (
          <NavLi pice={pice} scale={scale} key={item.value}>
            <NavTxt>{item.label}</NavTxt>
            {markNodes}
          </NavLi>
        ))}
      </NavUl>
    );
  }, [data, type, unit]);
  return <Nav width={width}>{timeLineNodes}</Nav>;
};

export default Timeline;
