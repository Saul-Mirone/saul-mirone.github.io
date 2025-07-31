---
title: How to Design a Type Friendly Context
date: "2021-08-03T12:29:40.790Z"
description: IoC is the key.
---

In the world of JavaScript, [Koa](https://koajs.com/) is a milestone.
Although [sinatra](http://sinatrarb.com/) is born before it,
Koa makes it really popular that apps should built by a simple core to load plugins,
and bundles of plugins to implement unique features.
Today lots of apps are built with this pattern.
For example, [vscode](https://code.visualstudio.com/) and [webpack](https://webpack.js.org/).

# Context in JavaScript

In the world of Koa, `ctx` is a magic box :crystal_ball:.
Users can get all sorts of properties on it.
For example, you can get `ctx.session` if you install the **koa-session** plugin.
And you can get `ctx.request.body` if you install the **koa-body** plugin.

A typical Koa plugin (also known as middleware) will be like:

```javascript
app.use(async (ctx, next) => {
  // inject props into ctx
  ctx.foo = "bar"

  const startTime = Date.now()

  await next()

  // do something after other ctx done.
  const endTime = Date.now()
  const duration = endTime - startTime

  console.log("Ctx duration:", duration)
})
```

# Static Type Checking

Everything seems perfect until static type system join the game,
which is bring in by [TypeScript](https://www.typescriptlang.org/) and [Flow](https://flow.org/).
With the safe type checking and powerful editor [lsp](https://microsoft.github.io/language-server-protocol/) features,
people use them to build not only large systems, but also small apps and tools.

But when Koa meets static type checking, :boom: everything stop working.
Type system cannot infer what property is really on `ctx` and what's not.
For example, if I call `ctx.foo`, how do I know wether the plugin inject the `foo` property is loaded in current Koa app or not?
What's more, users can't get the hint of the editor because the type system don't know what to suggest.

It's a common problem of languages with static type system:
how to handle object shared between modules elegantly?

---

# Design

The key is using [IoC](https://en.wikipedia.org/wiki/Inversion_of_control).
With this pattern we can _inject type information into context_.

Let's reconsider the design of context in koa,
we can see that the context is an object with properties you can modify, such as `ctx.foo`.
What if we transform this API into `ctx.get(foo)`?
Since the creation of foo is what we can control, we can write some information on it.

So, let's assume the API of context is designed as this:

```typescript
const ctx = createCtx()

const numberSlice = createSlice(0)

// inject a ctx.
ctx.inject(numberSlice)

const number = ctx.get(numberSlice) // -> 0

// set value of numberSlice to 1.
ctx.set(numberSlice, number + 1)
```

I introduced you a new data structure: `slice`.
With this design, We just _split up_ the entire `ctx` into several pieces of `slice`s.

Now we can get define the structure of `ctx` and `slice`:

```typescript
type Ctx = Map<symbol, Slice>

type Slice<T = unknown> = {
  id: symbol
  set: (value: T) => void
  get: () => T
}
```

# Slice

Then, let's try to implement the slice:

```typescript
type Metadata<T> = {
  id: symbol
  (ctx: Ctx): Slice<T>
}

const createSlice = <T>(defaultValue: T): Metadata<T> => {
  const id = Symbol("Slice")

  const metadata = (ctx: Ctx) => {
    let inner = defaultValue
    const slice: Slice<T> = {
      id,
      set: next => {
        inner = next
      },
      get: () => inner,
    }
    ctx.set(id, slice as Slice)
    return slice
  }
  metadata.id = id

  return metadata
}
```

We create a `metadata` that brings slice's information on it.
And a slice factory that can be used to inject on context.

# Ctx

The implementation of ctx will be much simpler:

```typescript
const createCtx = () => {
  const map: Ctx = new Map()

  const getSlice = <T>(metadata: Metadata<T>): Slice<T> => {
    const value = map.get(metadata.id)
    if (!value) {
      throw new Error("Slice not injected")
    }
    return value as Slice<T>
  }

  return {
    inject: <T>(metadata: Metadata<T>) => metadata(map),
    get: <T>(metadata: Metadata<T>): T => getSlice(metadata).get(),
    set: <T>(metadata: Metadata<T>, value: T): void => {
      getSlice(metadata).set(value)
    },
  }
}
```

We use a simple [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) as the container of slices, with the `symbol` as key so the slices will not be conflict between each other.

# Testing

Now our context has been done, let's do some test:

```typescript
const num = createSlice(0)
const ctx1 = createCtx()
const ctx2 = createCtx()

ctx1.inject(num)
ctx2.inject(num)

const x = ctx1.get(num) // editor will know x is number
ctx1.set(num, x + 1)

// this line will have an error since num slice only accept number
ctx.set(num, "string")

ctx1.get(num) // => 1
ctx2.get(num) // => still 0
```

Now we have built a type friendly context using IoC,
with slices that can be shared between context,
but values will be isolated.

---

# Full Code

```typescript
type Ctx = Map<symbol, Slice>

type Slice<T = unknown> = {
  id: symbol
  set: (value: T) => void
  get: () => T
}

type Metadata<T> = {
  id: symbol
  (ctx: Ctx): Slice<T>
}

const createSlice = <T>(defaultValue: T): Metadata<T> => {
  const id = Symbol("Slice")

  const metadata = (ctx: Ctx) => {
    let inner = defaultValue
    const slice: Slice<T> = {
      id,
      set: next => {
        inner = next
      },
      get: () => inner,
    }
    ctx.set(id, slice as Slice)
    return slice
  }
  metadata.id = id

  return metadata
}

const createCtx = () => {
  const map: Ctx = new Map()

  const getSlice = <T>(metadata: Metadata<T>): Slice<T> => {
    const value = map.get(metadata.id)
    if (!value) {
      throw new Error("Slice not injected")
    }
    return value as Slice<T>
  }

  return {
    inject: <T>(metadata: Metadata<T>) => metadata(map),
    get: <T>(metadata: Metadata<T>): T => getSlice(metadata).get(),
    set: <T>(metadata: Metadata<T>, value: T): void => {
      getSlice(metadata).set(value)
    },
  }
}
```

Testing:

```typescript
const num = createSlice(0)
const ctx1 = createCtx()
const ctx2 = createCtx()

ctx1.inject(num)
ctx2.inject(num)

const values = []

const x = ctx1.get(num)
values.push(x)

ctx1.set(num, x + 1)

values.push(ctx1.get(num))
values.push(ctx2.get(num))

expect(values).toEqual([0, 1, 0])
```
