---
title: React组件的本质
date: "2020-04-24T06:18:19.632Z"
description: 永远渲染。
lang: zh-hans
---

也许你已经使用React很长时间了，你使用优雅的jsx语法和React hooks来构建组件，最终构成页面。
然而，为什么我们只需要编写一些声明式的组件，React就可以管理它自己？
进一步而言，我们每天编写的组件到底是什么？

# 只是函数

考虑以下代码，它实现了一个简单的时钟，猜猜最终打印在chrome控制台中的是什么？

```javascript
const Text = () => {
  console.log("Text")
  return <p>Just text.</p>
}

const App = () => {
  const [clock, setClock] = React.useState(new Date().toISOString())
  console.log("App")

  React.useEffect(() => {
    const interval = setInterval(() => setClock(new Date().toISOString()), 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <div>clock: {clock}</div>
      <Text />
    </>
  )
}
```

事实是每秒，控制台中都会将`App`和`Text`一起打印出来。

React组件只是函数。如果你在React项目中使用过TypeScript的话，
你可能已经遇见过一个类型：`React.FC`，它是`FunctionComponent`的缩写,
定义如下：

```typescript
type FC<P> = (props: P) => ReactElement
```

这意味着**一个React函数组件代表一个函数，它接受`props`作为参数并最终返回一个React元素**。

JSX本质上是一种语法糖，它将被编译为一些函数调用：

```javascript
const Something = () => {
  return (
    <p>
      foo
      <span>bar</span>
    </p>
  )
}
// 编译为
const Something = () => {
  return React.createElement(
    "p",
    null,
    "foo",
    React.createElement("span", null, "bar"),
  )
}
```

在React元素的创建过程中，
他将递归地创建所有的子元素，
最终生成一颗元素树。

所以一个组件的渲染过程其实就是一次函数调用。
这就是为什么在前面的例子中我们每一秒都会得到`App`和`Text`。
组件状态的更新导致了组件的重新渲染，触发了函数调用。

# 用于渲染的元素

元素其实只是一种数据结构，你可以把它们看作对象，例如：

```javascript
// <p className='hello'>Hello</p>
// -> 转换为
const element = {
  type: "p",
  key: null,
  props: { className: "hello" },
  children: ["Hello"],
}
```

渲染器(Renderer)可以通过React元素上携带的信息，
例如`type`, `key`, `props`, `children`来轻松的将这种数据结构转换为它需要的形式。
例如ReactDOM将React元素转换为dom元素，React Native将React元素转换为原生控件。
你甚至可以直接把元素打印在屏幕上，这样你就创造了一个"打印渲染器"。

当更新发生的时候，一个新元素会被生成，例如：

```javascript
// we have a update
// <p className='hello'>updated</p>
// -> 转换为
const element = {
  type: "p",
  key: null,
  props: { className: "hello" },
  children: ["updated"],
}
```

# 渲染什么

在React中，并没有什么魔法来保证每次渲染得到的元素都是同一个对象。
事实上，**每次渲染都会得到一颗新的元素树**。

所以其实为每次渲染都创建一颗新的dom树也是可能的，
然而这样会有巨大的开销。
事实上，React使用一种叫做[reconciliation](https://reactjs.org/docs/reconciliation.html)的算法
来让自己知道具体应该做什么：是重新生成dom元素，还是在现有内容上做一些更新。

一个React的渲染器只需要实现一个供
[Reconciler](https://github.com/facebook/react/tree/master/packages/react-reconciler)调用的接口，
Reconciler就可以使用它提供的方法来更新。
我将使用以下的伪代码来描述ReactDOM和Reconciler的关系：

```javascript
ReactDOMRenderer = Reconciler(ReactDOMHostConfig)
```

代码中的`ReactDOMHostConfig`正是我之前提到的接口，
它有如下结构：

```javascript
export const hostConfig = {
  now: Date.now,
  supportsMutation: true,
  createInstance: (type, newProps, rootContainerInstance) => {},
  createTextInstance: text => {},
  appendInitialChild: (parent, child) => {},
  appendChild(parent, child) {},
  removeChild(parentInstance, child) {},
}
```

我们可以通过方法的命名来大概得知每个方法是用来处理什么工作。
[完整的方法列表可以在这里查看](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/forks/ReactFiberHostConfig.custom.js)。
如果想要知道更多关于React Renderer的知识, [这里有一篇很好的博客推荐阅读](https://medium.com/@agent_hunt/hello-world-custom-react-renderer-9a95b7cd04bc)。

# 总结

现在，让我们总结一下React一次更新时都发生了什么：

1. 对目标组件触发更新。（可能来源于初次渲染，props或state更新之类的情况。）
2. 像函数一样调用组件。 (对于类组件，调用的是`render`方法。)
3. 生成一颗元素树。
4. 通过Reconciliation算法计算出具体要更新什么内容。
5. 调用渲染器提供的方法来执行更新。

如果一个组件每次渲染时都有高额的开销。
你也许需要类似于[React.memo](https://reactjs.org/docs/react-api.html#reactmemo)来避免不必要的计算。
至少现在我们确切的知道了为什么我们需要它以及其它诸如`React.useMemo`或是`React.useCallback`的方法,
也知道了为什么有时候将函数放在React hooks的依赖列表里会引起无限执行。

如果这篇博客有所帮助，
我强烈推荐您阅读Dan Abramov的很棒的博客"[将React作为UI运行时](https://overreacted.io/zh-hans/react-as-a-ui-runtime/)"。
