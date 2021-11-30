import * as React from 'react';

interface PanelProps {
    header: React.ReactElement;
    children: React.ReactNode;
    isActive: boolean,
    onClick: (e) => void
}

const InternalPanel = ({
    header,
    children,
    isActive,
    onClick,
}: PanelProps) => {
    // console.log(restProps, 'restProps');
    const headNode = header;
    return (
        <div>
            <div
                onClick={(event: React.SyntheticEvent) => {
                    console.log('item onclick');
                    onClick?.(event);
                }}
                className=""
            >
                {headNode}
            </div>
            <div hidden={!isActive}>
                {children}
                {/* {restProps.children} */}
            </div>
        </div>
    );
};

export default InternalPanel;
