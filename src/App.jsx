// import './components/style/default.less';

import guid from 'rc-util/lib/guid';
import React, {
    createRef, useEffect, useRef, useState, createContext, useContext,
} from 'react';

import {
    Input, Tabs, Tag, Icon, Image, Modal, Message, Collapse, Switch, Button,
} from '@Components';

const { Panel } = Collapse;

const usePrevious = (state) => {
    const ref = useRef();
    useEffect(() => {
        // 执行了 useEffect
        console.log('usePrevious', state);

        ref.current = state;
    });
    console.log('usePrevious 外面', state);
    return ref.current;
};

let prevUseRefIntance = null;

const themes = {
    light: {
        foreground: '#000000',
        background: '#eeeeee',
    },
    dark: {
        foreground: '#ffffff',
        background: '#222222',
    },
};

const ThemeContext = React.createContext(themes.light);

const Test = function () {
    const [renderIndex, setRenderIndex] = React.useState(0);
    const refFromUseRef = useRef(guid());
    const refFromCreateRef = createRef();
    if (prevUseRefIntance === refFromUseRef) {
        // debugger;
    }
    prevUseRefIntance = refFromUseRef;
    // console.log(refFromUseRef, 'refFromUseRef');
    // console.log(refFromCreateRef, 'refFromCreateRef');

    const prevCount = usePrevious(renderIndex);

    React.useEffect(() => {
        console.log('componetan did mount');
    }, []);

    if (!refFromUseRef.current) {
        refFromUseRef.current = renderIndex;
    }
    if (!refFromCreateRef.current) {
        refFromCreateRef.current = renderIndex;
    }

    return (
        <>
            <p>
                current render index
                {renderIndex}
            </p>
            <p>
                current refFromCreateRef
                {refFromCreateRef.current}
            </p>
            <p>
                current refFromUseRef
                {refFromUseRef.current}
            </p>
            <p>
                prevCount
                {prevCount}
            </p>
            <button type="button" onClick={() => setRenderIndex(renderIndex + 1)}>
                plus
            </button>
        </>
    );
};

const App = () => {
    const callback = () => {

    };

    const [checked, setChecked] = React.useState(false);

    return (
        <div type="" className="App">
            <Button type="primary"> 按钮</Button>
            <Switch />
            <Switch
                checked={checked}
                disabled
                onChange={(_checked) => {
                    setChecked(_checked);
                }}
            />

            <Collapse onChange={callback}>
                <Panel header="This is panel header 1" key="1">
                    <p>1111</p>
                </Panel>
                <Panel header="This is panel header 2" key="2">
                    <p>13123</p>
                </Panel>
                <Panel header="This is panel header 3" key="3">
                    <p>43434</p>
                </Panel>
            </Collapse>
        </div>
    );
};

export default App;
