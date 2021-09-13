import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import PropTypes, { func } from 'prop-types';

import toArray from 'rc-util/lib/Children/toArray';
import isMobile from 'rc-util/lib/isMobile';
import useMergedState from 'rc-util/lib/hooks/useMergedState';

import TabNavList from './TabNavList';

// function toArray(children) {
//     return [...children];
// }
// Used for accessibility
let uuid = 0;

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
    activeKey,

    placeholder,
    children,
    prefixCls = 'l-ui-tabs',
    animated,
    tabPosition = 'top',
    onChange,
    onTabClick,
    ...restProps

}) => {
    // console.log(children, 'children');
    const tabs = parseTabList(children);

    let mergedAnimated = {};
    if (animated === false) {
        mergedAnimated = {
            inkBar: false,
            tabPane: false,
        };
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
        defaultValue: defaultActiveKey,
    });
    const [activeIndex, setActiveIndex] = useState(() => tabs.findIndex((tab) => tab.key === mergedActiveKey));

    // Reset active key if not exist anymore
    useEffect(() => {
        let newActiveIndex = tabs.findIndex((tab) => tab.key === mergedActiveKey);
        if (newActiveIndex === -1) {
            newActiveIndex = Math.max(0, Math.min(activeIndex, tabs.length - 1));
            setMergedActiveKey(tabs[newActiveIndex]?.key);
        }
        setActiveIndex(newActiveIndex);
    }, [tabs.map((tab) => tab.key).join('_'), mergedActiveKey, activeIndex]);

    // ===================== Accessibility ====================
    const [mergedId, setMergedId] = useMergedState(null, {
        value: id,
    });

    const mergedTabPosition = tabPosition;

    // Async generate id to avoid ssr mapping failed
    useEffect(() => {
        if (!id) {
            setMergedId(`rc-tabs-${process.env.NODE_ENV === 'test' ? 'test' : uuid}`);
            uuid += 1;
        }
    }, []);

    // ======================== Events ========================
    function onInternalTabClick(key, e) {
        onTabClick?.(key, e);
        setMergedActiveKey(key);
        onChange?.(key);
    }

    // ======================== Render ========================
    const sharedProps = {
        id: mergedId,
        activeKey: mergedActiveKey,
        animated: mergedAnimated,
        tabPosition: mergedTabPosition,
    };

    let tabNavBar = null;
    const tabNavBarProps = {
        ...sharedProps,
        // editable,
        // locale,
        // moreIcon,
        // moreTransitionName,
        // tabBarGutter,
        onTabClick: onInternalTabClick,
        // onTabScroll,
        // extra: tabBarExtraContent,
        // style: tabBarStyle,
        panes: children,
        tabs,
        prefixCls,
    };
    tabNavBar = <TabNavList {...tabNavBarProps} />;
    return (
        <div className={classnames({ [`${prefixCls}-wrapper`]: true })}>
            {tabNavBar}
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
