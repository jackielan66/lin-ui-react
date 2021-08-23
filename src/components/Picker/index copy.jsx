import React, { createRef } from "react";
import PropTypes from "prop-types";
import style from "./style.less";

const INIT_DATA = [];
for (let i = -90; i <= 90; i++) {
  INIT_DATA.push(i);
}

export default class Picker extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  };

  itemPxHeight = 44

  direction = "vertical"

  visibleItemCount = 6

  wrapperStyle = {}

  static defaultProps = {
    // isMobile: false
  }

  constructor(props) {
    super(props);
    this._init();
    this.resetTouchStatus();
    this.initComputed();
    this.pickerColumnRef = createRef();
    this.wrapperContainerRef = createRef();
  }

  componentDidMount() {
    this.setEleStyle();
    this.onMounted();
  }

  _init() {
    this.offset = 0;
    this.duration = 0;
    this.options = {};
    this.direction = 'vertical';
    this.deltaX = 0;
    this.deltaY = 0;
    this.offsetX = 0;
    this.offsetY = 0;

    this.startX = 0;
    this.startY = 0;

    this.moving = false;
    this.startOffset = 0;

    this.transitionEndTrigger = null; // 滚动函数
    this.touchStartTime = 0; // 记录开始滑动时间
    this.momentumOffset = 0; // 记录开始滑动位置

    this.currentIndex = this.defaultIndex;
  }

  // 重置滑动数据变量
  resetTouchStatus() {
    this.direction = '';
    this.deltaX = 0;
    this.deltaY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  // 根据传入变量--获取计算属性
  initComputed() {
    // 外层容器高度
    this.wrapHeight = this.itemPxHeight * this.visibleItemCount;
    this.count = INIT_DATA.length;
    this.baseOffset = (this.itemPxHeight * (this.visibleItemCount - 1)) / 2;
    console.log("init computed his.offset", this.offset);
    console.log("init computed his.baseOffset", this.baseOffset);
    // 内层元素高度计算
    this.wrapperStyle = {
      transform: `translate3d(0, ${this.offset + this.baseOffset}px, 0)`,
      transitionDuration: `${this.duration}ms`,
      transitionProperty: this.duration ? 'all' : 'none',
    };
  }

  on(target, event, handler, passive = false) {
    target.addEventListener(
      event,
      handler,
      this.supportsPassive ? { capture: false, passive } : false
    );
  }

  setEleStyle() {
    const columnItem = this.wrapperContainerRef.current.querySelectorAll('.column-item');
    this.setUlStyle();
    this.setColumnHeight(columnItem);
  }

  setUlStyle() {
    const wrapperContainer = this.wrapperContainerRef.current; // document.querySelector('.wrapper-container');
    wrapperContainer.style.transform = this.wrapperStyle.transform;
    wrapperContainer.style.transitionDuration = this.wrapperStyle.transitionDuration;
    wrapperContainer.style.transitionProperty = this.wrapperStyle.transitionProperty;
  }

  setColumnHeight(columnItems) {
    // console.log(columnItems, 'columnItems');
    columnItems.forEach(item => {
      item.style.height = `${this.itemPxHeight}px`;
    });
  }

  // 初始化完成--执行事件绑定
  onMounted() {
    const el = this.pickerColumnRef.current; // document.querySelector('.picker-column');
    this.bindTouchEvent(el);
  }

  bindTouchEvent(el) {
    const {
      onTouchStart, onTouchMove, onTouchEnd, onTransitionEnd
    } = this;
    const wrapper = this.wrapperContainerRef.current; // document.querySelector('.wrapper-container');
    this.on(el, 'touchstart', onTouchStart);
    this.on(el, 'touchmove', onTouchMove);
    this.on(wrapper, 'transitionend', onTransitionEnd);

    if (onTouchEnd) {
      this.on(el, 'touchend', onTouchEnd);
      this.on(el, 'touchcancel', onTouchEnd);
    }
  }

  // 开始滑动
  onTouchStart = (event) => {
    const wrapper = this.wrapperContainerRef.current; // document.querySelector('.wrapper-container');
    this.touchStart(event);
    console.log('开始华东');
    if (this.moving) {
      const translateY = this.getElementTranslateY(wrapper);
      this.offset = Math.min(0, translateY - this.baseOffset);
      this.startOffset = this.offset;
    } else {
      this.startOffset = this.offset;
    }

    console.log(this.offset, 'ontouchstart');
    this.duration = 0;
    this.transitionEndTrigger = null;
    this.touchStartTime = Date.now();
    this.momentumOffset = this.startOffset;

    // 设置滑动
    this.setUlTransform();
  }

  onTouchMove = (event) => {
    this.touchMove(event);

    console.log('move');

    if (this.direction === 'vertical') {
      this.moving = true;
      this.preventDefault(event, true);
    }

    console.log(this.offset, 'mover');
    console.log(this.startOffset, 'mover');
    console.log(this.deltaY, 'mover');

    this.offset = this.range(this.startOffset + this.deltaY, -(this.count * this.itemPxHeight), this.itemPxHeight);

    // const now = Date.now();
    // if (now - this.touchStartTime > this.MOMENTUM_LIMIT_TIME) {
    //   this.touchStartTime = now;
    //   this.momentumOffset = this.offset;
    // }

    // // 滑动中
    this.setUlTransform();
  }

  onTouchEnd = (event) => {
    console.log('touch end');
    const distance = this.offset - this.momentumOffset;
    const duration = Date.now() - this.touchStartTime;
    const allowMomentum = duration < this.MOMENTUM_LIMIT_TIME && Math.abs(distance) > this.MOMENTUM_LIMIT_DISTANCE;

    if (allowMomentum) {
      this.momentum(distance, duration);
      return;
    }

    const index = this.getIndexByOffset(this.offset);
    this.duration = this.DEFAULT_DURATION;
    this.setIndex(index, true);

    // 滑动结束
    this.setUlTransform();

    // compatible with desktop scenario
    // use setTimeout to skip the click event triggered after touchstart
    setTimeout(() => {
      this.moving = false;
    }, 0);
  }

  // 获取当前展示的元素数据信息--关键
  setIndex = (index, emitChange) => {
    index = this.adjustIndex(index) || 90;

    const offset = -index * this.itemPxHeight;

    const trigger = () => {
      if (index !== this.currentIndex) {
        this.currentIndex = index;

        if (emitChange) {
          this.props.onChange(index, this.props.type);
          // console.log(index);
        }
      }
    };

    // trigger the change event after transitionend when moving
    if (this.moving && offset !== this.offset) {
      this.transitionEndTrigger = trigger;
    } else {
      trigger();
    }

    this.offset = offset;
  }

  adjustIndex(index) {
    index = this.range(index, 0, this.count);

    for (let i = index; i < this.count; i++) {
      if (!this.isOptionDisabled(this.options[i])) return i;
    }

    for (let i = index - 1; i >= 0; i--) {
      if (!this.isOptionDisabled(this.options[i])) return i;
    }
  }

  isOptionDisabled(option) {
    return this.isObject(option) && option.disabled;
  }

  // 滑动偏移量
  getIndexByOffset(offset) {
    return this.range(Math.round(-offset / this.itemPxHeight), 0, this.count - 1);
  }

  // 滑动范围限制--关键代码
  range(num, min, max) {
    return Math.min(Math.max(num, min), max);
  }

  touchMove(event) {
    const touch = event.touches[0];
    this.deltaX = touch.clientX - this.startX;
    this.deltaY = touch.clientY - this.startY;
    this.offsetX = Math.abs(this.deltaX);
    this.offsetY = Math.abs(this.deltaY);
  }

  setUlTransform() {
    this.initComputed();
    this.setUlStyle();
  }

  touchStart(event) {
    this.resetTouchStatus();
    this.startX = event.touches[0].clientX;
    this.startY = event.touches[0].clientY;
  }

  // 动画结束事件
  onTransitionEnd = () => {
    this.stopMomentum();
  }

  // 滑动结束后数据获取及优化处理
  stopMomentum() {
    this.moving = false;
    this.duration = 0;

    if (this.transitionEndTrigger) {
      this.transitionEndTrigger();
      this.transitionEndTrigger = null;
    }
  }

  render() {
    return (
      <div ref={this.pickerColumnRef} className={style.pickerColumn}>
        <ul ref={this.wrapperContainerRef} className="wrapper-container">
          {
            INIT_DATA.map((item) => <li key={item} className="column-item">{item}</li>)
          }
        </ul>
      </div>

    );
  }
}
