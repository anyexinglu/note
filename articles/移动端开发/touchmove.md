## 移动端滑动问题

### cancelable

[cancelable MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/cancelable)

手势事件有个只读属性 cancelable，作用是告诉浏览器该事件是否允许监听器通过 preventDefault() 方法阻止，默认为 true。如果在 touch 事件内部调用 preventDefault()，事件默认行为被取消，页面也就静止不动了。

如果事件不能被取消，则其 cancelable 属性的值为 false，且事件发生时无法在事件监听回调中停止事件。

对于同时处理多种事件的监听回调，可能需要先检查 cancelable 属性的值，再调用这些事件的 preventDefault() 方法。
例如，浏览器厂商提议 wheel (en-US) 事件只能在事件监听回调第一次执行时被取消，接下来的 wheel 事件都不能被取消。

### passive

[passive MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

```js
target.addEventListener(type, listener, {
    capture: false, //  false 为冒泡，true 为捕获（即父节点的事件先执行）
    once: false,    // false:非单次监听
    passive: false  // 当属性passive的值为true的时候，代表该监听器内部不会调用preventDefault函数来阻止默认滑动行为；false就调用preventDefault函数
});
```

通过 onxxx 默认也是三个 false，比如 ontouchmove。

passive 为 true 意思是“顺从的”，也就是告诉浏览器 listener 永远不会调用 preventDefault()，不必等待 listener 执行完来判断是否 canceled，直接按默认行为执行该事件（比如 touchstart、touchmove 等，来防止卡顿感）即可。

且在 passive 为 true 的事件监听器内部不能使用 preventDefault，否则浏览器控制台会报错「Unable to preventDefault inside passive event listener invocation」。

#### passive 默认值

大部分节点默认值都是 false。但是文档级节点 Window，Document和 Document.body 的 touchstart (en-US) 和 touchmove (en-US) 事件的 passive 选项的默认值是 true，可以防止调用事件监听器，因此在用户滚动时无法阻止页面呈现。

打开任意网页执行：

```js
document.addEventListener('touchmove', () => {
    console.log('...document touchmove')
})

// $element 为 document 中任何一个普通 dom 元素，最简单的方式就是选择一个节点，赋值 $element = $0 后再执行下列代码：
$element.addEventListener('touchmove', () => {
    console.log('...$element touchmove')
})
```

getEventListeners(document) 得到的 touchmove 数组多了一项：`[{useCapture: false, passive: true, once: false, type: 'touchmove', listener: ƒ}]`，可见 document 默认 passive 为 true。

getEventListeners($element) 得到的 touchmove 数组多了一项：`[{useCapture: false, passive: false, once: false, type: 'touchmove', listener: ƒ}]`，可见普通 dom 元素默认 passive 为 false。

### stopPropagation

[stopPropagation MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/stopPropagation)

Event 接口的 stopPropagation() 方法阻止捕获和冒泡阶段中当前事件的进一步传播。但是，它不能防止任何默认行为的发生（默认行为要通过 preventDefault() 方法阻止）。

### targetTouches

targetTouches.length 不等于 1，表示多指。

### addEventListener 和 onxxx

addEventListener 可以多个。
ontouchmove 只能一个，后面设置的会覆盖前面设置的。
getEventListeners($0) 可以获取到两种方式绑定的方法。

### Q & A

1、touchmove 是否会冒泡，比如某个 element 触发后，document 也被触发？

会，不同于 scroll，而且默认 ontouchmove 不带 options 绑定的情况下，useCapture 默认 false，所以是冒泡阶段触发，就是先 element 再 document。

scroll 则不会，因为。

2、捕获还是冒泡

捕获：从外向内
冒泡：从内向外

在一个事件发生时，捕获过程跟冒泡过程总是先后发生，跟你是否监听毫无关联，先捕获后冒泡。

addEventListener 的第三个参数，决定该事件是在哪个阶段触发，true 为捕获，默认为 false 即冒泡。
document.body.addEventListener('click', eventHandler, false)

当我们实际监听事件时，默认使用冒泡模式，当开发组件时，需要通过父元素控制子元素的行为，可以使用捕获机制。
