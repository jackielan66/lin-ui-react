import * as React from 'react';
import classNames from 'classnames';
import { ConfigContext } from '../config-provider';
import { cloneElement } from '../_util/reactNode';
import InternalPanel from './InternalPanel';
import CollapsePanel, { CollapsibleType } from './CollapsePanel';

const toArray = (value) => (Array.isArray(value) ? value : [value]);

export type ExpandIconPosition = 'left' | 'right' | undefined

export interface CollapseProps {

    activeKey?: Array<string | number> | string | number;
    defaultActiveKey?: Array<string | number> | string | number;
    /**
     * 手风琴效果，每次只展开一个。是一种特殊的折叠面板，只允许单个内容区域展开
     */
    accordion?: boolean;
    destroyInactivePanel?: boolean;
    onChange?: (key: string | string[]) => void;
    style: React.CSSProperties;
    className?: string;
    bordered?: boolean;
    prefixCls?: string;
    expandIcon?: (panelProps: PanelProps) => React.ReactNode;
    expandIconPosition?: ExpandIconPosition;
    ghost?: boolean;
    collapsible?: CollapsibleType;
    children: React.ReactNode;
}

interface PanelProps {
    isActive?: boolean;
    header?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    showArrow?: boolean;
    forceRender?: boolean;
    /** @deprecated Use `collapsible="disabled"` instead */
    disabled?: boolean;
    extra?: React.ReactNode;
    collapsible?: CollapsibleType;
    // children: React.ReactNode
}

interface CollapseInterface extends React.FC<CollapseProps> {
    Panel: typeof CollapsePanel;
}

const Collapse: CollapseInterface = (props) => {
    const { getPrefixCls, direction } = React.useContext(ConfigContext);

    // console.log(getPrefixCls, 'getPrefixCls');
    // console.log(direction, 'direction');

    const {
        defaultActiveKey,
        children,
        accordion = false,
        prefixCls: customizePrefixCls, className = '', bordered = true, ghost,
    } = props;

    const prefixCls = getPrefixCls('collapse', customizePrefixCls);

    const getIconPosition = () => {
        const { expandIconPosition } = props;
        if (expandIconPosition !== undefined) {
            return expandIconPosition;
        }
        return direction === 'rtl' ? 'right' : 'left';
    };

    const renderExpandIcon = (panelProps: PanelProps = {}) => {
        const { expandIcon } = props;
        const icon = <span>展开</span> as React.ReactNode;
        return cloneElement(icon, () => ({
            className: classNames((icon as any).props.className, `${prefixCls}-arrow`),
        }));
    };

    const iconPosition = getIconPosition();
    const collapseClassName = classNames(
        {
            [`${prefixCls}-borderless`]: !bordered,
            [`${prefixCls}-icon-position-${iconPosition}`]: true,
            [`${prefixCls}-rtl`]: direction === 'rtl',
            [`${prefixCls}-ghost`]: !!ghost,
        },
        className,
    );

    const [internalActiveKey, setInternalActiveKey] = React.useState(() => {
        if (Array.isArray(defaultActiveKey)) {
            return defaultActiveKey;
        }
        return defaultActiveKey ? [defaultActiveKey] : [];
    });

    const isExpand = (key) => internalActiveKey.includes(key);

    // console.log(internalActiveKey, 'internalActiveKey item.props');

    const getItems = () => toArray(children).map((child: React.ReactElement, index: number) => {
        console.log(child.props, 'item.props');
        return (
            <CollapsePanel
                key={child.key}
                {...child.props}
                onClick={(event) => {
                    // console.log(event, 'event');
                    if (accordion) {
                        setInternalActiveKey(isExpand(child.key) ? [] : [child.key]);
                        return;
                    }
                    if (isExpand(child.key)) {
                        const newsActiveKeys = internalActiveKey.filter((key) => key !== child.key);
                        setInternalActiveKey(newsActiveKeys);
                    } else {
                        setInternalActiveKey([...internalActiveKey, child.key]);
                    }
                }}
            >
                <div hidden={!isExpand(child.key)}>
                    {child.props.children}
                </div>
            </CollapsePanel>
        );
    });

    return (
        <div>
            {getItems()}
        </div>
    );
};

Collapse.Panel = CollapsePanel;// InternalPanel;

export default Collapse;
