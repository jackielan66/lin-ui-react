import React from 'react'

// 暴露接口

// box: {region: {width: 360, height: 270, left: 1462, top: 55}, zIndex: 2}
// 弹窗id
// {width: 360, height: 270, left: 1462, top: 55}, zIndex: 2

// 是否是完全受控，defaultCfg就不受控
// cfg 就完全受控
// defaultStyle  不受控
// style    完全受控

interface DashboxProps {
  id: string | number,
  width: string;
  height: string;
  left: string,
  top: string,
  zIndex: number;
  defaultStyle: React.CSSProperties;
  style: React.CSSProperties;
  /**
   *指定 Modal 挂载的 HTML 节点, false 为挂载在当前 dom
   */
  getContainer: () => HTMLElement;
  mouseEnterClassName: string; // 移入模态框后引入className
  /**
   * 结束鼠标点击事件,返回各种信息回去
   */
  onMouseUp: () => void
}

// 暴露外部，变成可控与不可能空控两种

export default DashboxProps
