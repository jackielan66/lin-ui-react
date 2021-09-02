import './components/style/default.less';

import React, {
    createRef, useEffect, useRef, useState,
} from 'react';

import Button from './components/Button/Button';
import Divider from './components/Divider/Divider';
// import './App.less'
// import Picker from './components/Picker/index'
import Icon from './components/Icon/Icon';
import InputNumber from './components/InputNumber/InputNumber';
import { Title } from './components/Typography';
import logo from './logo.svg';

const usePrevious = (state) => {
    const ref = useRef();
    useEffect(() => {
        // 执行了 useEffect
        console.log('执行了 useEffect 内面', state);

        ref.current = state;
    });
    console.log('usePrevious 外面', state);
    return ref.current;
};

const Test = () => {
    console.log('每次都刷新了状态。如果状态有变化，所有函数重写走一波');
    const [renderIndex, setRenderIndex] = React.useState(0);
    const refFromUseRef = useRef();
    const refFromCreateRef = createRef();

    console.log(refFromUseRef, 'refFromUseRef');
    console.log(refFromCreateRef, 'refFromCreateRef');

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
    const [count, setCount] = useState(0);

    return (
        <div type="" className="App">
            <Title>中国人</Title>
            <Divider style={{ marginTop: 5, marginBottom: 5 }} orientation="left">
                中国人左边
            </Divider>
            <span>
                请输入数字
                {count}
                {' '}
            </span>
            <InputNumber value={count} onChange={setCount} />
            <div />
            <input />
            <Icon size="18" type="arrow-down-bold" />
            <Icon size="18" type="arrow-left-bold" />
            <Button
                type="primary"
                onClick={() => {
                    console.log(' antd button');
                    setCount(count + 1);
                }}
            >
                按钮

            </Button>
            {/* <Test /> */}
            {/* count is: {count}
      <Button type="primary" >按钮</Button>
      <div>
        <div style={{height:300}} >
        <Picker onChange={(index)=>{
setCount(index)
        }}/>
        </div>

      </div> */}
            {/*
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>

         <Button>按钮</Button>
        </p>
        <p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          {' | '}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header> */}
        </div>
    );
}

export default App;
