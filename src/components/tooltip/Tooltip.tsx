import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

// 挂载到根节点
const tooltipRoot = document.body;

const Arrow = styled.div`
  position: relative;
  &::after {
    content: "";
    position: absolute;
    left: 10px;
    bottom: -5px;
    border-top: 5px solid gray;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
  }
`;

interface TooltipProps {
  top: number;
  left: number;
  zIndex?: number;
}
// 简易版本的tooltip
class Tooltip extends React.Component<TooltipProps, any> {
  public el: HTMLDivElement;

  constructor(props: any) {
    super(props);

    this.el = document.createElement("div");
  }

  forceUpdateDom(props: TooltipProps): void {
    const { top, left, zIndex = 100 } = props;
    this.el.style.top = top + "px";
    this.el.style.left = left + "px";
    this.el.style.position = "absolute";
    this.el.style.zIndex = String(zIndex);
  }

  componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    this.forceUpdateDom(this.props);

    tooltipRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    tooltipRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(<Arrow>{this.props.children}</Arrow>, this.el);
  }
}

export default Tooltip;
