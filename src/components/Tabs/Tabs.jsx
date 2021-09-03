import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import toArray from 'rc-util/lib/Children/toArray';
import isMobile from 'rc-util/lib/isMobile';
import useMergedState from 'rc-util/lib/hooks/useMergedState';





import TabNavList from './TabNavList';

// function toArray(children) {
//     return [...children];
// }

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
    defaultActiveKey,
    onChange,
    placeholder,
    children,
    prefixCls = 'l-ui-tabs',
    animated,
    ...restProps


}) => {
    // console.log(children, 'children');
    const tabs = parseTabList(children);

    let mergedAnimated = {};
    if (animated === false) {
        mergedAnimated = {
            inkBar: false,
            tabPane: false,
        }
    } else if (animated === true) {
        mergedAnimated = {
            inkBar: true,
            tabPane: true,
        };
    } else {
        mergedAnimated = {
            inkBar: true,
            tabPane: false,
            ...(typeof animated === 'object' ? animated : {}),
        };
    }
    // ====================== Active Key ======================
    const [mergedActiveKey, setMergedActiveKey] = useMergedState(() => tabs[0]?.key, {
        value: activeKey,
        defaultValue: defaultActiveKey
    })
    const [activeIndex, setActiveIndex] = useState(() => {
        return tabs.findIndex(tab => tab.key === mergedActiveKey)
    })

    // Reset active key if not exist anymore
    useEffect(() => {
        let newActiveIndex = tabs.findIndex(tab => tab.key === mergedActiveKey);
        if (newActiveIndex === -1) {
            newActiveIndex = Math.max(0, Math.min(activeIndex, tabs.length - 1));
            setMergedActiveKey(tabs[newActiveIndex]?.key);
        }
        setActiveIndex(newActiveIndex);
    }, [tabs.map(tab => tab.key).join('_'), mergedActiveKey, activeIndex]);

    // ===================== Accessibility ====================
    const [mergedId, setMergedId] = useMergedState(null, {
        value: id,
    });

    // let mergedTabPosition = tabPosition;
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
