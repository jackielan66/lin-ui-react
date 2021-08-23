import React, { createRef } from "react";
// import PropTypes from "prop-types";
import style from "./style.less";

const INIT_DATA = [];
for (let i = 0; i <= 10; i++) {
  INIT_DATA.push(i);
}


// 惯性滑动，如果上次滑动还没结束这次继续滑动

export default class Picker extends React.Component {
  static propTypes = {
    // onChange: PropTypes.func.isRequired,
    // type: PropTypes.string.isRequired,
    // value: PropTypes.number.isRequired,
  };



  constructor(props){
    super(props)
    this.itemHeight = 44;
    this.startY = 0;
    this.disY = 0;
    this.count = 0;
    this.offset = 0; // 偏移量
    this.offsetDis = 0; // 偏移的距离多少
    this.moving = false

    this.ulWrapperContainerRef = createRef()
    this.pickerColumnRef = createRef();

    this.setUI = this.setUI.bind(this)
    this.touchStart = this.touchStart.bind(this)
    this.touchMove = this.touchMove.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
    this.transitionEnd = this.transitionEnd.bind(this);
    this.baseOfsfetHeight = 0;

    this.startTime = 0
    this.endTime = 0

    this.momentDis = 0


  }

  componentDidMount(){
    this.count = INIT_DATA.length;
    let liItems  = this.ulWrapperContainerRef.current.querySelectorAll('.column-item');
    this.setLiItemHeight(liItems)
    this.bindElTouchEvent()


    let pickerColumn = this.pickerColumnRef.current;
    let {height} = getComputedStyle(pickerColumn)
    console.log(height,'event _ulElement')
    this.baseOffsetHeight = parseInt(height)  /2;
    this.setUI(0)
  }

  touchStart(event){
    this.startY = event.touches[0].pageY;
    console.log(   this.startY ,'event')
    this.startTime = Date.now()
    this.moving = true;
    this.prevY =  this.getTransformY()
  }



  touchMove(event){
    let curPageY =   event.touches[0].pageY;
    // console.log(this.startY,' this.startY event curPageY')
    console.log(this.prevY,'event prevY')
    this.disY = curPageY-this.startY;
    // console.log(event,'event touchMove')
    // console.log( this.disY,' this.disY')
    // console.log(this,'this')
    // console.log( this.disY,' this.disY')
    // return;
    // let _offset = -Math.round(this.disY / this.itemHeight)  ;
    // console.log(_offset,'_offset')
    // this._offset = this.offset+_offset;
    // const style = getComputedStyle(_ulElement);
    this.setUI(-this.disY+this.prevY)
  }


  getTransformY = ()=>{
    let _ulElement = this.ulWrapperContainerRef.current
    const { transform } =  getComputedStyle(_ulElement) ;
    let arr = transform.split(',')
    return parseInt(arr[5])
    console.log(transform,'transform')
  }

  touchEnd(event){
    // let curPageY =   event.touches[0].pageY;
    // this.disY = curPageY-this.startY;
    // console.log(event,'event touchMove')
    // console.log( this.disY,'touchEnd');
    // console.log( event,'touchEnd');
    // 点击结束的时候记录最后一个滑动多个偏移量
    this.offset = this._offset;
    if(this.offset<0){
      this.offset = 0;
    }
    if(this.offset>=this.count){
      this.offset = this.count-1;
    }
    this.endTime = Date.now()
    if(this.endTime - this.startTime <=300){
      
      // this.props.onChange(this.offset )
    }
    // this.setUI(this.offset)
    // this.moving = false;
    console.log(  this.moving  ,' this.moving  this.moving  this.moving ');

  }

  transitionEnd(){
    // 动画结束，把当前的之前暴露给外婆
    // alert(this.offset)
    // 动画停止暴露
    console.log(this.offset,'this.offset 动画停止暴露')
    if(this.moving === true){
      this.props.onChange(this.offset)
    }
    this.moving = false;
  }

  bindElTouchEvent(){
    let _ulElement = this.ulWrapperContainerRef.current
    _ulElement.addEventListener('touchstart',this.touchStart,{passive :true})
    _ulElement.addEventListener('touchmove',this.touchMove,{passive :true})
    _ulElement.addEventListener('touchend',this.touchEnd,{passive :true})
    _ulElement.addEventListener('transitionend',this.transitionEnd)
    // window.document.addEventListener
  }

  setUI(offsetDis){
    let _ulElement = this.ulWrapperContainerRef.current;


    // let baseOffsetHeight = getComputedStyle(_ulElement).height / 2
    // console.log(baseOffsetHeight,'event _ulElement')

    // console.log( this.baseOffsetHeight,' this.baseOffsetHeight')
    // console.log( `translate3d(0,${this.disY}px,0})`,'transform')
    
    _ulElement.style.transform =   `translate3d(0px, ${this.baseOffsetHeight - offsetDis - this.itemHeight/2 }px, 0px)`//    "translate(10px, 100px)" // `translate3d(0px,${this.disY}px,0px})`
    // _ulElement.style.background  = 'red'
    // = {
    //     // transition:'all 300ms'
    //     transitionDuration:'300ms',
    //     transitionProperty:'all',
    //     transform:`translate3d(0,${this.disY},0})`
    // }
  }

  setLiItemHeight(items){
    // console.log(items,'items')
    items.forEach(liDom=>{
      liDom.style.height = this.itemHeight + 'px'
    })
  }

  clickItem(idx){
    this.offset=idx;
    let offsetDis = this.offset * this.itemHeight
    this.setUI(offsetDis)
  }


  render() {
    return (
      <div ref={this.pickerColumnRef} className="picker-column">
        <ul ref={this.ulWrapperContainerRef} className="ul-wrapper-container">
          {
            INIT_DATA.map((item,idx) => <li key={item}  onClick={()=>this.clickItem(idx)} className="column-item">{item}</li>)
          }
        </ul>
        <div className="picker-mark" >

        </div>
        {this.offset} 'offset'
      </div>

    );
  }
}
