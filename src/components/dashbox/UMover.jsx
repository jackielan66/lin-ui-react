import React from 'react';
import _ from 'lodash';
import style from './index.module.less';
import { addUserSelectStyles, removeUserSelectStyles } from './utils/domFns';

/**
 * 获取给定变量中第一个是数字的值
 * @param {any} param
 * @return {number | undefined} - first number or undefined if not found
 */
export function getNumber(...param) {
    return param.find((n) => typeof n === 'number');
}

class UMover extends React.Component {
    constructor(props) {
        super(props);
        this.dragHeader = false; // 只有拖动了header才改变模态框位置
        this.moveOffset = {
            x: 0,
            y: 0,
        };

        this.dragHeadHandler = _.throttle((e) => this.dragHead(e), 10);
        this.internalDragHandler = _.throttle((e) => this.onInternalDrag(e), 10);
        this.state = {
            top: props.top,
            bottom: props.bottom,
            left: props.left,
            right: props.right,
            width: props.width,
            height: props.height || props.minHeight,
        };
    }

    // 移动中
    onInternalDrag(e, touch = false) {
        const { dialogNode, onDrag } = this.props;
        const { DragCallBack } = this.props;
        if (this.dragHeader) {
            // this.dragHeader = false;
            let top = (touch ? e.targetTouches[0].clientY : e.clientY) + this.moveOffset.y;
            let right = -(touch ? e.targetTouches[0].clientX : e.clientX) + this.moveOffset.x;
            let left = (touch ? e.targetTouches[0].clientX : e.clientX) - this.moveOffset.x;

            const CSS = getComputedStyle(dialogNode);
            const pCSS = getComputedStyle(document.body);

            if (left + parseFloat(CSS.width || 0) + parseFloat(CSS.borderWidth || 0)
                > parseFloat(pCSS.width || 0)) {
                left = parseFloat(pCSS.width || 0)
                    - parseFloat(CSS.width || 0) - parseFloat(CSS.borderWidth || 0);
            }

            if (
                right + parseFloat(CSS.width || 0) + parseFloat(CSS.borderWidth || 0)
                > parseFloat(pCSS.width || 0)
            ) {
                right = parseFloat(pCSS.width || 0)
                    - parseFloat(CSS.width || 0) - parseFloat(CSS.borderWidth || 0);
            }
            if (left < 0) left = 0;
            if (right < 0) right = 0;
            if (
                top + parseFloat(CSS.height || 0) + parseFloat(CSS.borderWidth || 0)
                > parseFloat(pCSS.height || 0)
            ) {
                top = parseFloat(pCSS.height || 0)
                    - parseFloat(CSS.height || 0) - parseFloat(CSS.borderWidth || 0);
            }
            if (top < 0) top = 0;

            // console.log(left, 'left')
            // return
            onDrag?.({
                top,
                left,
                right: 'initial',
                bottom: 'initial',
            });
            // 执行拖拽后的回调函数
            if (DragCallBack && typeof DragCallBack === 'function') {
                DragCallBack({
                    top,
                    right,
                    width: parseFloat(CSS.width || 350),
                    bottom: 'initial',
                    left: 'initial',
                });
            }
        }
    }

    startDrag(e, touch = false) {
        const { dialogNode } = this.props;
        if (dialogNode) {
            const CSS = getComputedStyle(dialogNode);
            this.moveOffset.x = -parseFloat(CSS.left || 0)
                + (touch ? e.targetTouches[0].clientX : e.clientX)
                - parseFloat(CSS.borderWidth || 0);
            this.moveOffset.y = parseFloat(CSS.top || 0)
                - (touch ? e.targetTouches[0].clientY : e.clientY)
                - parseFloat(CSS.borderWidth || 0);
            document.addEventListener('mousemove', this.internalDragHandler);
            addUserSelectStyles(document);
        }
    }

    render() {
        const {
            minHeight, minWidth, actived, prefixCls, onDragEnd,
        } = this.props;

        return (
            <div
                role="presentation"
                className={style[`${prefixCls}-u-mover`]}
                onMouseDown={(e) => {
                    this.dragHeader = true;
                    // this.pressHead(e)
                    this.startDrag(e);
                }}
                onMouseUp={() => {
                    // document.removeEventListener('mousemove', this.dragHeadHandler)
                    document.removeEventListener('mousemove', this.internalDragHandler);
                    removeUserSelectStyles(document);
                    onDragEnd?.();
                    this.dragHeader = false;
                }}
            />
        );
    }
}

export default UMover;
