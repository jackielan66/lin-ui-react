const radix = 10;

/**
 * 转换x，y到对应的 left top right bottom
 *
 * @export
 * @param {*} [position={ x: 0, y: 0 }]
 * @param {HTMLElement} container
 * @param {HTMLElement} parentcontainer
 * @return {*}
 */
export function getTransformPos(position = { x: 0, y: 0 }, container: HTMLElement, parentcontainer: HTMLElement) {
    console.log(container, 'container');
    console.log(parentcontainer, 'parentcontainer');
    const style = {
        left: `${position.x}px`,
        top: `${position.y}px`,
        right: 'initial',
        bottom: 'initial',
    };
    if (!container) return style;
    // const test = container.getBoundingClientRect();
    // const {
    //     left, right, top, bottom,
    //     width, height,
    // } = getComputedStyle(container);
    // // console.log(test, 'testdata');
    // debugger;
    //

    //
    if (position.x < 0) {
        style.left = 'initial';
        style.right = `${Math.abs(position.x)}px`;
    }
    if (position.y < 0) {
        style.top = 'initial';
        style.bottom = `${Math.abs(position.y)}px`;
    }

    return style;
}

/**
 *
 * 把style转换成 x y 模式 给外部接口
 */
export function getStyle(container: HTMLElement, parentContainer: HTMLElement) {
    // console.log(container, 'container');
    // console.log(parentcontainer, 'parentcontainer');
    const result = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        zIndex: 0,
    };
    if (!container) {
        return result;
    }
    const {
        left, right, top, bottom,
        width, height,
    } = getComputedStyle(container);
    const {
        width: pWidth, height: pHeight,
    } = getComputedStyle(parentContainer);
    // debugger;
    result.width = parseFloat(width);
    result.height = parseFloat(height);

    if ((parseInt(left, 10) + result.width / 2) > parseInt(pWidth) / 2) {
        result.x = -parseInt(right, 10);
    } else {
        result.x = parseInt(left, 10);
    }

    if ((parseInt(top, 10) + result.height / 2) > parseInt(pHeight) / 2) {
        result.y = -parseInt(bottom, 10);
    } else {
        result.y = parseInt(top, 10);
    }
    // if (left) { console.log(result, 'result'); }
    console.log(result, 'result');
    return result;
}
