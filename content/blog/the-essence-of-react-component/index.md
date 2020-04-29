---
title: The Essence of React Component
date: "2020-04-24T06:18:19.632Z"
description: Render forever.
---

Maybe you have used React for a long time:
using the elegant jsx with React hooks to create pages built up with components. 
However, why do we only need to write declarative components to let React manage itself?
Furthermore, what are these components we write every day?

# Just Functions

Consider the following code implementing a simple clock, guess what will be printed in the chrome devtools.

```javascript
const Text = () =>  {
  console.log('Text');
  return <p>Just text.</p>;
};

const App = () => {
  const [clock, setClock] = React.useState(new Date().toISOString());
  console.log('App');

  React.useEffect(() => {
     const interval = setInterval(
       () => setClock(new Date().toISOString()),
       1000
     );
     return () => clearInterval(interval);
  }, []);
  
  return (
    <>
      <div>clock: {clock}</div>
      <Text />
    </>
  );
};
```

The fact is that it will print `App` and `Text` together every second.

React components are just functions. If you have experience in TypeScript with React project,
you may have met a useful type annotation: `React.FC`, which is just an acronym for `FunctionComponent`.
The definition of it is something like: 

```typescript
type FC<P> = (props: P) => ReactElement
```

It means that **a React function component is a function receives `props` as an argument and returns a React element**.

JSX is just a kind of syntax sugar. In fact, it will be compiled into function calls:

```javascript
const Something = () => {
  return (
    <p>
      foo
      <span>bar</span>
    </p>
  )
}
// turn into
const Something = () => {
  return React.createElement('p', null,
    'foo',
    React.createElement('span', null, 'bar')
  )
}
```

During the creation of a React element,
it will create its child elements recursively,
generating an element tree in the end.

So the render of a component is the same as a function call.
That's why we get `App` and `Text` every second in the previous sample.
The state's update of the component trigger the rerender of that component, which cause the function called. 

# Elements For Render

Elements are just a kind of data structure. You can regard them as objects.
For example: 

```javascript
// <p className='hello'>Hello</p> 
// -> turn into
const element = {
  type: 'p',
  key: null,
  props: { className: 'hello' },
  children: ['Hello']
}
```

With the information like `type`, `key`, `props`, `children` on it,
Renderers can easily transform the data structure into what it wants.
For example, ReactDOM transforms elements into dom elements
and React Native transforms elements into native widgets.
You can even create a renderer which just prints them on your screen
and then you get a 'printer renderer'.

When an update occurs, a new element will be generated, like this:

```javascript
// we have a update
// <p className='hello'>updated</p> 
// -> turn into
const element = {
  type: 'p',
  key: null,
  props: { className: 'hello' },
  children: ['updated']
}
```

# Render What

There is no magic in React to make sure elements generated between updates are the same as those generated previously.
**For every render, there is a new element tree.**

It's possible to create dom elements every time for every render.
However, that's a highly costly processing.
In fact, React use the [reconciliation](https://reactjs.org/docs/reconciliation.html) to
know what to do exactly: regenerating the dom element or just updating some contents.

As a renderer of React,
it just needs to implement an interface for [Reconciler](https://github.com/facebook/react/tree/master/packages/react-reconciler),
then Reconciler will update using the methods we provide.
I can use the following pseudo code to describe the relationship between ReactDOM and Reconciler:

```javascript
ReactDOMRenderer = Reconciler(ReactDOMHostConfig)
```

The `ReactDOMHostConfig` is exactly the interface I mentioned above.
It's something like this:

```javascript
export const hostConfig = {
  now: Date.now,
  supportsMutation: true,
  createInstance: (type, newProps, rootContainerInstance) => {},
  createTextInstance: text => {},
  appendInitialChild: (parent, child) => {},
  appendChild(parent, child) {},
  removeChild(parentInstance, child) {}
};
```

We could probably know what each method should deal with by the method name.
[The full list of methods is here](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/forks/ReactFiberHostConfig.custom.js).
For further information, [here is a good post to read](https://medium.com/@agent_hunt/hello-world-custom-react-renderer-9a95b7cd04bc). 

# In Closing

Now, let's conclude what happens during a React update:

1. Trigger an update for the target component. (It can be the first render, props or state update, and so on.)
2. Call components as functions. (Or render method of class components.)
3. Generate an element tree.
4. Find what to update by Reconciliation .
5. Call methods provided by react renderer to commit the update.

If components have a high cost every render,
You may need to use something like [React.memo](https://reactjs.org/docs/react-api.html#reactmemo) to avoid unnecessary calculation.
At least for now we know exactly why we need this and other things like `React.useMemo` or `React.useCallback`,
and why functions in React hook's dependency lists can cause infinite execution.

If this post is really helpful to you,
I highly recommend you to read Dan Abramov's great post "[React as a UI Runtime](https://overreacted.io/react-as-a-ui-runtime/)".
