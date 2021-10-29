/**
 * @class ZIndexStore
 * @description 全局z-index协调器，用与协调模态框的覆盖次序
 */

// 使用单例设计模式
// 使用链表，链表的优势的有什么
// 或使用hash表，hash更快

// 目前使用的字典数据格式
// 单例加链表的格式

function Element({ modalId, zIndex }) {
  this.modalId = modalId
  this.zIndex = zIndex
}

function Node(element) {
  this.element = new Element(element)
  this.prev = null
  this.next = null
}

// // 链表类
// class LList {
//   constructor() {
//     this.head = new Node('head')
//   }

//   find(item) {
//     let curNode = this.head
//     while (curNode != null && curNode.element != item) {
//       curNode = curNode.next
//     }
//     return curNode
//   }

//   insert(item, element) {
//     // 最后一个节点值
//     let lastNode = null
//     console.log(item, 'item')
//     console.log(element, 'element')

//     if (!element) {
//       lastNode = this.head
//       // debugger
//       while (lastNode.next != null) {
//         lastNode = lastNode.next
//       }
//     }
//     const newNode = new Node(item)
//     // console.log(newNode, 'newNode')
//     console.log(lastNode.next, 'lastNode.next')
//     lastNode.next = newNode
//     lastNode.next.prev = lastNode
//   }

//   show() {
//     let curNode = this.head
//     while (curNode != null) {
//       console.log(curNode, 'curNode element')
//       curNode = curNode.next
//     }
//   }
// }

// const llist = new LList()
// llist.insert({ modalId:1, zIndex:1 })
// llist.insert({})
// llist.insert('1134')
// llist.show()

class ZIndexStore {
  constructor() {
    this.max = 0
    this.zIndex = {}
  }

  addZIndex(modalKey) {
    if (this.zIndex[modalKey] !== this.max) {
      this.max += 1
      this.zIndex[modalKey] = this.max
    }
    return this.max
  }

  getAllZIndex() {
    return this.zIndex
  }

  getZIndex(modalKey) {
    return this.zIndex[modalKey] || 0
  }

  getMax() {
    return this.max
  }

  setPrev(modalKey) {
    // 设置上一层，与上一层兑换位置就行
    console.log(modalKey, 'modalKey')
    const ModalZIndex = this.zIndex[modalKey]

    // 少于当前zindex 最近一个key
    let ltModalZIndexModalKey = ''
    // 大于当前zindex 最近一个模型id
    const gtModalZIndexModalKey = ''

    // 上一个modelkey
    for (const k in this.zIndex) {
      const zIndex = this.zIndex[k]
      if (zIndex === (ModalZIndex - 1)) {
        ltModalZIndexModalKey = k
        // console.log(k, 'MODELID')
        // console.log(this.zIndex[k], 'currentZindex')
        // this.zIndex[k] = currentModalZIndex
        break
      }
    }
    // 当前的模型key往上一级
    this.zIndex[modalKey] = (ModalZIndex - 1)
    this.zIndex[ltModalZIndexModalKey] = (ModalZIndex)
  }

  setNext(modalKey) {
    // 设置上一层，与上一层兑换位置就行
    console.log(modalKey, 'modalKey')
    const ModalZIndex = this.zIndex[modalKey]

    // 少于当前zindex 最近一个key
    const ltModalZIndexModalKey = ''
    // 大于当前zindex 最近一个模型id
    const gtModalZIndexModalKey = ''

    // 上一个modelkey
    for (const k in this.zIndex) {
      const zIndex = this.zIndex[k]
      if (zIndex === (ModalZIndex + 1)) {
        gtModalZIndexModalKey = k
        break
      }
    }

    // 当前的模型key往上一级
    this.zIndex[modalKey] = (ModalZIndex + 1)
    this.zIndex[ltModalZIndexModalKey] = (ModalZIndex)
  }

  setStart(modalKey) {
    let minIndex = 100
    for (const k in this.zIndex) {
      if (modalKey !== k) {
        const zIndex = this.zIndex[k]
        if (zIndex <= minIndex) {
          minIndex = zIndex
        }
      }
    }

    if (this.zIndex[modalKey] > minIndex) {
      this.zIndex[modalKey] = minIndex
      for (const k in this.zIndex) {
        if (modalKey !== k) {
          const zIndex = this.zIndex[k]
          this.zIndex[k] = zIndex + 1
        }
      }
    }

    // console.log(minIndex, 'minIndex')
  }

  setEnd(modalKey) {
    const maxIndex = 0
    for (const k in this.zIndex) {
      if (modalKey !== k) {
        const zIndex = this.zIndex[k]
        if (zIndex >= minIndex) {
          minIndex = zIndex
        }
      }
    }

    if (this.zIndex[modalKey] < maxIndex) {
      this.zIndex[modalKey] = maxIndex
      for (const k in this.zIndex) {
        if (modalKey !== k) {
          const zIndex = this.zIndex[k]
          this.zIndex[k] = zIndex - 1
        }
      }
    }
    // console.log(minIndex, 'minIndex')
  }
}

export default new ZIndexStore()
