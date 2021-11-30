import * as React from 'react';

interface PanelProps {
    header: React.ReactElement;
    children: React.ReactNode;
    onClick: (e) => void
}

const InternalPanel = ({
    header,
    children,
    onClick,
}: PanelProps) => {
    // console.log(restProps, 'restProps');
    const headNode = header;
    return (
        <div>
            <div
                onClick={(event: React.SyntheticEvent) => {
                    onClick?.(event);
                }}
                className=""
            >
                {headNode}
            </div>
            <div>
                {children}
                {/* {restProps.children} */}
            </div>
        </div>
    );
};

export default InternalPanel;
