import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useState } from 'react';
import classNames from 'classnames';
import { getOffset } from 'rc-util/lib/Dom/css';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { GetContainer } from 'rc-util/lib/PortalWrapper';
import { IDialogPropTypes } from 'rc-dialog/lib/IDialogPropTypes';
// import { number } from 'prop-types';
// import Preview, { PreviewProps } from './Preview';
// import PreviewGroup, { context } from './PreviewGroup';

import './Modal-internal.less';

// export interface ImagePreviewType extends Omit<IDialogPropTypes,
//     'mask' | 'visible' | 'closable' | 'prefixCls' | 'onClose' | 'afterClose' | 'wrapClassName'
// > {
//     src?: string;
//     visible?: boolean;
//     onVisibleChange?: (value: boolean, prevValue: boolean) => void;
//     getContainer?: GetContainer | false;
//     mask?: React.ReactNode;
//     maskClassName?: string;
//     icons?: PreviewProps['icons'];
// }

// let uuid = 0;

// const fallbackImg = 'data:image/png;base64,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';

// interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder' | 'onClick'> {
//     // original
//     src?: string;
//     wrapperClassName?: string;
//     wrapperStyle?: React.CSSProperties;
//     prefixCls?: string;
//     previewPrefixCls?: string;
//     placeholder?: React.ReactNode;
//     fallback?: string;
//     preview?: boolean | ImagePreviewType;
//     /**
//      * @deprecated since version 3.2.1
//      */
//     onPreviewClose?: (value: boolean, preview: boolean) => void;
//     onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
//     onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
//     // size?: number,
//     // className?: string,
//     // type?: string,
//     // width?: number,
//     // height?: number | string
//     // alt?: string,
//     // fallback?: string,
//     // placeholder?: React.ReactNode,
//     // preview?: boolean
// }

// interface CompoundedComponent<P> extends React.FC<P> {
//     PreviewGroup: typeof PreviewGroup
// }

// type ImageStatus = 'normal' | 'error' | 'loading';

// const ImageInternal: CompoundedComponent<ImageProps> = ({
//     src: imgSrc,
//     alt,
//     onPreviewClose: onInitialPreviewClose,
//     prefixCls = 'rc-image',
//     previewPrefixCls = `${prefixCls}-preview`,
//     placeholder,
//     fallback,
//     width,
//     height,
//     style,
//     preview = true,
//     className,
//     onClick,
//     onError: onImageError,
//     wrapperClassName.
//     wrapperStyle

//     //Img
//     crossOrigin,
//     decoding,
//     loading,
//     referrerPolicy,
//     sizes,
//     srcSet,
//     useMap,
//     ...otherProps
// }) => {
//     const isCustomPlaceholder = placeholder && placeholder !== true
//     const {
//         src: previewSrc,
//         visible: previewVisible = undefined,
//         onVisibleChange: onPreviewVisibleChange = onInitialPreviewClose,
//         getContainer: getPreviewContainer = undefined,
//         mask: previewMask,
//         maskClassName,
//         icons,
//         ...dialogProps
//     }: ImagePreviewType = typeof preview === 'object' ? preview : {};
//     const src = previewSrc ?? imgSrc;
//     const isControlled = previewVisible !== undefined;
//     const [isShowPreview, setShowPreview] = useMergedState(!!previewVisible, {
//         value: previewVisible,
//         onChange: onPreviewVisibleChange
//     })
//     const [status, setStatus] = useState<ImageStatus>(isCustomPlaceholder ? 'loading' : 'normal')
//     const [mousePosition, setMousePosition] = useState<null | { x: number, y: number }>(null)
//     const isError = status === 'error';
//     const {
//         isPreviewGroup,
//         setCurrent,
//         setShowPreview: setGroupShowPreview,
//         setMousePosition: setGroupMousePosition,
//         registerImage,
//     } = React.useContext(context);
//     const [currentId] = React.useState<number>(() => {
//         uuid += 1
//         return uuid
//     })
//     const canPreview = preview && !isError;

//     const isLoaded = React.useRef(false)

//     const onLoad = () => {
//         setStatus('normal');
//     };

//     const onError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
//         if (onImageError) {
//             onImageError(e);
//         }
//         setStatus('error');
//     };

//     const onPreview: React.MouseEventHandler<HTMLDivElement> = e => {
//         if (!isControlled) {
//             const { left, top } = getOffset(e.target);

//             if (isPreviewGroup) {
//                 setCurrent(currentId);
//                 setGroupMousePosition({
//                     x: left,
//                     y: top,
//                 });
//             } else {
//                 setMousePosition({
//                     x: left,
//                     y: top,
//                 });
//             }
//         }

//         if (isPreviewGroup) {
//             setGroupShowPreview(true);
//         } else {
//             setShowPreview(true);
//         }

//         if (onClick) onClick(e);
//     }
//     // daochu 1.41fen
// };

interface ModalProps {
    prefixCls: string;
    className: string;
    visible: boolean;
    title: React.ReactNode;
    children: React.ReactNode;
    onCancel?: () => void;
    width?: string | number;
    mask: boolean;
    maskCloseable: boolean;
    afterClose?: () => void;
    bodyStyle?: React.CSSProperties;
    getContainer?: () => HTMLElement
}

// 获取鼠标点击的事件
let mousePosition: { x: number, y: number } | null;
const getClickPosition = (e: MouseEvent) => {
    mousePosition = {
        x: e.pageX,
        y: e.pageY,
    };
    // console.log(mousePosition, 'mousePosition');
    // 100ms 内发生过点击事件，则从点击位置动画展示
    // 否则直接 zoom 展示
    // 这样可以兼容非点击方式展开
    setTimeout(() => {
        mousePosition = null;
    }, 100);
};

document.documentElement.addEventListener('click', getClickPosition, true);

const Modal = ({
    // src,
    // height,
    prefixCls = 'l-ui-modal',
    className,
    visible,
    title,
    width,
    onCancel,
    mask = true,
    maskCloseable = true,
    bodyStyle,
    getContainer = () => document.body,
    ...restProps
}: ModalProps): React.ReactNode => {
    const imgSrc = '';
    // 从哪里点击，就从哪里动画出来

    console.log('mousePosition', mousePosition);
    let transformOrigin = '';
    if (mousePosition) {
        transformOrigin = `${mousePosition.x}px ${mousePosition.y}px`;
    }

    const contentStyle = {
        transformOrigin,
        ...width ? { width } : {},
    };
    const onClickMask = () => {
        if (maskCloseable) {
            onCancel?.();
        }
    };
    const containerDom = getContainer();

    return ReactDOM.createPortal(<div
        className={classNames(`${prefixCls}-root`, `${prefixCls}-text-center`, className)}
        style={{ display: visible ? 'block' : 'none' }}

    >

        {mask && (
            <div
                className={`${prefixCls}-mask`}
                onClick={() => {
                    onClickMask?.();
                }}
            />
        )}

        <div className={`${prefixCls}-wrap`}>
            <div className={`${prefixCls}-content`} style={contentStyle}>
                <div className={`${prefixCls}-title`}>
                    {title}
                    <span
                        className={`${prefixCls}-close`}
                        onClick={() => {
                            onCancel?.();
                        }}
                    >
                        关闭
                    </span>
                </div>
                <div className={`${prefixCls}-body`} style={bodyStyle || {}}>
                    {
                        restProps.children
                    }
                </div>
            </div>

            {/* <div className={`${prefixCls}-footer`}>
                <button>取消</button>
                <button>确定</button>
            </div> */}
        </div>
    </div>, containerDom);
};

export default Modal;
