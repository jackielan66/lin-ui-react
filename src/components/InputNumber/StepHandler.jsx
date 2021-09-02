import classNames from 'classnames';
import React from 'react';

import Icon from '../Icon/Icon';

export default function StepHandler({
    onStep,
}) {
    const onStepMouseDown = (e, up) => {
        e.preventDefault();
        onStep?.(up);
    };

    return (
        <div className="l-ui-input-number-handle">
            <span className="l-ui-input-number-handle-up" onMouseDown={(e) => onStepMouseDown(e, true)}>
                <Icon size="10" type="arrow-up-bold" />
            </span>
            <span className="l-ui-input-number-handle-down" onMouseDown={(e) => onStepMouseDown(e, false)}>
                <Icon size="10" type="arrow-down-bold" />
            </span>
        </div>
    );
}
