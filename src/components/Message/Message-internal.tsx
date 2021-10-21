import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useState, useRef } from 'react';
import classNames from 'classnames';
import { getOffset } from 'rc-util/lib/Dom/css';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { GetContainer } from 'rc-util/lib/PortalWrapper';
import { IDialogPropTypes } from 'rc-dialog/lib/IDialogPropTypes';
// import { number } from 'prop-types';
// import Preview, { PreviewProps } from './Preview';
import MessageItem from './MessageItem';

import './Message-internal.less';

// 获取鼠标点击的事件
// const Message.info('This is a normal message');/
let messageRootNode: HTMLDivElement;

let uuid = 0;

function getUuid() {
    return uuid++;
}

interface MessageProps {
    content?: string;
    uuid?: number;
    data?: React.ReactNode
}

interface ContentProps {
    contentKey: number;
    content: string
}

interface MessageState {
    keys: number[];
    noticeList: ContentProps[]
}

class Message extends React.Component<MessageProps, MessageState> {
    static newInstance;

    static info;

    constructor(props) {
        super(props);
        this.state = {
            keys: [],
            noticeList: [],
        };
    }

    add = (key: number, content: string) => {
        this.setState((prevState) => {
            console.log(prevState, 'prevState');
            return {
                keys: [...prevState.keys, key],
            };
        });
        // this.state.keys.push(key);
    }

    closed = (key) => {
        console.log(key, 'closed');
        this.setState((prevState) => ({
            keys: prevState.keys.filter((prevKey) => prevKey !== key),
        }));
    }

    notice = (content: string) => {
        console.log(content, '通知了单例模式');
        this.add(getUuid(), content);
    }

    render() {
        const { content } = this.props;
        const { keys } = this.state;
        return (
            <div className="l-ui-message-root">
                {content}
                {
                    keys.map((key) => <MessageItem key={key} id={key} data={key} onClose={this.closed} />)
                }
            </div>
        );
    }
}

// 单例模式设计规则
// 单例 闭包
// 全局只有一个例子
// 通过全局 uuid 来批量增加与删除

Message.newInstance = function (params, cb) {
    const div = document.createElement('div');
    document.body.appendChild(div);
    // const notification = {
    //     notice: ({ content }) => {
    //         const seed = getUuid();
    //         const itemNode = (
    //             <div>
    //                 {content}
    //                 {seed}
    //             </div>
    //         );

    //     },
    // };

    // console.log(cb, 'cb');
    // cb(notification);
    function ref(notification) {
        cb({
            notice() {
                notification.notice({
                    content: 'content',
                });
            },
            destroy() {
                ReactDOM.unmountComponentAtNode(div);
                document.body.removeChild(div);
            },
        });
    }

    ReactDOM.render(<Message uuid={1} ref={ref} />, div);

    return ref;
};

let messageInstance = null;

function getInstance() {
    Message.newInstance({}, (msgInstance) => {
        messageInstance = msgInstance;
    });
}

Message.info = function (content) {
    if (messageInstance === null) {
        getInstance();
    }
    messageInstance.notice({
        content: 'content',
    });
};

export default Message;
