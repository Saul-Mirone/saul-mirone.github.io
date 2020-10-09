---
title: A Complete Guide to TypeScript Decorator
date: "2020-09-07T17:44:55.568Z"
description: Decorators make your code leaner.
---

Decorators make the world of TypeScript better. People use lots of libraries built based on this awesome feature, for example: [Angular](https://angular.io/) and [Nestjs](https://nestjs.com/). In this blog I would explore decorators with much details. I hope you can figure out when and how to use this powerful feature after read this blog.

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

1. Instance Member: Parameter Decorators -> Method / Accessor / Property Decorators
2. Static Member: Parameter Decorators -> Method / Accessor / Property Decorators
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

# Arguments

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
