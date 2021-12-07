import * as React from 'react';

import {
    ConfigConsumer,
    ConfigContext,
    CSPConfig,
    DirectionType,
    ConfigConsumerProps,
} from './context';

export {
    ConfigContext,
    CSPConfig,
    ConfigConsumer,
    ConfigConsumerProps,
};

export interface ConfigProviderProps {

}

const ConfigProvider: React.FC<ConfigProviderProps> & {
    ConfigContext: typeof ConfigContext;
    // SizeContext: typeof SizeContext;
    // config: typeof setGlobalConfig;
} = (props) =>
        // console.log(props, 'props');
        <div />;
ConfigProvider.ConfigContext = ConfigContext;

export default ConfigProvider;
