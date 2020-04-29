---
title: Performance Optimization in React Context
date: "2020-04-28T09:14:55.568Z"
description: Why React context sometimes make your app slow?
---

A lot of people use React context as some kinds of build-in redux.
Jack is one of them.
Jack combined all global state to get a big object to get a 'single source of data' and put it into a provider.
Then he went to a child component, call `useContext` and pick properties from the context.
Everything seems worked fine until one day he found the app is too slow to use.

# A Bad Example

Consider the following code, it may be the worst practice of React context.

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

# Control the Update of Context Value

The first problem here is that
the context's consumer will be notified with a new value every second.

The `clock` state will cause an update of the `App` component,
make a new value of `Ctx.Provider` will be created.
(If you don't understand this, maybe my [previous post](/the-essence-of-react-component) can help you).

So if you need to use an object or array as the value of context,
use `useMemo` or `useReducer` to avoid unnecessary creations.

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

# Memo Your Selector

Child components maybe only use some part of the value of the context.
However, the value has always been updated as a whole.
If it is high cost for your component to rerender,
memorize your selector of the value is a good choice.

For example, if we want to memo selector of `SideMenu` component,
we have two options:

1. Split the component into two and `memo` the inner component.

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

We can abstract a [HOC](https://reactjs.org/docs/higher-order-components.html) to do this:
```jsx
const ConsumeWithSelector = (Component, context, selector) => {
  const ctx = selector(React.useContext(context));
  return React.memo(props => <Component {{ ...props, ...ctx }} />);
}
```

2. Use the `useMemo` method in your component.

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

# Split Context

When using context in React we should not try to build a 'single store tree'.
It really makes the app hard to optimise.
For most cases, contexts can be split into different pieces by their duties.

For example, in our case, we may split the context into
`HideSideMenuCtx` and `UserCtx`,
or even `HideSideMenuState`, `HideSideMenuSetter`, `UserState` and `UserSetter`.

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

However, split contexts into too many pieces may make our app hard to maintain.
There is no silver bullet in this.
We should make our choice depending on our situation.
However, at least we need to know the expected behavior according to the strategies we choose.
