import React from 'react';

// 暴露接口

// box: {region: {width: 360, height: 270, left: 1462, top: 55}, zIndex: 2}
// 弹窗id
// {width: 360, height: 270, left: 1462, top: 55}, zIndex: 2

// 是否是完全受控，defaultCfg就不受控
// cfg 就完全受控
// defaultStyle  不受控
// style    完全受控

interface DashboxProps {
    id?: string | number,
    width?: string;
    height?: string;
    minHeight: string | number;
    minWidth: string | number;
    /**
 *   正数已left为基准
 *   负数已right为基准偏离
 *
 * @type {number}
 * @memberof DashboxProps
 */
    x?: number;

    y?: number;

    visible: boolean;

    /**
     *
     * 当前是否处于选中状态，选中可以拖动
     * @type {boolean}
     * @memberof DashboxProps
     */
    actived: boolean;

    className: string;

    prefixCls: string;

    zIndex: number;
    /**
     *关闭时销毁 Modal 里的子元素
     *
     * @type {boolean}
     * @memberof DashboxProps
     */
    destroyOnClose: boolean;
    /**
     *指定 Modal 挂载的 HTML 节点, false 为挂载在当前 dom
     */
    getContainer: () => HTMLElement;
    mouseEnterClassName: string; // 移入模态框后引入className

    onResize?: () => void;
    /**
     * 结束鼠标点击事件,返回各种信息回去
     */
    onMouseUp: (any) => void
}

// 暴露外部，变成可控与不可能空控两种

interface DashboxState {
    width: string;
    height: string;
    left: string;
    right: string;
    top: string;
    bottom: string;
    zIndex: number;
}

export {
    DashboxProps,
    DashboxState,
};
