/**
 * @class ZIndexStore
 * @description 全局z-index协调器，用与协调模态框的覆盖次序
 */

// 使用单例设计模式
// 使用链表，链表的优势的有什么
// 或使用hash表，hash更快

// 目前使用的字典数据格式
// 单例加链表的格式

function Element(id, zIndex) {
    this.id = id;
    this.zIndex = zIndex;
}
class ZIndexStore {
    constructor() {
        this.max = 0;
        this.zIndex = {};
        this.dataSource = [];
    }

    addElement(id, zIndex) {
        this.dataSource.push();
    }

    setData(modalKey, zIndex) {
        this.zIndex[modalKey] = zIndex;
    }

    setMax(value) {
        if (this.max < value) {
            this.max = value;
        }
    }

    addZIndex(modalKey) {
        if (this.zIndex[modalKey] !== this.max) {
            this.max += 1;
            this.zIndex[modalKey] = this.max;
        }
        return this.max;
    }

    getAllZIndex() {
        return this.zIndex;
    }

    getZIndex(modalKey) {
        return this.zIndex[modalKey] || 0;
    }

    getMax() {
        return this.max;
    }

    swrap(index, nIndex) {
        // 交换index
    }

    setPrev(modalKey) {
        // 设置上一层，与上一层兑换位置就行
        console.log(modalKey, 'modalKey');
        const ModalZIndex = this.zIndex[modalKey];

        // 少于当前zindex 最近一个key
        let ltModalZIndexModalKey = '';
        // 大于当前zindex 最近一个模型id
        const gtModalZIndexModalKey = '';

        // 上一个modelkey
        for (const k in this.zIndex) {
            const zIndex = this.zIndex[k];
            if (zIndex === (ModalZIndex - 1)) {
                ltModalZIndexModalKey = k;
                // console.log(k, 'MODELID')
                // console.log(this.zIndex[k], 'currentZindex')
                // this.zIndex[k] = currentModalZIndex
                break;
            }
        }
        // 当前的模型key往上一级
        this.zIndex[modalKey] = (ModalZIndex - 1);
        this.zIndex[ltModalZIndexModalKey] = (ModalZIndex);
    }

    setNext(modalKey) {
        // 设置上一层，与上一层兑换位置就行
        console.log(modalKey, 'modalKey');
        const ModalZIndex = this.zIndex[modalKey];

        // 少于当前zindex 最近一个key
        const ltModalZIndexModalKey = '';
        // 大于当前zindex 最近一个模型id
        const gtModalZIndexModalKey = '';

        // 上一个modelkey
        for (const k in this.zIndex) {
            const zIndex = this.zIndex[k];
            if (zIndex === (ModalZIndex + 1)) {
                gtModalZIndexModalKey = k;
                break;
            }
        }

        // 当前的模型key往上一级
        this.zIndex[modalKey] = (ModalZIndex + 1);
        this.zIndex[ltModalZIndexModalKey] = (ModalZIndex);
    }

    setStart(modalKey) {
        let minIndex = 100;
        for (const k in this.zIndex) {
            if (modalKey !== k) {
                const zIndex = this.zIndex[k];
                if (zIndex <= minIndex) {
                    minIndex = zIndex;
                }
            }
        }

        if (this.zIndex[modalKey] > minIndex) {
            this.zIndex[modalKey] = minIndex;
            for (const k in this.zIndex) {
                if (modalKey !== k) {
                    const zIndex = this.zIndex[k];
                    this.zIndex[k] = zIndex + 1;
                }
            }
        }

        // console.log(minIndex, 'minIndex')
    }

    setEnd(modalKey) {
        const maxIndex = 0;
        for (const k in this.zIndex) {
            if (modalKey !== k) {
                const zIndex = this.zIndex[k];
                if (zIndex >= minIndex) {
                    minIndex = zIndex;
                }
            }
        }

        if (this.zIndex[modalKey] < maxIndex) {
            this.zIndex[modalKey] = maxIndex;
            for (const k in this.zIndex) {
                if (modalKey !== k) {
                    const zIndex = this.zIndex[k];
                    this.zIndex[k] = zIndex - 1;
                }
            }
        }
        // console.log(minIndex, 'minIndex')
    }
}

export default new ZIndexStore();
