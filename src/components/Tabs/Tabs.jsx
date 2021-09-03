import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import Icon from '../Icon/Icon';
import TabNavList from './TabNavList';

function toArray(children) {
    return [...children];
}

function parseTabList(children) {
    return toArray(children)
        .map((node) => {
            if (React.isValidElement(node)) {
                const key = node.key !== undefined ? String(node.key) : undefined;
                return {
                    key,
                    ...node.props,
                    node,
                };
            }

            return null;
        })
        .filter((tab) => tab);
}

// ============ ==================
const Tabs = ({
    id,
    bordered = true,
    maxLength = 50,
    value,
    defaultValue,
    onChange,
    placeholder,
    children,
    prefixCls = 'l-ui-tabs',

}) => {
    // console.log(children, 'children');
    const tabs = parseTabList(children);

    // ===================== Accessibility ====================
    // const [mergedId, setMergedId] = useMergedState(null, {
    //     value: id,
    // });
    // // ======================== Render ========================
    // const shareProps = {
    //     id: mergedId,
    //     activeKey: mergedActiveKey,
    // };
    return (
        <div className={classnames({ [`${prefixCls}-wrapper`]: true })}>
            <TabNavList tabs={tabs} prefixCls={prefixCls} />
        </div>
    );
};

Tabs.propTypes = {
    type: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
};

Tabs.defaultProps = {
    step: 1,
    onChange: () => { },
};

export default Tabs;
