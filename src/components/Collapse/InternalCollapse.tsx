import * as React from 'react';

import InternalPanel from './InternalPanel';

const toArray = (value) => (Array.isArray(value) ? value : [value]);

interface CollapseProps {
    defaultActiveKey: string | number | Array<string | number>;
    children: React.ReactNode;
    /**
     * 手风琴效果，每次只展开一个。是一种特殊的折叠面板，只允许单个内容区域展开
     * @type {boolean}
     * @memberof CollapseProps
     */
    accordion: boolean;
}

const InternalCollapse = ({
    defaultActiveKey,
    children,
    accordion = false,
}: CollapseProps) => {
    // console.log(props, 'props');
    const [internalActiveKey, setInternalActiveKey] = React.useState(() => {
        if (Array.isArray(defaultActiveKey)) {
            return defaultActiveKey;
        }
        return defaultActiveKey ? [defaultActiveKey] : [];
    });

    const isExpand = (key) => internalActiveKey.includes(key);

    // console.log(internalActiveKey, 'internalActiveKey item.props');

    const getItems = () => toArray(children).map((item) => {
        console.log(item.props, 'item.props');
        return (
            <InternalPanel
                key={item.key}
                {...item.props}
                onClick={(event) => {
                    // console.log(event, 'event');
                    if (accordion) {
                        setInternalActiveKey(isExpand(item.key) ? [] : [item.key]);
                        return;
                    }
                    if (isExpand(item.key)) {
                        const newsActiveKeys = internalActiveKey.filter((key) => key !== item.key);
                        setInternalActiveKey(newsActiveKeys);
                    } else {
                        setInternalActiveKey([...internalActiveKey, item.key]);
                    }
                }}
            >
                <div hidden={!isExpand(item.key)}>
                    {item.props.children}
                </div>
            </InternalPanel>
        );
    });

    return (
        <div>
            {getItems()}
        </div>
    );
};

InternalCollapse.Panel = InternalPanel;

export default InternalCollapse;
