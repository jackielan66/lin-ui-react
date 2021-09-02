import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

import Icon from '../Icon/Icon';
import useCursor from './hooks/useCursor';
import useUpdateEffect from './hooks/useUpdateEffect';
import StepHandler from './StepHandler';
import getMiniDecimal, { DecimalClass, toFixed, ValueType } from './utils/MiniDecimal';

// ============ ==================
// useState react 保证useSate 唯一性，只会初次渲染执行一遍
// useEff 也是一样么？

const mapType2ClassName = {
    primary: 'l-ui-input-number',
};
function InputNumber(props) {
    const {
        type, children, value, step, parser, onInput, defaultValue, onChange,
    } = props;

    const inputRef = useRef(null);

    const [focus, setFocus] = useState(() => false);

    const userTypingRef = React.useRef(false);
    const compositionRef = React.useRef(false);
    // Cursor controller
    const [recordCursor, restoreCursor] = useCursor(inputRef.current, focus);

    // const triggerValueUpdate = (newValue, userTyping) =>
    // // let updateValue = newValue;

    // // // let isRangeValidate = isInRange(updateValue) || updateValue.isEmpty();

    // // // Skip align value when trigger value is empty.
    // // // We just trigger onChange(null)
    // // // This should not block user typing
    // // if (!updateValue.isEmpty() && !userTyping) {
    // //     // Revert value in range if needed
    // //     updateValue = getRangeValue(updateValue) || updateValue;
    // //     isRangeValidate = true;
    // // }

    // // if (!readOnly && !disabled && isRangeValidate) {
    // //     const numStr = updateValue.toString();
    // //     const mergedPrecision = getPrecision(numStr, userTyping);
    // //     if (mergedPrecision >= 0) {
    // //         updateValue = getMiniDecimal(toFixed(numStr, '.', mergedPrecision));
    // //     }

    // //     // Trigger event
    // //     if (!updateValue.equals(decimalValue)) {
    // //         setUncontrolledDecimalValue(updateValue);
    // //         onChange?.(updateValue.isEmpty() ? null : getDecimalValue(stringMode, updateValue));

    // //         // Reformat input if value is not controlled
    // //         if (value === undefined) {
    // //             setInputValue(updateValue, userTyping);
    // //         }
    // //     }

    // //     return updateValue;
    // // }

    //     0
    // ;

    // >>> Formatter
    const inputValueRef = React.useRef('');

    // ========================== InputValue ==========================
    /**
     * Input text value control
     *
     * User can not update input content directly. It update with follow rules by priority:
     *  1. controlled `value` changed
     *    * [SPECIAL] Typing like `1.` should not immediately convert to `1`
     *  2. User typing with format (not precision)
     *  3. Blur or Enter trigger revalidate
     */
    const [inputValue, setInternalInputValue] = useState(() => {
        console.log('React  usestate  只会在刚渲染执行一次渲染，保证唯一性');
        const initValue = defaultValue ?? value;
        // if (decimalValue.isInvalidate() && ['string', 'number'].includes(typeof initValue)) {

        // }
        return Number.isNaN(initValue) ? '' : initValue;
        // if (decimalValue.isInvalidate() && ['string', 'number'].includes(typeof initValue)) {
        //     return Number.isNaN(initValue) ? '' : initValue;
        // }
        // return mergedFormatter(decimalValue.toString(), false);
    });
    inputValueRef.current = inputValue;
    // Should always be string
    function setInputValue(newValue, userTyping) {
        onChange?.(newValue);
        setInternalInputValue(newValue);
    }

    // ============================ Flush =============================
    /**
     * Flush current input content to trigger value change & re-formatter input if needed
     */
    const flushInputValue = (userTyping) => {
        let formatValue = parseFloat(inputValue);
        if (Number.isNaN(formatValue)) {
            formatValue = '';
        }
        setInputValue(formatValue);
        // const parsedValue = getMiniDecimal(mergedParser(inputValue));
        // let formatValue: DecimalClass = parsedValue;

        // if (!parsedValue.isNaN()) {
        //     // Only validate value or empty value can be re-fill to inputValue
        //     // Reassign the formatValue within ranged of trigger control
        //     formatValue = triggerValueUpdate(parsedValue, userTyping);
        // } else {
        //     formatValue = decimalValue;
        // }

        // if (value !== undefined) {
        //     // Reset back with controlled value first
        //     setInputValue(decimalValue, false);
        // } else if (!formatValue.isNaN()) {
        //     // Reset input back since no validate value
        //     setInputValue(formatValue, false);
        // }
    };

    // ============================ Value =============================
    // Real value control
    const [decimalValue, setDecimalValue] = useState(() => getMiniDecimal(value ?? defaultValue));

    function setUncontrolledDecimalValue(newDecimal) {
        if (value === undefined) {
            setDecimalValue(newDecimal);
        }
    }

    const handleStep = (type) => {
        const prevValue = Number(value);
        const variableStep = type === 'up' ? step : -step;
        props.onChange(prevValue + variableStep);
        inputRef.current?.focus();
    };

    // ========================== User Input Start==========================
    // >>> Collect input value
    const collectInputValue = (inputStr) => {
        // recordCursor();

        // Update inputValue incase input can not parse as number
        setInternalInputValue(inputStr);

        // Parse number
        // if (!compositionRef.current) {
        //     const finalValue = mergedParser(inputStr);
        //     const finalDecimal = getMiniDecimal(finalValue);
        //     if (!finalDecimal.isNaN()) {
        //         triggerValueUpdate(finalDecimal, true);
        //     }
        // }
    };

    // >>> Composition
    const onCompositionStart = () => {
        console.log('onCompositionStart');
        compositionRef.current = true;
    };

    const onCompositionEnd = () => {
        console.log('onCompositionEnd');
        compositionRef.current = false;

        collectInputValue(inputRef.current.value);
    };

    // input
    const onInternalInput = (event) => {
        console.log('每次值都会变么 onInternalChange 自己定义的时间');
        let inputStr = event.target.value;
        if (!parser) {
            inputStr = inputStr.replace(/。/g, '.');
        }
        collectInputValue(inputStr);

        // Trigger onInput later to let user customize value if they want do handle something after onChange
        onInput?.(inputStr);
    };
    // input end

    // wrap focus event
    const onFocus = () => {
        inputRef.current?.focus();
        setFocus(true);
    };

    const onBlur = () => {
        flushInputValue(false);

        setFocus(false);

        userTypingRef.current = false;
    };

    // wrap focus event end

    // ============================= Step =============================
    const onInternalStep = (up) => {
        // Ignore step since out of range
        // if ((up && upDisabled) || (!up && downDisabled)) {
        //     return;
        // }

        // Clear typing status since it may caused by up & down key.
        // We should sync with input value.
        userTypingRef.current = false;

        // let stepDecimal = getMiniDecimal(step);
        // if (!up) {
        //     stepDecimal = stepDecimal.negate();
        // }
        if (up) {
            setInputValue(inputValue - 0 + 1);
        } else {
            setInputValue(inputValue - 1);
        }

        // const target = (decimalValue || getMiniDecimal(0)).add(stepDecimal.toString());

        // const updatedValue = triggerValueUpdate(target, false);

        // onStep?.(getDecimalValue(stringMode, updatedValue), {
        //     offset: step,
        //     type: up ? 'up' : 'down',
        // });

        inputRef.current?.focus();
    };

    console.log('render inputnumber');
    // ========================== Controlled ==========================

    // Input by precision
    useEffect(() => {
        console.log('监听value 知道变化', value);
        setInputValue(value);
    }, [value]);
    // useUpdateEffect(() => {
    //     if (Number.isNaN(value)) {
    //         setInputValue(value)
    //     }
    // }, [value)

    // ============================ Render ============================

    return (
        <div
            className={classnames({
                'l-ui-input-number': true,
                'l-ui-input-number-focus': focus,
            })}
            onFocus={onFocus}
            onBlur={onBlur}
            onCompositionStart={onCompositionStart}
            onCompositionEnd={onCompositionEnd}

        >
            {/* <div className="l-ui-input-number-handle">
                <span className="l-ui-input-number-handle-up" onClick={() => handleStep('up')}>
                    <Icon size="10" type="arrow-up-bold" />
                </span>
                <span className="l-ui-input-number-handle-down" onClick={() => handleStep('down')}>
                    <Icon size="10" type="arrow-down-bold" />
                </span>
            </div> */}
            <StepHandler onStep={onInternalStep} />
            <input
                className="l-ui-input-number-input"
                autoComplete="off"
                role="spinbutton"
                onChange={onInternalInput}
                value={inputValue}
                ref={inputRef}
            />

        </div>
    );
}

InputNumber.propTypes = {
    type: PropTypes.string,
    children: PropTypes.object,
    value: PropTypes.number,
    onChange: PropTypes.func,
};

InputNumber.defaultProps = {
    step: 1,
    onChange: () => { },
};

export default InputNumber;
