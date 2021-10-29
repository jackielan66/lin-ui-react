import React from 'react'
import _ from 'lodash'
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

// 放大缩下
class UResize extends React.Component {
  constructor(props) {
    super(props)
    this.dragResizer = '' // 处于何种resize模式，包括上下左右4种

    this.resizeOffsetXY = {
      x: 0,
      y: 0,
    }

    // 回调绑定
    this.resizeMoveHandler = _.throttle((e) => this.resizeModal(e), 20)
    this.resizeEndHandler = this.dragResizeEnd.bind(this)

    this.state = {

    }
    this.style = {

    }
  }

  dragResizeStart(e, pos) {
    const target = e.target || e.targetTouches[0]
    addUserSelectStyles(document)
    if (target && target.getAttribute('data-resize') === 'resize') {
      e.stopPropagation()
      this.dragResizer = pos
      const CSS = getComputedStyle(this.props.rootNode)
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
          this.style = {
            top: 'initial',
            bottom: CSS.bottom,
            width: parseFloat(CSS.width || 0),
            height: parseFloat(CSS.height || 0),
          }
          break
        case 'down':
          this.resizeOffsetXY.x = parseFloat(CSS.width || 0) - x
          this.resizeOffsetXY.y = parseFloat(CSS.height || 0) - y
          this.style = {
            top: CSS.top,
            bottom: 'initial',
            width: parseFloat(CSS.width || 0),
            height: parseFloat(CSS.height || 0),
          }
          break
        case 'left':
          this.resizeOffsetXY.x = parseFloat(CSS.width || 0) + x
          this.resizeOffsetXY.y = parseFloat(CSS.height || 0) + y
          this.style = {
            left: 'initial',
            right: CSS.right,
            width: parseFloat(CSS.width || 0),
            height: parseFloat(CSS.height || 0),
          }
          break
        case 'right':
          this.resizeOffsetXY.x = parseFloat(CSS.width || 0) - x
          this.resizeOffsetXY.y = parseFloat(CSS.height || 0) - y

          this.style = {
            left: CSS.left,
            right: 'initial',
            width: parseFloat(CSS.width || 0),
            height: parseFloat(CSS.height || 0),
          }
          break
        case 'topLeft':
          this.resizeOffsetXY.x = parseFloat(CSS.width || 0) + x
          this.resizeOffsetXY.y = parseFloat(CSS.height || 0) + y
          this.style = {
            top: 'initial',
            bottom: CSS.bottom,
            left: 'initial',
            right: CSS.right,
            width: parseFloat(CSS.width || 0),
            height: parseFloat(CSS.height || 0),
          }
          break
        case 'topRight':
          this.resizeOffsetXY.x = parseFloat(CSS.width || 0) - x
          this.resizeOffsetXY.y = parseFloat(CSS.height || 0) + y
          this.style = {
            top: 'initial',
            bottom: CSS.bottom,
            left: CSS.left,
            right: 'initial',
            width: parseFloat(CSS.width || 0),
            height: parseFloat(CSS.height || 0),
          }
          break
        case 'bottomLeft':
          this.resizeOffsetXY.x = parseFloat(CSS.width || 0) + x
          this.resizeOffsetXY.y = parseFloat(CSS.height || 0) - y
          this.style = {
            top: CSS.top,
            bottom: 'initial',
            left: 'initial',
            right: CSS.right,
            width: parseFloat(CSS.width || 0),
            height: parseFloat(CSS.height || 0),
          }
          break
        case 'bottomRight':
          this.resizeOffsetXY.x = parseFloat(CSS.width || 0) - x
          this.resizeOffsetXY.y = parseFloat(CSS.height || 0) - y
          this.style = {
            top: CSS.top,
            bottom: 'initial',
            left: CSS.left,
            right: 'initial',
            width: parseFloat(CSS.width || 0),
            height: parseFloat(CSS.height || 0),
          }
          break
        default:
          break
      }
      // debugger
      this.props.getResizeStartInitStyle?.(this.style)
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
        let n; let m; let w; let h
        const { onResize, onResizeHeight, onResizeWidth } = this.props
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
            onResizeHeight(n)
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
            onResizeHeight(n)
            break
          case 'left':
            n = Math.max(this.resizeOffsetXY.x - x, this.props.minWidth)
            this.setState({
              width: n,
            })
            onResizeWidth(n)
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
            onResizeWidth(n)
            onResize({
              dir: 'right',
              width: n - MINUS_WIDTH,
            })
            break
          case 'topLeft':
            w = Math.max(this.resizeOffsetXY.x - x, this.props.minWidth)
            h = Math.max(this.resizeOffsetXY.y - y, this.props.minHeight)
            onResizeWidth(w)
            onResizeHeight(h)
            break
          case 'topRight':
            w = Math.max(this.resizeOffsetXY.x + x, this.props.minWidth)
            h = Math.max(this.resizeOffsetXY.y - y, this.props.minHeight)
            onResizeWidth(w)
            onResizeHeight(h)
            break
          case 'bottomLeft':
            w = Math.max(this.resizeOffsetXY.x - x, this.props.minWidth)
            h = Math.max(this.resizeOffsetXY.y + y, this.props.minHeight)
            onResizeWidth(w)
            onResizeHeight(h)
            break
          case 'bottomRight':
            w = Math.max(this.resizeOffsetXY.x + x, this.props.minWidth)
            h = Math.max(this.resizeOffsetXY.y + y, this.props.minHeight)
            onResizeWidth(w)
            onResizeHeight(h)
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
    removeUserSelectStyles(document)
    document.removeEventListener('mousemove', this.resizeMoveHandler)
    document.removeEventListener('mouseup', this.resizeEndHandler)
  }

