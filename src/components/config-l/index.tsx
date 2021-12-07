import * as React from 'react';

const defaultGetPrefixCls = (suffixCls?: string, customizePrefixCls?: string) => {
    if (customizePrefixCls) return customizePrefixCls;
    return suffixCls ? `l-ui-${suffixCls}` : 'l-ui';
};

const lContextCfg = React.createContext({
    size: 'normal',
    getPrefixCls: defaultGetPrefixCls,
    direction: 'lft',
});

export default lContextCfg;
