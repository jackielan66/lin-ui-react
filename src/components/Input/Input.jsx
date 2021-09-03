import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TextArea from './TextArea'
import Icon from '../Icon/Icon';

// ============ ==================

class Input extends Component {

    static TextArea = TextArea;

    constructor(props) {
        super(props);
        this.prefixCls = this.props.prefixCls ?? 'l-ui-input';
        this.state = {
            focus: false,
            inputValue: props.defaultValue ?? props.value ?? ''
        };
    }

    componentDidUpdate(preProps, preState, spanshot) {
        // console.warn('组件更新了，所有东西更新完都会走这个')
        // console.log(preProps.value, 'preProps.value  组件更新了，所有东西更新完都会走这个')
        // console.log(this.state.inputValue, 'this.state.inputValue 组件更新了，所有东西更新完都会走这个')
        // console.log(this.props.value, 'this.props.value this.props.value ')
        // // console.log(spanshot, 'spanshot 组件更新了，所有东西更新完都会走这个')
        // console.warn('=========')
        if (this.props.value != undefined && this.props.value !== this.state.inputValue && preProps.value !== this.props.value) {
            this.setInputValue(this.props.value)
        }
    }

    // static getDerivedStateFromProps() {

    // }

    setFocus(focus) {
        this.setState({
            focus: focus
        })
    }

    onFocus = () => {
        this.setFocus(true)
    }

    onBlur = () => {
        this.setFocus(false)
    }

    onInternalInput = (e) => {
        let inputStr = e.target.value;
        this.setInputValue(inputStr)
        this.props.onChange?.(inputStr)
    }

    setInputValue(inputValue) {
        this.setState({
            inputValue: inputValue
        }, () => {
            // console.log('onInternalInputcb this.state.value ', this.state.value)
        })
    }


    render() {
        const { prefixCls } = this;
        const { className, type = "text", addonBefore, addonAfter } = this.props;
        const { focus, inputValue } = this.state;

        let INPUT_JSX = <input
            value={inputValue}
            type={type}
            onChange={this.onInternalInput}
            className={[`${prefixCls}`]}
        />

        let addonBefore_JSX = null;
        let addonAfter_JSX = null;
        if (addonBefore) {
            if (typeof addonBefore === 'string') {
                addonBefore_JSX = <span className={classnames({ [`${prefixCls}-group-addon`]: true })} >{addonBefore}</span>
            }
        }
        if (addonAfter) {
            if (typeof addonBefore === 'string') {
                addonAfter_JSX = <span className={classnames({ [`${prefixCls}-group-addon`]: true })} >{addonAfter}</span>
            }
        }

        let rDom = INPUT_JSX

        if (addonBefore_JSX || addonAfter_JSX) {
            rDom = <span className={classnames({ [`${prefixCls}-group-wrapper`]: true })} >
                <span className={classnames({ [`${prefixCls}-group`]: true, [`${prefixCls}-wrapper`]: true })} >
                    {addonBefore_JSX}
                    {rDom}
                    {addonAfter_JSX}
                </span>
            </span>
        }

        return <>
            {rDom}
        </>

        // return (
        //     <span
        //         className={classnames(prefixCls, className, {
        //             [`${prefixCls}-focus`]: focus,
        //         })}
        //         onFocus={this.onFocus}
        //         onBlur={this.onBlur}
        //     // onCompositionStart={onCompositionStart}
        //     // onCompositionEnd={onCompositionEnd}

        //     >
        //         <input
        //             className={[`${prefixCls}`]}
        //             autoComplete="off"
        //             role="spinbutton"
        //         // onChange={onInternalInput}
        //         // value={inputValue}
        //         // ref={inputRef}
        //         />

        //     </span>
        // );
    }
}


Input.propTypes = {
    type: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.object,]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number,]),
    onChange: PropTypes.func,

};

Input.defaultProps = {
    step: 1,
    onChange: () => { },
};

export default Input;
