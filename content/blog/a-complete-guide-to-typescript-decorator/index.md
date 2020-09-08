---
title: A Complete Guide to TypeScript Decorator
date: "2020-09-07T17:44:55.568Z"
description: Decorators make your code leaner.
---

Decorators make the world of TypeScript better. People use lots of libraries built based on this awesome feature, for example: [Angular](https://angular.io/) and [nestjs](https://nestjs.com/). In this blog I would explore decorators with much details. I hope you can figure out when and how to use this powerful feature after read this blog.

# Overview

Decorators are just functions in a particular form which can apply to:
1. Class
2. Class Property
3. Class Method
4. Class Accessor
5. Class Method Parameter

So, applying decorators is pretty like composing a chain of functions, pretty much like higher-order function or class. With decorator, we can easily implement [proxy pattern](https://en.wikipedia.org/wiki/Proxy_pattern) to reduce our code and do some cool things.

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

Decorators evaluate only one time when apply. For example:

```typescript
function f() {
  return C => {
    console.log('apply decorator')
    return C
  }
}

@f()
class A {}

// output: apply decorator
```

This code will log `apply decorator` in terminal, even though we didn't call the class A.

