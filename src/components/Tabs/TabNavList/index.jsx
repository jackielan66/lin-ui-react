import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import useSyncState from '../hooks/useSyncState';
import useRaf, { useRafState } from '../hooks/useRaf';
import useRefs from '../hooks/useRefs';
import TabNode from './TabNode';

// ============ ==================
const TabNavList = (props) => {
    const {
        className,
        style,
        id,
        animated,
        activeKey,
        rtl,
        extra,
        editable,
        locale,
        tabPosition,
        tabBarGutter,
        children,
        onTabClick,
        onTabScroll,
        prefixCls, tabs,
    } = props;
    const tabsWrapperRef = useRef();
    const tabListRef = useRef();
    const operationsRef = useRef();
    const innerAddButtonRef = useRef();
    const [getBtnRef, removeBtnRef] = useRefs();

    const tabPositionTopOrBottom = tabPosition === 'top' || tabPosition === 'bottom';

    const [transformLeft, setTransformLeft] = useSyncState(0, (next, prev) => {
        if (tabPositionTopOrBottom && onTabScroll) {
            onTabScroll({ direction: next > prev ? 'left' : 'right' });
        }
    });

    const [transformTop, setTransformTop] = useSyncState(0, (next, prev) => {
        if (!tabPositionTopOrBottom && onTabScroll) {
            onTabScroll({ direction: next > prev ? 'top' : 'bottom' });
        }
    });

    const [wrapperSrollWidth, setWrapperScrollWidth] = useState(0);
    const [wrapperScrollHeight, setWrapperScrollHeight] = useState(0);
    const [wrapperContentWidth, setWrapperContentWidth] = useState(0);
    const [wrapperContentHeight, setWrapperContentHeight] = useState(0);
    const [wrapperWidth, setWrapperWidth] = useState(null);
    const [wrapperHeight, setWrapperHeight] = useState(null);
    const [addWidth, setAddWidth] = useState(0);
    const [addHeight, setAddHeight] = useState(0);

    // const [tabSizes, setTabSizes] = useRafState(new Map());
    // const [tabSizes, setTabSizes] = useRafState < TabSizeMap > (new Map());
    // const tabOffsets = useOffsets(tabs, tabSizes, wrapperScrollWidth);

    // ========================== Util =========================
    const operationsHiddenClassName = `${prefixCls}-nav-operations-hidden`;

    let transformMin = 0;
    let transformMax = 0;

    if (!tabPositionTopOrBottom) {
        transformMin = Math.min(0, wrapperHeight - wrapperScrollHeight);
        transformMax = 0;
    } else if (rtl) {
        transformMin = 0;
        // transformMax = Math.max(0, wrapperScrollWidth - wrapperWidth);
    } else {
        // transformMin = Math.min(0, wrapperWidth - wrapperScrollWidth);
        transformMax = 0;
    }

    function alignInRange(value) {
        if (value < transformMin) {
            return transformMin;
        }
        if (value > transformMax) {
            return transformMax;
        }
        return value;
    }

    // ========================= Scroll ========================
    function scrollToTab(key = avtiveKey) {

    }

    const tabNodeStyle = {};
    // if (tabPosition === 'top' || tabPosition === 'bottom') {
    //   tabNodeStyle[rtl ? 'marginRight' : 'marginLeft'] = tabBarGutter;
    // } else {
    //   tabNodeStyle.marginTop = tabBarGutter;
    // }

    console.log(tabs, 'tabs');

    const tabNodes = tabs.map((tab, i) => {
        const { key } = tab;
        return (
            <TabNode
                id={id}
                prefixCls={prefixCls}
                key={key}
                tab={tab}
                /* first node should not have margin left */
                style={i === 0 ? undefined : tabNodeStyle}
                closable={tab.closable}
                editable={editable}
                active={key === activeKey}
                renderWrapper={children}
                removeAriaLabel={locale?.removeAriaLabel}
                ref={getBtnRef(key)}
                onClick={(e) => {
                    onTabClick(key, e);
                }}
                onRemove={() => {
                    removeBtnRef(key);
                }}
                onFocus={() => {
                    scrollToTab(key);
                    // doLockAnimation();
                    if (!tabsWrapperRef.current) {
                        return;
                    }
                    // Focus element will make scrollLeft change which we should reset back
                    if (!rtl) {
                        tabsWrapperRef.current.scrollLeft = 0;
                    }
                    tabsWrapperRef.current.scrollTop = 0;
                }}
            />
        );
    });

    // ========================== Tab ==========================
    // Render tab node & collect tab offset

    // ========================= Mobile ========================
    //   const touchMovingRef = useRef<number>();
    //   const [lockAnimation, setLockAnimation] = useState<number>();

    //   function doLockAnimation() {
    //     setLockAnimation(Date.now());
    //   }

    //   function clearTouchMoving() {
    //     window.clearTimeout(touchMovingRef.current);
    //   }

    //   useTouchMove(tabsWrapperRef, (offsetX, offsetY) => {
    //     function doMove(setState: React.Dispatch<React.SetStateAction<number>>, offset: number) {
    //       setState((value) => {
    //         const newValue = alignInRange(value + offset);

    //         return newValue;
    //       });
    //     }

    //     if (tabPositionTopOrBottom) {
    //       // Skip scroll if place is enough
    //       if (wrapperWidth >= wrapperScrollWidth) {
    //         return false;
    //       }

    //       doMove(setTransformLeft, offsetX);
    //     } else {
    //       if (wrapperHeight >= wrapperScrollHeight) {
    //         return false;
    //       }

    //       doMove(setTransformTop, offsetY);
    //     }

    //     clearTouchMoving();
    //     doLockAnimation();

    //     return true;
    //   });

    //   useEffect(() => {
    //     clearTouchMoving();
    //     if (lockAnimation) {
    //       touchMovingRef.current = window.setTimeout(() => {
    //         setLockAnimation(0);
    //       }, 100);
    //     }

    //     return clearTouchMoving;
    //   }, [lockAnimation]);
    // const  = 'l-ui-tabs';
    // console.log(children, 'children');
    // const tabs = parseTabList(children);
    // console.log(tabs, 'tabs');
    // const [curActiveKey, onCurActiveKey] = useState(() => defaultActiveKey ?? activeKey);
    // console.log(curActiveKey, 'curActiveKey');

    // // tabnavlist dom
    // const tabnavlistRef = useRef();

    // // ink-bar dom
    // const [inkBarStyle, setInkBarStyle] = useState({});
    // console.log(inkBarStyle, 'inkBarStyle');

    // // effect curActiveKey
    // useEffect(() => {
    //     if (tabnavlistRef.current) {
    //         //     const curTabDom = tabnavlistRef.current.children[curActiveKey];

    //         //     // if (curTabDom) {
    //         //     //     // debugger;
    //         //     //     const { width } = curTabDom?.getBoundingClientRect();
    //         //     //     console.log(curTabDom.getBoundingClientRect(), '===');
    //         //     //     setInkBarStyle({
    //         //     //         width,
    //         //     //     });
    //         //     // }
    //     }
    //     setInkBarStyle({
    //         width: 30,
    //         // left: curActiveKey * 20,
    //     });
    // }, [curActiveKey]);

    return (
        <div
            // ref={ref}
            role="tablist"
            className={classNames(`${prefixCls}-nav`, className)}
            style={style}
            onKeyDown={() => {
                // No need animation when use keyboard
                doLockAnimation();
            }}
        >
            {tabNodes}
            {/* <div className={classnames({ [`${prefixCls}-nav-wrap`]: true })}>
                <div className={classnames({ [`${prefixCls}-nav-list`]: true })}>
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
            </div> */}
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
