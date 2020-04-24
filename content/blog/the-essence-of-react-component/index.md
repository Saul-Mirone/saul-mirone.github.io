---
title: The Essence of React Component
date: "2020-04-24T06:18:19.632Z"
description: Render forever.
---

Maybe you have used React for a long time:
using the elegant jsx with React hooks and creating pages built up with components. 
However, why do we only need to write declarative components to let React manage itself?
Furthermore, what are these components we write every day?

# Just Functions

Consider the following code for a simple clock, guess what will be printed in the chrome devtools.

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

The fact is that every second, it will print `App` and `Text` together.

React components are just functions. If you have experience with typescript in React project,
you might meet a useful type: `React.FC`, which is just an acronym for `FunctionComponent`.
The definition of it is something like: 

```typescript
type FC<P> = (props: P) => ReactElement
```

It means that **a React function component is a function, receiving props as arguments, returns a React element**.

JSX is just a kind of syntax sugar. In fact, it will be compiled into some function call:

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

During the creation of the React element,
it will create its child elements recursively,
generate an element tree in the end.

So every time we render a component,
it's just a function call.
That's why we get `App` and `Text` every second in the previous sample.

# Element For Render

Element is just a data structure. You can imagine them into json.
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
For example ReactDOM transform elements into dom element,
React native transform elements into native ui widgets.
You can even just print them on your screen then you will get a 'printer renderer'.

Then when update occurs, a new element will be generated, like this:

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

There is no magic in react to make sure elements generated after update are the same as generated previously.
**For every render, there will be a new element tree.**

It's possible to create dom element every time for every render.
However, that's a highly cost processing.
In fact, React use the [reconciliation](https://reactjs.org/docs/reconciliation.html) to
know what to do exactly: regenerate the dom element, or just update some content.
For every renderer of React,

it just needs to implement an interface for [Reconciler](https://github.com/facebook/react/tree/master/packages/react-reconciler),
then Reconciler will do the update job using the methods we provide.
I will use following pseudo code to describe the relationship of ReactDOM and Reconciler:

```javascript
ReactDOMRenderer = Reconciler(ReactDOMHostConfig)
```

The `ReactDOMHostConfig` is exactly the interface I mentioned above. It's something like this:

```javascript
export const hostConfig = {
  now: Date.now,
  supportsMutation: true,
  createInstance: (type, newProps, rootContainerInstance, _currentHostContext, workInProgress) => {},
  createTextInstance: text => {},
  appendInitialChild: (parent, child) => {},
  appendChild(parent, child) {},
  removeChild(parentInstance, child) {}
};
```

We could probably know what should each method deal with by the method name.
[The full list of methods here](https://github.com/facebook/react/blob/master/packages/react-reconciler/src/forks/ReactFiberHostConfig.custom.js).
For further information if you are interested in React renderer, [here is a good post to read](https://medium.com/@agent_hunt/hello-world-custom-react-renderer-9a95b7cd04bc). 

# In Closing

Now, let's conclude what happens during a React update:

1. Trigger an update for target component. (It can be the first commit, props or state update, and so on.)
2. Call components as function. (Or render method for class component.)
3. Generate element tree.
4. Reconciliation find what to update.
5. Call methods provided by react renderer to commit update.

If your components have a high cost for every render.
You may need to use something like [React.memo](https://reactjs.org/docs/react-api.html#reactmemo) to avoid unnecessary calculation.
At least for now you know why we need this and other things like `React.useMemo` or `React.useCallback`,
and why function in React hook's dependency list cause infinite execution.


If this post really helpful for you,I highly recommend you to read Dan's great post "[React as a UI Runtime](https://overreacted.io/react-as-a-ui-runtime/)".
