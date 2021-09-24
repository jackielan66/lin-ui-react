import * as React from 'react';
import classNames from 'classnames';
import Preview from './Preview';

import './Image.less';

interface ImageProps {
    src: string,
    prefixCls?: string,
    size?: number,
    className?: string,
    type?: string,
    width?: number,
    alt?: string
}

const Img = ({
    src,
    prefixCls = 'l-ui-img', size = 16, type, className, alt = '',
    width,
}: ImageProps): React.ReactElement<ImageProps> => {
    const [visible, setVisible] = React.useState(false);

    const handleClickPreview = () => {
        setVisible(true);
    };

    const loadStatus = React.useRef(false);

    // =================  img load ======================
    React.useEffect(() => {
        const image = new Image();
        image.src = src;
        image.onerror = () => {
            console.log('error');
        };
    }, [src]);

    return (
        <div className={classNames(prefixCls, className)}>
            <img src={src} width={width} alt={alt} />
            <div className={classNames({
                [`${prefixCls}-mask`]: true,
            })}
            >
                <div
                    className={classNames({
                        [`${prefixCls}-mask-info`]: true,
                    })}
                    onClick={handleClickPreview}
                >
                    预览
                </div>
            </div>
            {
                visible && (
                    <Preview
                        visible={visible}
                        src={src}
                        onHidden={(event) => {
                            setVisible(false);
                        }}
                    />
                )
            }

        </div>
    );
};

// Icon.propTypes = {
//     type: PropTypes.string,
// };

export default Img;
