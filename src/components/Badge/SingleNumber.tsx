import * as React from 'react';
import classNames from 'classnames';

export interface UnitNumberProps {
    prefixCls: string,
    value?: number | string;
    offset?: number;
    current?: boolean
}

function UnitNumber({
    prefixCls, value, offset = 0, current,
}: UnitNumberProps) {
    let style: React.CSSProperties | undefined;

    if (offset) {
        style = {
            position: 'absolute',
            top: `${offset}00%`,
            left: 0,
        };
    }
    return (
        <span
            style={style}
            className={classNames(`${prefixCls}-only-unit`, {
                current,
            })}
        >
            {value}
        </span>
    );
}

interface SingleNumberProps {
    prefixCls: string,
    value: string,
    count: number
}

function getOffset(start: number, end: number, unit: -1 | 1) {
    let index = start;
    let offset = 0;
    while ((index + 10) % 10 !== end) {
        index += unit;
        offset += unit;
    }
    return offset;
}

const SingleNumber: React.FC<SingleNumberProps> = (props: SingleNumberProps) => {
    const { prefixCls, count: originCount, value: originValue } = props;
    const value = Number(originValue);
    const count = Math.abs(originCount);
    const [prevValue, setPreValue] = React.useState(value);
    const [preCount, setPreCount] = React.useState(count);

    // ==================== Events ===========================
    const onTransitionEnd = () => {
        setPreCount(count);
        setPreValue(value);
    };

    // fallback if transition event not support
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onTransitionEnd();
        }, 1000);
        return () => {
            clearTimeout(timeout);
        };
    }, [value]);

    // ================ render ======================
    // render unit list
    let unitNodes: React.ReactElement[];
    let offsetStyle: React.CSSProperties | undefined;

    if (prevValue === value || Number.isNaN(value) || Number.isNaN(prevValue)) {
        // nothing to change
        unitNodes = [<UnitNumber {...props} key={value} current />];
        offsetStyle = {
            transition: 'none',
        };
    } else {
        unitNodes = [];
        // fill basic number units
        const end = value + 10;
        const unitNumberList: number[] = [];
        for (let index = value; index < end; index += 1) {
            unitNumberList.push(index);
        }

        // fill with number unit nodes
        const prevIndex = unitNumberList.findIndex((n) => n % 10 === prevValue);
        unitNodes = unitNumberList.map((n, index) => {
            const singleUnit = n % 10;
            return (
                <UnitNumber
                    {...props}
                    key={n}
                    value={singleUnit}
                    offset={index - prevIndex}
                    current={index === prevIndex}
                />
            );
        });

        // calculate container offset value
        const unit = preCount < count ? 1 : -1;
        offsetStyle = {
            transform: `translateY(${-getOffset(prevValue, value, unit)}00%)`,
        };
    }

    return (
        <span className={`${prefixCls}-only`} style={offsetStyle} onTransitionEnd={onTransitionEnd}>
            {unitNodes}
        </span>
    );
};

export default SingleNumber;
