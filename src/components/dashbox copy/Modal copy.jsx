import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import _ from 'lodash'

import zIndexStore from './zIndexStore'
import style from './index.module.less'
import { addUserSelectStyles, removeUserSelectStyles } from './utils/domFns'

/**
 * 获取给定变量中第一个是数字的值
 * @param {any} param
 * @return {number | undefined} - first number or undefined if not found
 */
export function getNumber(...param) {
  return param.find((n) => typeof n === 'number')
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
 */
let uuid = 0
function generateUUID() {
  uuid++
  return uuid
}
class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
    this.headerRef = React.createRef()
    this.dragHeader = false // 只有拖动了header才改变模态框位置
    this.dragResizer = '' // 处于何种resize模式，包括上下左右4种
    this.moveOffset = {
      x: 0,
      y: 0,
    }
    this.resizeOffsetXY = {
      x: 0,
      y: 0,
    }
    // 生成唯一标识，记录zIndex;
    this._id = props.id || generateUUID()
    // 回调绑定
    this.resizeMoveHandler = _.throttle((e) => this.resizeModal(e), 10)
    this.resizeEndHandler = this.dragResizeEnd.bind(this)
    this.dragHeadHandler = _.throttle((e) => this.dragHead(e), 10)
    this.state = {
      top: props.top,
      bottom: props.bottom,
      left: props.left,
      right: props.right,
      width: props.width,
      height: props.height || props.minHeight,
      zIndex: zIndexStore.addZIndex(this._id),
      okText: props.okText,
      allowDrag: props.allowDrag,
    }
  }

  shouldComponentUpdate(nextProps) {
    if (!(nextProps.width === this.props.width && nextProps.height === this.props.height)) {
      this.setState({
        width: nextProps.width,
        height: nextProps.height,
      })
      return false
    }
    return true
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.visible && this.props.visible) {
      this.setModalToTop()
    }
  }

  pressHead(e, touch = false) {
    if (!this.dragHeader) {
      // e.dataTransfer.setDragImage(new Image(), 0, 0);
    } else {
      // 用来处理ff不能拖动的bug
      // e.dataTransfer.setData('text', '');
      const CSS = getComputedStyle(this.ref.current)
      this.moveOffset.x = parseFloat(CSS.right || 0)
        + (touch ? e.targetTouches[0].clientX : e.clientX)
        - parseFloat(CSS.borderWidth || 0)
      this.moveOffset.y = parseFloat(CSS.top || 0)
        - (touch ? e.targetTouches[0].clientY : e.clientY)
        - parseFloat(CSS.borderWidth || 0)
      document.addEventListener('mousemove', this.dragHeadHandler)
      addUserSelectStyles(document)
    }
  }

  dragHead(e, touch = false) {
    const { DragCallBack } = this.props
    if (this.dragHeader && this.state.allowDrag) {
      // this.dragHeader = false;
      let top = (touch ? e.targetTouches[0].clientY : e.clientY) + this.moveOffset.y
      let right = -(touch ? e.targetTouches[0].clientX : e.clientX) + this.moveOffset.x
      const CSS = getComputedStyle(this.ref.current)
      const pCSS = getComputedStyle(this.props.viewportDiv)
      if (
        right + parseFloat(CSS.width || 0) + parseFloat(CSS.borderWidth || 0)
        > parseFloat(pCSS.width || 0)
      ) {
        right = parseFloat(pCSS.width || 0)
          - parseFloat(CSS.width || 0) - parseFloat(CSS.borderWidth || 0)
      }
      if (right < 0) right = 0
      if (
        top + parseFloat(CSS.height || 0) + parseFloat(CSS.borderWidth || 0)
        > parseFloat(pCSS.height || 0)
      ) {
        top = parseFloat(pCSS.height || 0)
          - parseFloat(CSS.height || 0) - parseFloat(CSS.borderWidth || 0)
      }
      if (top < 0) top = 0
      this.setState({
        top,
        right,
        bottom: 'initial',
        left: 'initial',
      })
      // 执行拖拽后的回调函数
      if (DragCallBack && typeof DragCallBack === 'function') {
        DragCallBack({
          top,
          right,
          width: parseFloat(CSS.width || 350),
          bottom: 'initial',
          left: 'initial',
        })
      }
    }
  }

  dragResizeStart(e, pos) {
    const target = e.target || e.targetTouches[0]

    if (target && target.getAttribute('data-resize') === 'resize') {
      e.stopPropagation()
      this.dragResizer = pos
      const CSS = getComputedStyle(this.ref.current)
      const x = getNumber(
        e.clientX,
        e.pageX,
        _.get(e, 'targetTouches[0].clientX'),
        _.get(e, 'targetTouches[0].pageX'),
      ) || 0
      const y = getNumber(
        e.clientY,
        e.pageY,
        _.get(e, 'targetTouches[0].clientY'),
        _.get(e, 'targetTouches[0].pageY'),
      ) || 0
      // e.dataTransfer.setDragImage(new Image(), 0, 0);
      // 用来处理ff不能拖动的bug
      // e.dataTransfer.setData('text', '');
      switch (pos) {
        case 'up':
          this.resizeOffsetXY.x = parseFloat(CSS.width || 0) + x
          this.resizeOffsetXY.y = parseFloat(CSS.height || 0) + y
          this.setState({
            top: 'initial',
            bottom: CSS.bottom,
            width: parseFloat(CSS.width || 0),
            height: parseFloat(CSS.height || 0),
          })
          break
        case 'down':
          this.resizeOffsetXY.x = parseFloat(CSS.width || 0) - x
          this.resizeOffsetXY.y = parseFloat(CSS.height || 0) - y
          this.setState({
            top: CSS.top,
            bottom: 'initial',
            width: parseFloat(CSS.width || 0),
            height: parseFloat(CSS.height || 0),
          })
          break
        case 'left':
          this.resizeOffsetXY.x = parseFloat(CSS.width || 0) + x
          this.resizeOffsetXY.y = parseFloat(CSS.height || 0) + y
          this.setState({
            left: 'initial',
            right: CSS.right,
            width: parseFloat(CSS.width || 0),
            height: parseFloat(CSS.height || 0),
          })
          break
        case 'right':
          this.resizeOffsetXY.x = parseFloat(CSS.width || 0) - x
          this.resizeOffsetXY.y = parseFloat(CSS.height || 0) - y
          this.setState({
            left: CSS.left,
            right: 'initial',
            width: parseFloat(CSS.width || 0),
            height: parseFloat(CSS.height || 0),
          })
          break
        default:
          break
      }
      // debugger
      document.addEventListener('mousemove', this.resizeMoveHandler)
      document.addEventListener('mouseup', this.resizeEndHandler)
    }
  }

  /**
 * 改变模态框大小拖动事件处理
 * @param {object} e - event
 */
  resizeModal(e) {
    const MINUS_WIDTH = 20
    const MINUS_HEIGHT = 50
    if (this.dragResizer !== '') {
      e.stopPropagation()

      const x = getNumber(
        e.clientX,
        e.pageX,
        _.get(e, 'targetTouches[0].clientX'),
        _.get(e, 'targetTouches[0].pageX'),
      ) || 0
      let y = getNumber(
        e.clientY,
        e.pageY,
        _.get(e, 'targetTouches[0].clientY'),
        _.get(e, 'targetTouches[0].pageY'),
      ) || 0
      y = y > 0 ? y : 0

      if (x > 0) {
        let n
        const { onResize } = this.props
        switch (this.dragResizer) {
          case 'up':
            n = Math.max(this.resizeOffsetXY.y - y, this.props.minHeight)
            this.setState({
              height: n,
            })
            onResize({
              dir: 'up',
              height: n - MINUS_HEIGHT,
            })
            break
          case 'down':
            n = Math.max(this.resizeOffsetXY.y + y, this.props.minHeight)
            this.setState({
              height: n,
            })
            onResize({
              dir: 'down',
              height: n - MINUS_HEIGHT,
            })
            break
          case 'left':
            n = Math.max(this.resizeOffsetXY.x - x, this.props.minWidth)
            this.setState({
              width: n,
            })
            onResize({
              dir: 'left',
              width: n - MINUS_WIDTH,
            })
            break
          case 'right':
            n = Math.max(this.resizeOffsetXY.x + x, this.props.minWidth)
            this.setState({
              width: n,
            })
            onResize({
              dir: 'right',
              width: n - MINUS_WIDTH,
            })
            break
          default:
            break
        }
      }
    }
  }

  dragResizeEnd() {
    // console.log('dragResizeEnd  end ')
    // debugger
    this.dragResizer = ''
    document.removeEventListener('mousemove', this.resizeMoveHandler)
    document.removeEventListener('mouseup', this.resizeEndHandler)
  }

  setModalToTop() {
    // debugger
    // this.setState({
    //   zIndex: zIndexStore.addZIndex(this._id),
    // })
    this.prevZIndex = zIndexStore.getZIndex(this._id)
    const maxZIndex = zIndexStore.getMax(this._id)
    this.setState({
      zIndex: maxZIndex + 1,
    })
  }

  // 重置样式到上一层
  resetPrevZIndex = () => {
    this.setState({
      zIndex: this.prevZIndex,
    })
    // this.setPrevIndex()
  }

  // 测试设置上一层
  setPrevIndex = () => {
    // debugger
    zIndexStore.setPrev(this._id)
    const latestZIndex = zIndexStore.getZIndex(this._id)
    console.log(latestZIndex, ' zIndexStore.getZIndex(this._id)')
    this.setState({
      zIndex: latestZIndex,
    })
  }

  render() {
    const {
      width, height, top, bottom, left, right, zIndex,
    } = this.state

    const prefixCls = 'dialog'

    console.log('Zindex', zIndex)
    return ReactDOM.createPortal((
      <>
        <div
          ref={this.ref}
          className={`${style.dialog} ${this.props.className}  `}
          id={this._id}
          style={{
            display: this.props.visible ? 'block' : 'none',
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
            e.stopPropagation()
          }}
          onMouseDown={(e) => {
            e.stopPropagation()
            this.setModalToTop()
          }}
        // onMouseUp={(e) => {
        //   e.stopPropagation()
        //   // 恢复到上一次的zindeg
        //   this.resetPrevZIndex()
        //   // this.setModalToTop()
        // }}
        >
          <div className={style['dialog-fake-content']}>
            <div className={style['dialog-u-resize']}>
              <div
                className={style['dialog-row-resize1']}
                className={style[`${prefixCls}-u-resize-top`]}
                draggable={false}
                data-resize="resize"
                onMouseDown={(e) => {
                  this.dragResizeStart(e, 'up')
                }}
              // onTouchStart={(e) => {
              //   this.dragResizeStart(e, 'up')
              // }}
              // onTouchMove={(e) => {
              //   this.resizeModal(e)
              // }}
              // onTouchEnd={() => {
              //   this.dragResizeEnd()
              // }}
              />
              <div
                className={style['dialog-col-resize1']}
                className={style[`${prefixCls}-u-resize-left`]}
                draggable={false}
                data-resize="resize"
                onMouseDown={(e) => {
                  this.dragResizeStart(e, 'left')
                }}
              // onTouchStart={(e) => {
              //   this.dragResizeStart(e, 'left')
              // }}
              // onTouchMove={(e) => {
              //   this.resizeModal(e)
              // }}
              // onTouchEnd={() => {
              //   this.dragResizeEnd()
              // }}
              />
              <div
                className={style.dialogColResize2}
                className={style[`${prefixCls}-u-resize-right`]}
                draggable={false}
                data-resize="resize"
                onMouseDown={(e) => {
                  this.dragResizeStart(e, 'right')
                }}
              // onTouchStart={(e) => {
              //   this.dragResizeStart(e, 'right')
              // }}
              // onTouchMove={(e) => {
              //   this.resizeModal(e)
              // }}
              // onTouchEnd={() => {
              //   this.dragResizeEnd()
              // }}
              />
              <div
                className={style.dialogRowResize2}
                className={style[`${prefixCls}-u-resize-bottom`]}
                draggable={false}
                data-resize="resize"
                onMouseDown={(e) => {
                  this.dragResizeStart(e, 'down')
                }}
              />
            </div>
            {/* <div
              role="presentation"
              className={style['dialog-u-mover']}
              onMouseDown={(e) => {
                this.dragHeader = true
                this.pressHead(e)
              }}
              onMouseUp={() => {
                document.removeEventListener('mousemove', this.dragHeadHandler)
                removeUserSelectStyles(document)
                this.dragHeader = false
              }}
            /> */}

            <div
              className={style['dialog-content']}
              draggable={false}
              onMouseDown={(e) => {
                this.pressHead(e)
              }}
              onMouseUp={() => {
                // document.removeEventListener('mousemove', this.dragHeadHandler)
                // this.dragHeader = false
              }}
            >

              <div
                role="presentation"
                onMouseDown={() => {
                  if (this.props.draggable) {
                    this.dragHeader = true
                  }
                }}
                className={`${style.dialogHeader} ${this.props.headerClassName}`}
                ref={this.headerRef}
              >
                <div>
                  {this.props.title}
                </div>

              </div>

              <div
                className={style.dialogBody}
                style={{
                  overflowX: this.props.overflowX,
                  overflowY: this.props.overflowY,
                }}
              >
                {/* <button
                  style={{ color: 'red', zIndex: 88, position: 'relative' }}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    this.setPrevIndex()
                  }}
                  onMouseUp={(e) => {
                    e.stopPropagation()
                  }}
                >
                  测试设置上一层

                </button> */}
                {/* TODO: destroyOnClose不启用的时候，子模块一开始就挂载，这和启用的行为是不一样的 */}
                {this.props.destroyOnClose && !this.props.visible ? '' : this.props.children}
              </div>

            </div>
          </div>

        </div>
      </>
    ), document.body)
  }
}

Modal.propTypes = {
  visible: PropTypes.bool.isRequired,
  title: PropTypes.node.isRequired,
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
}

Modal.defaultProps = {
  width: '300px',
  height: '200px',
  top: '160px',
  bottom: 'initial',
  left: 'initial',
  right: '5%',
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
}

export default Modal
