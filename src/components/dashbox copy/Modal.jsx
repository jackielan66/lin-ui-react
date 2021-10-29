import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

import zIndexStore from './zIndexStore';
import style from './index.module.less';
import UMover from './UMover';
import UResize from './UResize';

/**
 * 获取给定变量中第一个是数字的值
 * @param {any} param
 * @return {number | undefined} - first number or undefined if not found
 */
export function getNumber(...param) {
    return param.find((n) => typeof n === 'number');
}

/**
 * @class Modal
 * @desc 通用模态框
 * @constructor
 * @param {object} props - 参数
 * @param {boolean} props.visible - 是否显示
 * @param {string} props.title - 标题
 * @param {object[]} props.children - 模态框内容
 * @props {HTMLElement} props.viewportDiv - 挂载到指定的dom上
 * @param {function} props.onCancel - 关闭回调
 * @param {function} [props.onOk] - 点击确定回调
 * @param {function} [props.onResize] - 用户改变模态框大小触发，回传参数 {dir: string, ('width'|'height'): number}
 * @param {string} [props.width="300px"] - 模态框宽度
 * @param {string} [props.height="200px"] - 模态框高度
 * @param {number} [props.minWidth=0] - 模态框最小宽度，目前只支持px
 * @param {number} [props.minHeight=0] - 模态框最小高度，目前只支持px
 * @param {string} [props.top = "10%"] - 初始的top
 * @param {string} [props.bottom = "initial"] - 初始的bottom
 * @param {string} [props.left = "initial"] - 初始的left
 * @param {string} [props.right = "1%"] - 初始的right
 * @param {string} [props.overflowX="auto"] - css overflow-x
 * @param {string} [props.overflowY="auto"] - css overflow-y
 * @param {string | object} [props.icon] - 模态框图标
 * @param {boolean} [props.destroyOnClose=false] - 关闭模态框是否清空内容
 * @param {boolean} [props.destroySelfOnClose=false] - 关闭模态框是否移除模态框本身
 * @param {boolean} [props.footer = false] - 是否需要footer
 * @param {string} [props.okText = "确定"] - OK按钮的文本
 * @param {boolean} [props.allowDrag = true] - 是否允许拖动
 * @param {boolean} [props.closable = true] - 是否显示右上角的关闭按钮
 * @param {function} [props.DragCallBack = ()=>{}] - 拖拽后的回调
 * @param {string} [props.id = ""] - modal的ID
 * @param {boolean} [props.mask = false] - 是否展示遮罩
 *
 */
let uuid = 0;
function generateUUID() {
    uuid += 1;
    return `${uuid}`;
}

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();

        // 生成唯一标识，记录zIndex;
        this._id = props.id || generateUUID();

        this.state = {
            top: props.top,
            bottom: props.bottom,
            left: props.left,
            right: props.right,
            width: props.width,
            height: props.height || props.minHeight,
            zIndex: zIndexStore.addZIndex(this._id),
            allowDrag: props.allowDrag,
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
        //   zIndex: zIndexStore.addZIndex(this._id),
        // })

        const maxZIndex = zIndexStore.getMax(this._id);
        this.setState({
            zIndex: maxZIndex + 1,
        });
    }

    recordPrevZIndex = () => {
        this.prevZIndex = zIndexStore.getZIndex(this._id);
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
        zIndexStore.setPrev(this._id);
        const latestZIndex = zIndexStore.getZIndex(this._id);
        // console.log(latestZIndex, ' zIndexStore.getZIndex(this._id)')
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
            onMouseUp,
        } = this.props;

        console.log(this.ref, 'this.ref.current');

        return ReactDOM.createPortal((
            <>
                <div
                    ref={this.ref}
                    className={`${style.dialog} ${actived ? style['z-actived'] : ''} ${className}  `}
                    id={this._id}
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
                        // e.stopPropagation()
                        // 恢复到上一次的zindeg
                        this.resetPrevZIndex();
                        // this.setModalToTop()
                    }}
                >
                    <div className={style['dialog-fake-content']}>
                        <UResize
                            minHeight={minHeight}
                            minWidth={minWidth}
                            dialogNode={this.ref.current}
                            rootNode={this.ref.current}
                            prefixCls={prefixCls}
                            onResize={onResize}
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
                            onResizeHeight={(height) => {
                                this.setState({
                                    height,
                                });
                            }}
                            onResizeWidth={(width) => {
                                this.setState({
                                    width,
                                });
                            }}
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
                                style={{
                                    overflowX: this.props.overflowX,
                                    overflowY: this.props.overflowY,
                                }}
                            >
                                {/* TODO: destroyOnClose不启用的时候，子模块一开始就挂载，这和启用的行为是不一样的 */}
                                {this.props.destroyOnClose && !this.props.visible ? '' : this.props.children}
                            </div>

                        </div>
                    </div>

                </div>
            </>
        ), document.body);
    }
}

Modal.propTypes = {
    visible: PropTypes.bool.isRequired,
    // title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    top: PropTypes.string,
    bottom: PropTypes.string,
    left: PropTypes.string,
    right: PropTypes.string,
    icon: PropTypes.node,
    destroyOnClose: PropTypes.bool,
    className: PropTypes.string,
    footer: PropTypes.bool,
    draggable: PropTypes.bool,
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    overflowX: PropTypes.string,
    overflowY: PropTypes.string,
    viewportDiv: PropTypes.object.isRequired, // wtf!!!
    onOk: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
    onResize: PropTypes.func,
    allowDrag: PropTypes.bool,
    okText: PropTypes.string,
    closable: PropTypes.bool,
    DragCallBack: PropTypes.func,
    id: PropTypes.string,
    theme: PropTypes.string,
    mask: PropTypes.bool,
    headerClassName: PropTypes.string,
};

Modal.defaultProps = {
    width: '300px',
    height: '200px',
    top: '160px',
    bottom: 'initial',
    left: '5%',
    right: 'initial',
    icon: '',
    destroyOnClose: false,
    className: '',
    footer: false,
    draggable: true,
    minWidth: 0,
    minHeight: 0,
    overflowX: 'auto',
    overflowY: 'auto',
    allowDrag: true,
    okText: '确定',
    closable: true,
    id: '',
    theme: 'default',
    mask: false,
    headerClassName: '',
    onOk: () => { },
    onResize: () => { },
    DragCallBack: () => { },
};

export {
    zIndexStore,
};
export default Modal;
