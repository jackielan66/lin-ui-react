import './components/style/default.less';

import guid from 'rc-util/lib/guid';
import React, {
    createRef, useEffect, useRef, useState,
} from 'react';

import {
    Input, Tabs, Tag, Icon, Image, Modal, Message, Collapse,
} from './components';

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

const Test = () => {
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

function App() {
    const callback = () => {

    };

    return (
        <div type="" className="App">
            <Collapse accordion onChange={callback}>
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
}

export default App;
