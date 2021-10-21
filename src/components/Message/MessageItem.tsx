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
// import PreviewGroup, { context } from './PreviewGroup';

import './Message-internal.less';

// 获取鼠标点击的事件
// const Message.info('This is a normal message');/
let messageRootNode: HTMLDivElement;

interface MessageItemProps {
    content?: string;
    uuid?: number;
    data?: React.ReactNode;
    key?: number;
    id?: number;
    onClose?: (key: number) => void
}

interface MessageItemState {
    keys?: number[]
}

const duration = 3000;

class MessageItem extends React.Component<MessageItemProps, MessageItemState> {
    timer;

    constructor(props) {
        super(props);
        this.state = {
            // keys: [],
        };
        this.timer = null;
    }

    componentDidMount() {
        window.setTimeout(() => {
            this.close();
        }, duration);
    }

    close = () => {
        const { onClose, key, id } = this.props;
        console.log(id, 'close inijntiejtioejt ');
        onClose?.(id);
    }

    add = (key: number) => {
        this.setState((prevState) => {
            console.log(prevState, 'prevState');
            return {
                keys: [...prevState.keys, key],
            };
        });
        // this.state.keys.push(key);
    }

    notice = (params) => {
        console.log(params, '通知了单例模式');
        this.add(1);
    }

    render() {
        const { content, data, key } = this.props;
        const { keys } = this.state;
        console.log(key, 'close inijntiejtioejt ');
        console.log(data, 'data  close inijntiejtioejt ');
        return (
            <div className="l-ui-message-item">
                {data}
            </div>
        );
    }
}

export default MessageItem;
