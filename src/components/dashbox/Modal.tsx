import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';

import zIndexStore from './zIndexStore';
import * as style from './index.module.less';
import UMover from './UMover';
import UResize from './UResize';

import { DashboxProps, DashboxState } from './interface';

/**
 * 获取给定变量中第一个是数字的值
 * @param {any} param
 * @return {number | undefined} - first number or undefined if not found
 */
export function getNumber(...param) {
    return param.find((n) => typeof n === 'number');
}

let uuid = 0;
function generateUUID() {
    uuid += 1;
    return `${uuid}`;
}

console.log(style, 'style');

class Modal extends React.Component<DashboxProps, DashboxState> {
    ref;

    id;

    prevZIndex;

    constructor(props) {
        super(props);
        this.ref = React.createRef();

        // 生成唯一标识，记录zIndex;
        this.id = props.id || generateUUID();

        this.state = {
            top: props.top,
            bottom: props.bottom,
            left: props.left,
            right: props.right,
            width: props.width,
            height: props.height || props.minHeight,
            zIndex: zIndexStore.addZIndex(this.id),
        };
    }

    shouldComponentUpdate(nextProps) {
        if (!(nextProps.width === this.props.width && nextProps.height === this.props.height)) {
            this.setState({
                width: nextProps.width,
                height: nextProps.height,
            });
            return false;
        }
        return true;
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.visible && this.props.visible) {
            // this.setModalToTop()
        }
    }

    setModalToTop() {
        // debugger
        // this.setState({
        //   zIndex: zIndexStore.addZIndex(this.id),
        // })

        const maxZIndex = zIndexStore.getMax(this.id);
        this.setState({
            zIndex: maxZIndex + 1,
        });
    }

    recordPrevZIndex = () => {
        this.prevZIndex = zIndexStore.getZIndex(this.id);
    }

    // 重置样式到上一层
    resetPrevZIndex = () => {
        if (this.prevZIndex != null) {
            this.setState({
                zIndex: this.prevZIndex,
            });
        }

        // this.setPrevIndex()
    }

    // 测试设置上一层
    setPrevIndex = () => {
        // debugger
        zIndexStore.setPrev(this.id);
        const latestZIndex = zIndexStore.getZIndex(this.id);
        // console.log(latestZIndex, ' zIndexStore.getZIndex(this.id)')
        this.setState({
            zIndex: latestZIndex,
        });
    }

    render() {
        const {
            width, height, top, bottom, left, right, zIndex,
        } = this.state;
        const {
            minHeight, minWidth, actived, className, visible, prefixCls = 'dialog', onResize,
            onMouseUp, getContainer = () => document.body,
        } = this.props;

        console.log(this.ref, 'this.ref.current');

        return ReactDOM.createPortal((
            <>
                <div
                    ref={this.ref}
                    className={`${style.dialog} ${actived ? style['z-actived'] : ''} ${className}  `}
                    id={this.id}
                    style={{
                        display: visible ? 'block' : 'none',
                        width,
                        height,
                        top,
                        bottom,
                        left,
                        right,
                        zIndex,
                    }}
                    role="presentation"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    onMouseDown={(e) => {
                        // e.stopPropagation()
                        this.setModalToTop();
                        this.recordPrevZIndex();
                    }}
                    onMouseUp={(e) => {
                        this.resetPrevZIndex();
                    }}
                >
                    <div className={style['dialog-fake-content']}>
                        <UResize
                            minHeight={minHeight}
                            minWidth={minWidth}
                            dialogNode={this.ref.current}
                            prefixCls={prefixCls}
                            onResize={onResize}
                            getResizeStartInitStyle={(dialogStyle) => {
                                console.log(dialogStyle, 'dialogstyle');
                                this.setState((prevState) => ({
                                    left: dialogStyle.left || prevState.left,
                                    right: dialogStyle.right || prevState.right,
                                    top: dialogStyle.top || prevState.top,
                                    bottom: dialogStyle.bottom || prevState.bottom,
                                    width: dialogStyle.width || prevState.width,
                                    height: dialogStyle.height || prevState.height,
                                }));
                            }}
                            onResizeHeight={(height) => {
                                console.log(height, 'height');
                                this.setState({
                                    height,
                                });
                            }}
                            onResizeWidth={(width) => {
                                console.log(width, 'width');
                                this.setState({
                                    width,
                                });
                            }}
                            getContainer={getContainer}
                        />
                        <UMover
                            minHeight={minHeight}
                            minWidth={minWidth}
                            dialogNode={this.ref.current}
                            prefixCls={prefixCls}
                            onDrag={(dragStyle) => {
                                this.setState((prevState) => ({
                                    left: dragStyle.left,
                                    top: dragStyle.top,
                                    right: 'initial',
                                    bottom: 'initial',
                                }));
                            }}
                        />

                        <div
                            className={style['dialog-content']}
                        >

                            <div
                                className={style.dialogBody}
                            >
                                {this.props.destroyOnClose && !this.props.visible ? '' : this.props.children}
                            </div>

                        </div>
                    </div>

                </div>
            </>
        ), getContainer());
    }
}

export {
    zIndexStore,
};
export default Modal;
