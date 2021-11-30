import * as React from 'react';
import classNames from 'classnames';

export type CollapsibleType = 'header' | 'disabled';

interface CollapsePanelProps {
    key: string | number;
    header: React.ReactNode;
    /** @deprecated Use `collapsible="disabled"` instead */
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
    showArrow?: boolean;
    prefixCls?: string;
    forceRender?: boolean;
    id?: string;
    extra?: React.ReactNode;
    collapsible?: CollapsibleType;
}

const CollapsePanel: React.FC<CollapsePanelProps> = (props) => {
    // console.log(restProps, 'restProps');
    const { header, className } = props;
    return (
        <div>
            <div className={className}>
                {header}
            </div>
            <div>
                {/* {children} */}
                {/* {restProps.children} */}
            </div>
        </div>
    );
};

export default CollapsePanel;
