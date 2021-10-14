import './components/style/default.less';

import guid from 'rc-util/lib/guid';
import React, {
    createRef, useEffect, useRef, useState,
} from 'react';

import {
    Input, Tabs, Tag, Icon, Image, Modal,
} from './components';
import Button from './components/Button/Button';
import Divider from './components/Divider/Divider';
// import './App.less'
// import Picker from './components/Picker/index'
// import Icon from './components/Icon/Icon';
import { Title } from './components/Typography';
import logo from './logo.svg';

const { CheckableTag } = Tag;
const { TextArea } = Input;

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
    const [count, setCount] = useState(11);
    const [selectedTags, setSelectedTags] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const callback = () => {

    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleChange = (tag, checked) => {
        const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter((t) => t !== tag);
        setSelectedTags(nextSelectedTags);
    };

    const tagsData = ['Movies', 'Books', 'Music', 'Sports'];

    const handleClickIcon = () => {
        alert(this);
    };

    return (
        <div type="" className="App">
            <Button type="primary" onClick={showModal}>
                Open Modal
            </Button>
            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
                3121
                323
            </Modal>
            <Icon className="test" size="22" onClick={handleClickIcon} type="arrow-down-bold" />
            <Tag color="magenta" closable> 323</Tag>
            <Tag color="magenta"> 432423 </Tag>
            <Tag color="#f50"> 432423 </Tag>
            <Tag color="red">red</Tag>
            <div />
            <span style={{ marginRight: 8 }}>Categories:</span>
            {tagsData.map((tag) => (
                <CheckableTag
                    key={tag}
                    checked={selectedTags.indexOf(tag) > -1}
                    onChange={(checked) => handleChange(tag, checked)}
                >
                    {tag}
                </CheckableTag>
            ))}
            <Image
                width={200}
                placeholder={(
                    <Image
                        preview={false}
                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
                        width={200}
                    />
                )}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            />
            <Image
                width={200}
                src="error
                "
            />
            {/* <Badge dot>
                <a href="#">Link something</a>
            </Badge> */}
            {/* <Tabs defaultActiveKey="1" onChange={callback}>
                <Tabs.TabPane tab="Tab 1" key="1">
                    Content of Tab Pane 1
                </Tabs.TabPane>
                <Tabs.TabPane tab="Tab 2" key="2">
                    Content of Tab Pane 2
                </Tabs.TabPane>
            </Tabs>
            <Title>中国人</Title>
            <Divider style={{ marginTop: 5, marginBottom: 5 }} orientation="left">
                中国人左边
            </Divider>
            <span>
                请输入数字
                {count}
                {' '}
            </span>
            <Input value={count} onChange={setCount} /> */}
            {/* <Input type="password" value={count} />
            <div>
                <Input addonBefore="http://" addonAfter=".com" defaultValue="mysite" />
            </div>

            <div />
            <input />
            <Icon size="18" type="arrow-down-bold" />
            <Icon size="18" type="arrow-left-bold" /> */}
            {/* <Button
                type="primary"
                onClick={() => {
                    console.log(' antd button');
                    setCount(count + 1);
                }}
            >
                按钮

            </Button>
            <TextArea placeholder="请输入介绍" value={count} onChange={setCount} /> */}
            <Test />

            <header className="App-header">
                <p>Hello Vite + React!</p>
                <p>
                    <button type="button" onClick={() => setCount((count) => count + 1)}>
                        count is:
                        {' '}
                        {count}
                    </button>
                </p>
            </header>
        </div>
    );
}

export default App;
