---
title: A Complete Guide to TypeScript Decorators
date: "2020-09-07T17:44:55.568Z"
description: Decorators make your code leaner.
---

Decorators make the world of TypeScript better.
People use lots of libraries built based on this awesome feature,
for example: [Angular](https://angular.io/) and [Nestjs](https://nestjs.com/).
In this blog I will explore decorators with many details.
I hope you can figure out when and how to use this powerful feature after read this blog.

# Overview

Decorators are just functions in a particular form which can apply to:

1. Class
2. Class Property
3. Class Method
4. Class Accessor
5. Class Method Parameter

So, applying decorators is a lot like composing a chain of functions,
pretty much like higher-order function or class.
With decorators, we can easily implement [proxy pattern](https://en.wikipedia.org/wiki/Proxy_pattern) to reduce our code and do some cool things.

The syntax of a decorator is pretty simple, just add the `@` operator before the decorator you want to use, then the decorator will be applied to the target:

```typescript
function simpleDecorator() {
  console.log("---hi I am a decorator---")
}

@simpleDecorator
class A {}
```

There are five types of decorators we can use:

1. Class Decorators
2. Property Decorators
3. Method Decorators
4. Accessor Decorators
5. Parameter Decorators

Here's a quick example class that includes all five decorator types:

```typescript
@classDecorator
class Bird {
  @propertyDecorator
  name: string

  @methodDecorator
  fly(
    @parameterDecorator
    meters: number,
  ) {}

  @accessorDecorator
  get egg() {}
}
```

# Evaluation

## Timing

Decorators execute only once, when a class definition is first evaluated at runtime. For example:

```typescript
function f(C) {
  console.log("apply decorator")
  return C
}

@f
class A {}

// output: apply decorator
```

This code will log `'apply decorator'`, even though we never initialized a `new` instance of the class `A`.

## Order of Evaluation

The evaluation order of different types of decorators is well-defined:

1. Parameter Decorators, followed by Method, Accessor, or Property Decorators are applied for each instance member.
2. Parameter Decorators, followed by Method, Accessor, or Property Decorators are applied for each static member.
3. Parameter Decorators are applied for the constructor.
4. Class Decorators are applied for the class.

For example, consider the following code:

```typescript
function f(key: string): any {
  console.log("evaluate: ", key)
  return function () {
    console.log("call: ", key)
  }
}

@f("Class Decorator")
class C {
  @f("Static Property")
  static prop?: number

  @f("Static Method")
  static method(@f("Static Method Parameter") foo) {}

  constructor(@f("Constructor Parameter") foo) {}

  @f("Instance Method")
  method(@f("Instance Method Parameter") foo) {}

  @f("Instance Property")
  prop?: number
}
```

The code above will print the following messages:

```bash
evaluate:  Instance Method
evaluate:  Instance Method Parameter
call:  Instance Method Parameter
call:  Instance Method
evaluate:  Instance Property
call:  Instance Property
evaluate:  Static Property
call:  Static Property
evaluate:  Static Method
evaluate:  Static Method Parameter
call:  Static Method Parameter
call:  Static Method
evaluate:  Class Decorator
evaluate:  Constructor Parameter
call:  Constructor Parameter
call:  Class Decorator
```

You may notice that the evaluation of the instance property is later than the instance method,
however the evaluation of the static property is earlier than the static method.
This is because the evaluation order of property/accessor/method decorators
is dependant on their order of appearance in code.

However,
the order of evaluation for different parameters within the same method or constructor is the opposite.
Here, the last parameter decorator will be called first:

```typescript
function f(key: string): any {
  console.log("evaluate: ", key)
  return function () {
    console.log("call: ", key)
  }
}

class C {
  method(@f("Parameter Foo") foo, @f("Parameter Bar") bar) {}
}
```

The code above will print the following messages:

```bash
evaluate:  Parameter Foo
evaluate:  Parameter Bar
call:  Parameter Bar
call:  Parameter Foo
```

## Composition of Multiple Decorators

You can apply multiple decorators to a single target. The evaluation order of the decorators composed is:

1. Outer Decorator Evaluate
2. Inner Decorator Evaluate
3. Inner Decorator Call
4. Outer Decorator Call

For example:

```typescript
function f(key: string) {
  console.log("evaluate: ", key)
  return function () {
    console.log("call: ", key)
  }
}

class C {
  @f("Outer Method")
  @f("Inner Method")
  method() {}
}
```

The code above will print the following messages:

```bash
evaluate: Outer Method
evaluate: Inner Method
call: Inner Method
call: Outer Method
```

# Definition

## Class Decorators

Type annotation:

```typescript
type ClassDecorator = <TFunction extends Function>(
  target: TFunction,
) => TFunction | void
```

- @Params:
  1. `target`: The constructor of the class.
- @Returns:  
  If the class decorator returns a value, it will replace the class declaration.

Thus, it's suitable for extending an existing class with some properties or methods.

For example, we can add a `toString` method for all
the classes to overwrite the original `toString` method.

```typescript
type Consturctor = { new (...args: any[]): any }

function toString<T extends Consturctor>(BaseClass: T) {
  return class extends BaseClass {
    toString() {
      return JSON.stringify(this)
    }
  }
}

@toString
class C {
  public foo = "foo"
  public num = 24
}

console.log(new C().toString())
// -> {"foo":"foo","num":24}
```

It is a pity that we cannot define type-safe decorators, which means:

```typescript
declare function Blah<T>(target: T): T & { foo: number }

@Blah
class Foo {
  bar() {
    return this.foo // Property 'foo' does not exist on type 'Foo'
  }
}

new Foo().foo // Property 'foo' does not exist on type 'Foo'
```

This is [a well-known issue](https://github.com/microsoft/TypeScript/issues/4881) in Typescript.
What we can do for now is to provide a class with type information to be extended by the target class:

```typescript
declare function Blah<T>(target: T): T & { foo: number }

class Base {
  foo: number
}

@Blah
class Foo extends Base {
  bar() {
    return this.foo
  }
}

new Foo().foo
```

## Property Decorators

Type annotation:

```typescript
type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void
```

- @Params:
  1. `target`: Either the constructor function of the class for a static member,
     or the prototype of the class for an instance member.
  2. `propertyKey`: The name of the property.
- @Returns:  
  The return value will be ignored.

Except being used to collect information,
property decorators can also be used to add some methods or properties to the class.
For example, we can write a decorator to add the ability to listen changes on some properties.

```typescript
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function observable(target: any, key: string): any {
  // prop -> onPropChange
  const targetKey = "on" + capitalizeFirstLetter(key) + "Change"

  target[targetKey] = function (fn: (prev: any, next: any) => void) {
    let prev = this[key]
    Reflect.defineProperty(this, key, {
      set(next) {
        fn(prev, next)
        prev = next
      },
    })
  }
}

class C {
  @observable
  foo = -1

  @observable
  bar = "bar"
}

const c = new C()

c.onFooChange((prev, next) => console.log(`prev: ${prev}, next: ${next}`))
c.onBarChange((prev, next) => console.log(`prev: ${prev}, next: ${next}`))

c.foo = 100 // -> prev: -1, next: 100
c.foo = -3.14 // -> prev: 100, next: -3.14
c.bar = "baz" // -> prev: bar, next: baz
c.bar = "sing" // -> prev: baz, next: sing
```

## Method Decorators

Type annotation:

```typescript
type MethodDecorator = <T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>,
) => TypedPropertyDescriptor<T> | void
```

- @Params:
  1. `target`: Either the constructor function of the class for a static member,
     or the prototype of the class for an instance member.
  2. `propertyKey`: The name of the property.
  3. `descriptor`: The property [descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) for the member;
- @Returns:  
  If returns a value, it will be used as the descriptor of the member.

What makes method decorators different from property decorators is the `descriptor` parameter,
which lets us override the original implementation and inject some common logic.
For example, we can add logger for some method to log out the input and output:

```typescript
function logger(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const original = descriptor.value

  descriptor.value = function (...args) {
    console.log("params: ", ...args)
    const result = original.call(this, ...args)
    console.log("result: ", result)
    return result
  }
}

class C {
  @logger
  add(x: number, y: number) {
    return x + y
  }
}

const c = new C()
c.add(1, 2)
// -> params: 1, 2
// -> result: 3
```

## Accessor Decorators

Accessor decorators are generally the same as method decorators. The only differences are the keys in the descriptor:

The `descriptor` in a **method** decorator has keys:

- `value`
- `writable`
- `enumerable`
- `configurable`

The `descriptor` in an **accessor** decorator has keys:

- `get`
- `set`
- `enumerable`
- `configurable`

For example, we can make the property immutable by a decorator:

```typescript
function immutable(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const original = descriptor.set

  descriptor.set = function (value: any) {
    return original.call(this, { ...value })
  }
}

class C {
  private _point = { x: 0, y: 0 }

  @immutable
  set point(value: { x: number; y: number }) {
    this._point = value
  }

  get point() {
    return this._point
  }
}

const c = new C()
const point = { x: 1, y: 1 }
c.point = point

console.log(c.point === point)
// -> false
```

## Parameter Decorators

Type annotation:

```typescript
type ParameterDecorator = (
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number,
) => void
```

- @Params:
  1. `target`: Either the constructor function of the class for a static member,
     or the prototype of the class for an instance member.
  2. `propertyKey`: The name of the property (Name of the method, not the parameter).
  3. `parameterIndex`: The ordinal index of the parameter in the function’s parameter list.
- @Returns:  
  The return value will be ignored.

A standalone parameter decorator can't do much.
It's typically used to record information which can be used by other decorators.

# Combination

For some complex cases,
we may need to use different types of decorators together.
For instance,
if we wanted to add both a static type checker
and a run-time type checker for our api.

There are 3 steps to implement the feature:

1. Mark the parameters that need to be validated
   (since the parameter decorators evaluate before the method decorators).
2. Change the value of descriptor of the method,
   run the parameter validators before the method, throw error if failed.
3. Run the original method.

Here is the code:

```typescript
type Validator = (x: any) => boolean

// save the marks
const validateMap: Record<string, Validator[]> = {}

// 1. mark the parameters need to be validated
function typedDecoratorFactory(validator: Validator): ParameterDecorator {
  return (_, key, index) => {
    const target = validateMap[key as string] ?? []
    target[index] = validator
    validateMap[key as string] = target
  }
}

function validate(_: Object, key: string, descriptor: PropertyDescriptor) {
  const originalFn = descriptor.value
  descriptor.value = function (...args: any[]) {
    // 2. run the validators
    const validatorList = validateMap[key]
    if (validatorList) {
      args.forEach((arg, index) => {
        const validator = validatorList[index]

        if (!validator) return

        const result = validator(arg)

        if (!result) {
          throw new Error(`Failed for parameter: ${arg} of the index: ${index}`)
        }
      })
    }

    // 3. run the original method
    return originalFn.call(this, ...args)
  }
}

const isInt = typedDecoratorFactory(x => Number.isInteger(x))
const isString = typedDecoratorFactory(x => typeof x === "string")

class C {
  @validate
  sayRepeat(@isString word: string, @isInt x: number) {
    return Array(x).fill(word).join("")
  }
}

const c = new C()
c.sayRepeat("hello", 2) // pass
c.sayRepeat("", "lol" as any) // throw an error
```

As this case shows,
it is important for us to understand not only the evaluation order,
but also the duty of different types of decorators.

# Metadata

Strictly speaking, metadata and decorators are two separate parts of ECMAScript.
However, if you want to play with something like [reflection](<https://en.wikipedia.org/wiki/Reflection_(computer_programming)>),
you always need both of them.

Just look at our previous example. what if we don't want to write different types of validators?
Is it possible to just write one validator which can **infer** the validators from the type annotation of the method?

With the help of [reflect-metadata](https://github.com/rbuckton/reflect-metadata),
we can get the design-time types.

```typescript
import "reflect-metadata"

function validate(target: Object, key: string, descriptor: PropertyDescriptor) {
  const originalFn = descriptor.value

  // get the design type of the parameters
  const designParamTypes = Reflect.getMetadata("design:paramtypes", target, key)

  descriptor.value = function (...args: any[]) {
    args.forEach((arg, index) => {
      const paramType = designParamTypes[index]

      const result = arg.constructor === paramType || arg instanceof paramType

      if (!result) {
        throw new Error(
          `Failed for validating parameter: ${arg} of the index: ${index}`,
        )
      }
    })

    return originalFn.call(this, ...args)
  }
}

class C {
  @validate
  sayRepeat(word: string, x: number) {
    return Array(x).fill(word).join("")
  }
}

const c = new C()
c.sayRepeat("hello", 2) // pass
c.sayRepeat("", "lol" as any) // throw an error
```

For now, there are three types of design-time annotations we can get:

- `design:type`: type of property.
- `design:paramtypes`: type of parameters of method.
- `design:returntype`: type of return type of method.

Results of this three types are constructor functions (such as `String` and `Number`).
The rule is:

- number -> `Number`
- string -> `String`
- boolean -> `Boolean`
- void/null/never -> `undefined`
- Array/Tuple -> `Array`
- Class -> The constructor function of the class
- Enum -> `Number` when pure number enum, or `Object`
- Function -> `Function`
- Rest is `Object`

# When to Use?

Now we can make a conclusion of when to use decorators,
you may have felt about this when reading the code above.

I would like to list some use cases:

- Before/After hooks.
- Watch property changes and method calls.
- Transform parameters.
- Add extra methods or properties.
- Runtime type validation.
- Auto serialization and deserialization.
- Dependency Injection.

I hope that you can figure out more cases
and use decorators to simplify code after read this blog.
