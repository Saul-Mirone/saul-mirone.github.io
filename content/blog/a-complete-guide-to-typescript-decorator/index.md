---
title: A Complete Guide to TypeScript Decorator
date: "2020-09-07T17:44:55.568Z"
description: Decorators make your code leaner.
---

Decorators make the world of TypeScript better.
People use lots of libraries built based on this awesome feature,
for example: [Angular](https://angular.io/) and [Nestjs](https://nestjs.com/).
In this blog I would explore decorators with many details.
I hope you can figure out when and how to use this powerful feature after read this blog.

# Overview

Decorators are just functions in a particular form which can apply to:
1. Class
2. Class Property
3. Class Method
4. Class Accessor
5. Class Method Parameter

So, applying decorators is pretty like composing a chain of functions, pretty much like higher-order function or class. With decorators, we can easily implement [proxy pattern](https://en.wikipedia.org/wiki/Proxy_pattern) to reduce our code and do some cool things.

The syntax of decorator is pretty simple, just add the `@` operator before the decorator you want to use, then the decorator will be applied to the target:

```typescript
function simpleDecorator() {
  console.log('---hi I am a decorator---')
}

@simpleDecorator
class A {}
```

There are 5 types of decorators we can use:

1. Class Decorators
2. Property Decorators
3. Method Decorators
4. Accessor Decorators
5. Parameter Decorators

We can take a quick overview for all the 5 decorators:

```typescript
@classDecorator
class Bird {
  @propertyDecorator
	public name: string;
	
	@methodDecorator
	public fly(
	  @parameterDecorator
		meters: number
	) {}
	
	@accessorDecorator
	public get egg() {}
}
```



# Evaluation

## Timing
Decorators evaluate only one time when apply. For example:

```typescript
function f(C) {
  console.log('apply decorator')
  return C
}

@f
class A {}

// output: apply decorator
```

This code will log `apply decorator` in terminal, even though we didn't use the class A.

## Order of Evaluation
The composition order of different types of decorators is well-defined:

1. Instance Member:  
Parameter Decorators -> Method / Accessor / Property Decorators
2. Static Member:  
Parameter Decorators -> Method / Accessor / Property Decorators
3. Constructor: Parameter Decorators
4. Class Decorators

For example, consider the following code:

``` typescript
function f(key: string) {
  console.log(key);
  return function () {};
}

@f("Class Decorator")
class C {
  @f("Static Property")
  static prop?: number;

  @f("Static Method")
  static method(@f("Static Method Parameter") foo) {}

  constructor(@f("Constructor Parameter") foo) {}

  @f("Instance Method")
  method(@f("Instance Method Parameter") foo) {}

  @f("Instance Property")
  prop?: number;
}
```

The code above will print the following messages:

```bash
Instance Method
Instance Method Parameter
Instance Property
Static Property
Static Method
Static Method Parameter
Class Decorator
Constructor Parameter
```

You may notice that the evaluation of instance property is later than the instance method,
however the evaluation of static property is earlier than the static method.
This is because the evaluation order of property/accessor/method decorators
is depends on their order of appearance in code.
What's more, we can infer the order of evaluation for different parameters within the same method or constructor:

```typescript
function f(key: string) {
  console.log(key);
  return function () {};
}

class C {
  method(
    @f("Parameter Foo") foo,
    @f("Parameter Bar") bar
  ) {}
}
```

The code above will print the following messages:

```bash
Parameter Foo
Parameter Bar
```

## Composition of Multiple Decorators

You can apply multiple decorators to a single target. The order of the decorators composed is:

1. Outer Decorator Evaluate
2. Inner Decorator Evaluate
3. Inner Decorator Call
4. Outer Decorator Call

For example:

```typescript
function f(key: string) {
  console.log(`${key}: evaluated`);
  return function () {
    console.log(`${key}: called`);
  };
}

class C {
  @f("Outer Method")
  @f("Inner Method")
  method() {}
}
```

The code above will print the following messages:

```bash
Outer Method: evaluated
Inner Method: evaluated
Inner Method: called
Outer Method: called
```

# Basic

## Class Decorators

Type annotation:
```typescript
type ClassDecorator = <TFunction extends Function>
  (target: TFunction) => TFunction | void;
```

* @Params:
  1. `target`: The constructor of the class.
* @Returns:  
  If the class decorator returns a value, it will replace the class declaration.
  
Thus, it's suitable to extend an existing class with some properties or methods.

For example, we can add a `toString` method for all
the classes to overwrite the original `toString` method.

```typescript
type Consturctor = { new (...args: any[]): any };

function toString<T extends Consturctor>(BaseClass: T) {
  return class extends BaseClass {
    toString() {
      return JSON.stringify(this);
    }
  };
}

@toString
class C {
  public foo = "foo";
  public num = 24;
}

console.log(new C().toString())
// -> {"foo":"foo","num":24}
```

It is a pity that we cannot define type-safe decorators, which means:

```typescript
declare function Blah<T>(target: T): T & {foo: number}

@Blah
class Foo {
  bar() {
    return this.foo; // Property 'foo' does not exist on type 'Foo'
  }
}

new Foo().foo; // Property 'foo' does not exist on type 'Foo'
```

This is [a well-known issue](https://github.com/microsoft/TypeScript/issues/4881) in typescript.
What we can do for now is to provide a class to be extended by the target class:

```typescript
declare function Blah<T>(target: T): T & {foo: number}

class Base {
  foo: number;
}

@Blah
class Foo extends Base {
  bar() {
    return this.foo;
  }
}

new Foo().foo;
```

## Property Decorators

Type annotation:
```typescript
type PropertyDecorator =
  (target: Object, propertyKey: string | symbol) => void;
```

* @Params:
  1. `target`: Either the constructor function of the class for a static member,
  or the prototype of the class for an instance member.
  2. `propertyKey`: The name of the property.
* @Returns:  
  The return value will be ignored.

Except being used to collect information,
property decorators can also be used to add some methods or property to the class.
For example, we can write a decorator to add the ability to listen changes on some properties.

```typescript
function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function observable(target: any, key: string): any {
  // prop -> onPropChange
  const targetKey = "on" + capitalizeFirstLetter(key) + "Change";

  target[targetKey] =
    function (fn: (prev: any, next: any) => void) {
      let prev = this[key];
      Reflect.defineProperty(this, key, {
        set(next) {
          fn(prev, next);
          prev = next;
        }
      })
    };
}

type Observe<T> = {
  [K in keyof T as `on${capitalize (K & string)}Change`]:
    (fn: (prev: T[K], next: T[K]) => void) => void;
};

function observeFactory<T>(): { new(): Observe<T> } {
  return (class {}) as { new(): Observe<T> };
}

class C extends observeFactory<{ foo: number; bar: string }>() {
  @observable
  foo = -1;

  @observable
  bar = "bar";
}

const c = new C();

c.onFooChange((prev, next) => console.log(`prev: ${prev}, next: ${next}`))
c.onBarChange((prev, next) => console.log(`prev: ${prev}, next: ${next}`))

c.foo = 100; // -> prev: -1, next: 100
c.foo = -3.14; // -> prev: 100, next: -3.14
c.bar = "baz"; // -> prev: bar, next: baz
c.bar = "sing"; // -> prev: baz, next: sing
```
## Method Decorators

Type annotation:
```typescript
type MethodDecorator = <T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;
```

* @Params:
  1. `target`: Either the constructor function of the class for a static member,
  or the prototype of the class for an instance member.
  2. `propertyKey`: The name of the property.
  3. `descriptor`: The property [descriptor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) for the member;
* @Returns:  
  If returns a value, it will be used as the descriptor of the member.

What makes method decorators different from property decorators is the `descriptor` parameter.
By which can `hack` the original implementation and inject some common logic.
For example, we can add logger for some method to log out the input and output:

```typescript
function logger(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;

  descriptor.value = function (...args) {
    console.log('params: ', ...args);
    const result = original.call(this, ...args);
    console.log('result: ', result);
    return result;
  }
}

class C {
  @logger
  add(x: number, y:number ) {
    return x + y;
  }
}

const c = new C();
c.add(1, 2);
// -> params: 1, 2
// -> result: 3
```

## Accessor Decorators

Accessor decorators are generally the same as method decorators, the only difference are the keys in the descriptor:

Descriptor in a method decorator has keys:

* `value`
* `writable`
* `enumerable`
* `configurable`

Descriptor in an accessor decorator has keys:

* `get`
* `set`
* `enumerable`
* `configurable`

# Combination

For some complex cases, we may need to use different types of decorators together.
Imagine we want to implement a series of decorators to help us to write http services in nodejs.
