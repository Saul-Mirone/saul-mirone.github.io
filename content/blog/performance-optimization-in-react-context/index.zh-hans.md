---
title: React Context中的性能优化
date: "2020-04-28T09:14:55.568Z"
description: 为什么有时React Context让你的应用变慢？
---

许多人将React Context用作某种内置的redux。
Jack就是其中之一,
他将所有全局状态合并到一个大的对象中，得到一个'单一数据源'，并把它塞进provider。
然后他找到子组件，调用`useContext`并挑选需要的属性。
所有事情看起来都很完美，直到有一天，他发现他的应用慢到难以使用。

# 一个糟糕的例子

考虑以下代码，它也许是React context的最糟实践了。

```jsx
const Ctx = React.createContext();

const SideMenu = () => {
  const { setHideSideMenu, hideSideMenu } = useContext(Ctx);
  return (
    <aside>
      <Menu hide={hideSideMenu} />
      <button onClick={() => setHideSideMenu(x => !x)}>toggle</button>
    </aside>
  );
};

const UserDashBoard = () => {
  const { user, setUser } = useContext(Ctx);
  React.useEffect(() => {
    fetchUser().then((data) => setUser(data.user));
  }, []);
  
  return <User username={user} />
};


const App = () => {
  const [user, setUser] = React.useState('');
  const [hideSideMenu, setHideSideMenu] = React.useState(false);
  const [clock, setClock] = React.useState(Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setClock(Date.now())
    }, 1000)
    return () => {
      clearInterval(interval);
    }
  }, []);
  
  return (
    <Ctx.Provider value={{
      user,
      setUser,
      hideSideMenu,
      setHideSideMenu,
    }}>
      <Clock time={clock} />
      <SideMenu />
      <UserDashBoard />
    </Ctx.Provider>
  );
}
```

# 让Context值的更新可控

这里的第一个问题是每一个context的consumer每秒都会收到一个更新通知。

`clock`状态会导致`App`组件的更新，使一个新的`Ctx.Provider`的值被创建。
(如果你无法理解这种行为，也许我的[前一篇博客](/zh-hans/the-essence-of-react-component)能够帮助到你。)

所以如果你需要将对象或数组当作context的值，
请使用类似`useMemo`或`useReducer`之类的方式来避免不必要的创建。

```jsx
const App = () => {
  const [user, setUser] = React.useState('');
  const [hideSideMenu, setHideSideMenu] = React.useState(false);

  const ctx = React.useMemo(() => ({
    user,
    setUser,
    hideSideMenu,
    setHideSideMenu,
  }), [user, hideSideMenu]);

  ...

  return <Ctx.Provider value={ctx}>...</Ctx.Provider>;
}
```

# 记住你的选择

子组件可能只使用context中的一部分值，
然而context的值是作为整体来更新的。
如果你的组建需要高额的成本来重渲染，
记住你选择的值可能是一个好的选择。

例如, 如果我们想记住`SideMenu`组件的选择,
我们有两个选项:

1. 将组件拆分为两个并对内部的组件调用`memo`。

```jsx
const SideMenuInner = React.memo(({ setHideSideMenu, hideSideMenu }) => {
  return (
    <aside>
      <Menu hide={hideSideMenu} />
      <button onClick={() => setHideSideMenu(x => !x)}>toggle</button>
    </aside>
  );
});

const SideMenu = () => {
  const { setHideSideMenu, hideSideMenu } = React.useContext(Ctx);
  return (
    <SideMenuInner
      setHideSideMenu={setHideSideMenu}
      hideSideMenu={hideSideMenu} />
  );
};
```

我们可以抽象出一个[HOC](https://reactjs.org/docs/higher-order-components.html)来做这件事:
```jsx
const ConsumeWithSelector = (Component, context, selector) => {
  const ctx = selector(React.useContext(context));
  return React.memo(props => <Component {{ ...props, ...ctx }} />);
}
```

2. 在组件中使用`useMemo`方法。

```jsx
const SideMenu = () => {
  const { setHideSideMenu, hideSideMenu } = useContext(Ctx);
  return React.useMemo(() => (
    <aside>
      <Menu hide={hideSideMenu} />
      <button onClick={() => setHideSideMenu(x => !x)}>toggle</button>
    </aside>
  ), [hideSideMenu, setHideSideMenu]);
};
```

# 拆分Context

当使用context时我们不应该尝试去构建类似"单一数据树"之类的东西，
它将让应用非常难以优化。
对于大多数场景，context可以按职责拆分成多个。

例如，在之前的例子中，我们可以把context拆分成
`HideSideMenuCtx`和`UserCtx`,
甚至拆分成`HideSideMenuState`, `HideSideMenuSetter`, `UserState`和`UserSetter`。

```jsx
const App = () => {
  const [user, setUser] = React.useState('');

  ...

  return (
    <UserState.Provider value={user}>
      <UserSetter.Provider value={setUser}>
        ...
      </UserSetter.Provider>
    </UserState.Provider>
  );
}
```

然而，拆分得太碎可能反而导致应用难以维护。
在这之中没有银弹。
我们应该根据自己的场景来做出取舍。
然而，我们至少需要能够预期不同的策略将有怎样的表现。
