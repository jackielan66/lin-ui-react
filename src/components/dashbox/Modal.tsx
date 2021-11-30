import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';

import zIndexStore from './zIndexStore';
import * as style from './index.module.less';
import UMover from './UMover';
import UResize from './UResize';

import { DashboxProps, DashboxState } from './interface';
import { getTransformPos, getStyle } from './utils/positionFns';

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
            top: '',
            bottom: '',
            left: '',
            right: '',
            width: `${props.width}px` || `${props.minWidth}px`,
            height: `${props.height}px` || `${props.minHeight}px`,
            zIndex: props.zIndex, // || zIndexStore.addZIndex(this.id),
        };

        zIndexStore.setData(this.id, props.zIndex);
        zIndexStore.setMax(props.zIndex);
    }

    componentDidMount() {
        // console.log(this.ref, 'ref');
        this.setPosition();
    }

    setPosition = () => {
        const { x, y, getContainer = () => document.body } = this.props;
        const {
            left, right, top, bottom,
        } = getTransformPos({ x, y }, this.ref.current, getContainer());
        this.setState({
            left,
            right,
            bottom,
            top,
        });
    }

    // shouldComponentUpdate(nextProps) {
    //     if (!(nextProps.width === this.props.width && nextProps.height === this.props.height)) {
    //         this.setState({
    //             width: nextProps.width,
    //             height: nextProps.height,
    //         });
    //         return false;
    //     }
    //     return true;
    // }

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

        const maxZIndex = zIndexStore.getMax();
        this.setState({
            zIndex: maxZIndex + 1,
        });
    }

    recordPrevZIndex = () => {
        this.prevZIndex = zIndexStore.getZIndex(this.id);
        // debugger;
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

    onEnd = () => {
        const style = {};
        const { getContainer = () => document.body } = this.props;
        const {
            x, y, width, height, zIndex,
        } = getStyle(this.ref.current, getContainer());
        this.props.onMouseUp?.(style);
        // drag或者resize 结束后 回调
    }

    render() {
        const {
            width, height, top, bottom, left, right, zIndex,
        } = this.state;
        const {
            minHeight = 10, minWidth = 10, actived, className, visible, prefixCls = 'dialog', onResize,
            onMouseUp, getContainer = () => document.body,
            destroyOnClose,
        } = this.props;

        // console.log(this.ref, 'this.ref.current');

        return ReactDOM.createPortal((
            <>
                <div
                    ref={this.ref}
                    className={`${style[prefixCls]} ${actived ? style['z-actived'] : ''} ${className}  `}
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
                        this.props.onClick?.(this.id);
                        e.stopPropagation();
                    }}
                    onMouseDown={() => {
                        // e.stopPropagation()
                        this.setModalToTop();
                        this.recordPrevZIndex();
                    }}
                    onMouseUp={() => {
                        this.resetPrevZIndex();
                    }}
                >
                    <div className={style['dialog-fake-content']}>
                        <UResize
                            minHeight={minHeight}
                            minWidth={minWidth}
                            dialogNode={this.ref.current}
                            prefixCls={prefixCls}
                            getResizeStartInitStyle={(dialogStyle) => {
                                this.setState((prevState) => ({
                                    left: dialogStyle.left || prevState.left,
                                    right: dialogStyle.right || prevState.right,
                                    top: dialogStyle.top || prevState.top,
                                    bottom: dialogStyle.bottom || prevState.bottom,
                                    width: dialogStyle.width || prevState.width,
                                    height: dialogStyle.height || prevState.height,
                                }));
                            }}
                            onResizeHeight={(resizeHeight) => {
                                console.log(resizeHeight, 'resizeHeight');
                                this.setState({
                                    height: resizeHeight,
                                });
                            }}
                            onResizeWidth={(resizeWidth) => {
                                console.log(resizeWidth, 'resizeWidth');
                                this.setState({
                                    width: resizeWidth,
                                });
                            }}
                            onResize={() => {

                            }}
                            onResizeEnd={() => {
                                this.onEnd();
                            }}
                            getContainer={getContainer}
                        />
                        <UMover
                            minHeight={minHeight}
                            minWidth={minWidth}
                            dialogNode={this.ref.current}
                            prefixCls={prefixCls}
                            onDrag={(dragStyle) => {
                                this.setState({
                                    left: dragStyle.left,
                                    top: dragStyle.top,
                                    right: 'initial',
                                    bottom: 'initial',
                                });
                            }}
                            onDragEnd={() => {
                                this.onEnd();
                                // debugger;
                            }}
                        />

                        <div className={style['dialog-body']}>
                            {destroyOnClose && !visible ? '' : this.props.children}
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
