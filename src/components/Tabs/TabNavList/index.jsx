import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

// ============ ==================
const TabNavList = ({
    bordered = true,
    maxLength = 50,
    value,
    defaultValue,
    onChange,
    placeholder,
    tabs,
    prefixCls = 'l-ui-tabs',
    activeKey,
    defaultActiveKey,
}) => {
    // const  = 'l-ui-tabs';
    // console.log(children, 'children');
    // const tabs = parseTabList(children);
    console.log(tabs, 'tabs');
    const [curActiveKey, onCurActiveKey] = useState(() => defaultActiveKey ?? activeKey);
    console.log(curActiveKey, 'curActiveKey');

    // tabnavlist dom
    const tabnavlistRef = useRef();

    // ink-bar dom
    const [inkBarStyle, setInkBarStyle] = useState({});
    console.log(inkBarStyle, 'inkBarStyle');

    // effect curActiveKey
    useEffect(() => {
        if (tabnavlistRef.current) {
            //     const curTabDom = tabnavlistRef.current.children[curActiveKey];

            //     // if (curTabDom) {
            //     //     // debugger;
            //     //     const { width } = curTabDom?.getBoundingClientRect();
            //     //     console.log(curTabDom.getBoundingClientRect(), '===');
            //     //     setInkBarStyle({
            //     //         width,
            //     //     });
            //     // }
        }
        setInkBarStyle({
            width: 30,
            left: curActiveKey * 20,
        });
    }, [curActiveKey]);

    return (
        <div className={classnames({ [`${prefixCls}-nav`]: true })}>
            <div className={classnames({ [`${prefixCls}-nav-wrap`]: true })}>
                <div className={classnames({ [`${prefixCls}-nav-list`]: true })} ref={tabnavlistRef}>
                    {
                        tabs.map((i) => (
                            <div
                                key={i.key}
                                onClick={() => onCurActiveKey(i.key)}
                                className={
                                    classnames({
                                        [`${prefixCls}-tab`]: true,
                                        [`${prefixCls}-tab-active`]: i.key === curActiveKey,
                                    })
                                }
                            >
                                {i.tab}
                            </div>
                        ))
                    }
                    <div className={classnames({ [`${prefixCls}-ink-bar`]: true })} style={inkBarStyle} />
                </div>
            </div>
        </div>
    );
};

TabNavList.propTypes = {
    type: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,

};

TabNavList.defaultProps = {
    step: 1,
    onChange: () => { },
};

export default TabNavList;
