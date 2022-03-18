
## DOM

### oNode1和oNode2在同一文档中，且不会为相同的节点，寻找这两个节点最近的一个共同父节点，可以包括节点本身。

1、递归版本

```js
function findCommonParent(oNode1, oNode2) {
  // 节点1包含2 
  if (oNode1.contains(oNode2)) {
    return oNode1
    // 节点2包含1
  } else if (oNode2.contains(oNode1)) {
    return oNode2
  } else {
    // 两个节点互不包含，则递归查找：节点1的父节点，和节点2对比
    return findCommonParent(oNode1.parentNode, oNode2)
  }
}
```

2、遍历版本

```js
function findCommonParent (oNode1, oNode2) {
  // 这里用oNode2是一样的
  // 如果某个节点包含另一个节点，直接返回，否则不断往上查找
  while (!oNode1.contains(oNode2)) {
    oNode1 = oNode1.parentNode 
  }

  return oNode1
}
```

## refer

- [朋友却说这题太没挑战了](https://juejin.cn/post/7070643296367804452#heading-6)