  render() {
    const { prefixCls = 'dialog' } = this.props

    return (
      <div className={style['dialog-u-resize']}>
        <div
          role="presentation"
          className={style[`${prefixCls}-u-resize-top`]}
          draggable={false}
          data-resize="resize"
          onMouseDown={(e) => {
            this.dragResizeStart(e, 'up')
          }}
        />
        <div
          role="presentation"
          className={style[`${prefixCls}-u-resize-left`]}
          draggable={false}
          data-resize="resize"
          onMouseDown={(e) => {
            this.dragResizeStart(e, 'left')
          }}
        />
        <div
          role="presentation"
          className={style[`${prefixCls}-u-resize-right`]}
          draggable={false}
          data-resize="resize"
          onMouseDown={(e) => {
            this.dragResizeStart(e, 'right')
          }}
        />
        <div
          role="presentation"
          className={style[`${prefixCls}-u-resize-bottom`]}
          draggable={false}
          data-resize="resize"
          onMouseDown={(e) => {
            this.dragResizeStart(e, 'down')
          }}
        />
        <div
          role="presentation"
          className={style[`${prefixCls}-u-resize-topLeft`]}
          draggable={false}
          data-resize="resize"
          onMouseDown={(e) => {
            this.dragResizeStart(e, 'topLeft')
          }}
        />
        <div
          role="presentation"
          className={style[`${prefixCls}-u-resize-topRight`]}
          draggable={false}
          data-resize="resize"
          onMouseDown={(e) => {
            this.dragResizeStart(e, 'topRight')
          }}
        />
        <div
          role="presentation"
          className={style[`${prefixCls}-u-resize-bottomLeft`]}
          draggable={false}
          data-resize="resize"
          onMouseDown={(e) => {
            this.dragResizeStart(e, 'bottomLeft')
          }}
        />
        <div
          role="presentation"
          className={style[`${prefixCls}-u-resize-bottomRight`]}
          draggable={false}
          data-resize="resize"
          onMouseDown={(e) => {
            this.dragResizeStart(e, 'bottomRight')
          }}
        />
      </div>
    )
  }
}

export default UResize
