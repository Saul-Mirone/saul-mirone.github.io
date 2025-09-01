---
title: "use Effect with Jotai and React"
date: "2025-09-01T07:11:33.988Z"
description: "Exploring the use of Effect with Jotai in a React application."
lang: en
---

[Effect](https://effect.website/) brings a powerful way to manage side effects in TypeScript.
However, there are not many resources available on how to effectively use it in a React application.
I recently explored this topic and found that combining Effect TS with [Jotai](https://jotai.org/) can lead to a clean and efficient state management solution.

In this article I'll try to use Effect TS to implement a simple theme feature in React, to introduce how I approached the integration.

# Theme in Effect

First, let's define a simple theme service in Effect:

```ts
import { Context, Effect, Layer, Ref } from 'effect';

type Theme = 'dark' | 'light';

export class ThemeService extends Context.Tag('ThemeService')<
  ThemeService,
  {
    readonly getTheme: Effect.Effect<Theme>;
    readonly toggleTheme: Effect.Effect<void>;
    readonly setTheme: (theme: Theme) => Effect.Effect<void>;
  }
>() {}
```

And we also introduce a simple implementation for it:

```ts
export const ThemeServiceLayer: Layer.Layer<ThemeService, never, never> = Layer.effect(
  ThemeService,
  Effect.gen(function*() {
    const themeRef = yield* Ref.make<Theme>('light');

    const getTheme = Ref.get(themeRef);

    const toggleTheme = Effect.gen(function*() {
      const currentTheme = yield* getTheme;
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      yield* Ref.set(themeRef, newTheme);
    });

    const setTheme = (theme: Theme) => Ref.set(themeRef, theme);

    return {
      getTheme,
      toggleTheme,
      setTheme,
    };
  }),
);

// Define a pair of effects to interact with the service
export const getTheme = ThemeService.pipe(Effect.flatMap((_) => _.getTheme));
export const toggleTheme = ThemeService.pipe(Effect.flatMap((_) => _.toggleTheme));
export const setTheme = (theme: Theme) => 
  ThemeService.pipe(Effect.flatMap((_) => _.setTheme(theme)));
```

Here, we define a `ThemeService` with methods to get and toggle the theme.
And we also define a pair of effects to interact with the service.

---

# Why Jotai

Since theme should be accessible through the whole app. We want to setup a Effect runtime to align the context between the different components.

Wishful thinking, the Effect runtime will automatically provide the necessary context to all components that need it.

For example:

```tsx
const MyComponent = () => {
  const runtime = useRuntime();
  const [theme, setThemeState] = React.useState<Theme>("light");

  React.useEffect(() => {
    runtime.runPromise(getTheme).then(setThemeState);
  }, [runtime]);

  const set = React.useCallback((t: Theme) => {
    runtime.runPromise(setTheme(t)).then(() => setThemeState(t));
  }, [runtime]);

  const toggle = React.useCallback(() => {
    runtime.runPromise(toggleTheme).then(setThemeState);
  }, [runtime]);

  return (
    <Button onClick={toggle}>
      Toggle Theme: {theme}
    </Button>
  );
};
```

You may notice that we bind the `Ref` value from effect to the component state manually. This can be really annoying if the effect is widely used across the whole app. Here's where we introduce Jotai:

```ts
import { atom } from 'jotai';
import { ManagedRuntime } from 'effect';

const runtimeAtom = atom(() => {
  // We'll create the runtime later
});

const getThemeAtom = atom(async (get) => {
  const runtime = get(runtimeAtom);
  const theme = await runtime.runPromise(getTheme);
  return theme;
});

const toggleThemeAtom = atom(null, async (get) => {
  const runtime = get(runtimeAtom);

  await runtime.runPromise(toggleTheme);
});

// Of course we can combine the setter and getter
const themeAtom = atom(
  async (get) => {
    const runtime = get(runtimeAtom);
    const theme = await runtime.runPromise(getTheme);
    return theme;
  },
  async (get) => {
    const runtime = get(runtimeAtom);
    await runtime.runPromise(toggleTheme);
  }
);
```

Then, we can use it in React like:

```tsx
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

const MyComponent = () => {
  // Use themeAtom
  const [theme, toggleTheme] = useAtom(themeAtom);
  // Or use getter and setter
  const theme = useAtomValue(themeAtom);
  const toggleTheme = useSetAtom(themeAtom);

  return (
    <Button onClick={toggleTheme}>
      Toggle Theme: {theme}
    </Button>
  );
};
```

Jotai can help us to avoid introduce a manual binding between the effect and the component state. Instead, we can rely on the atom to manage the state for us, making the code cleaner and more maintainable.

---

# App Runtime

Now, it's time to setup the app runtime to provide the necessary context to all components.
It should be a top-level runtime and build only once for the whole app.
In this case, `ManagedRuntime` is the best choice for our needs.
And luckily, it integrates well with Jotai.

```ts
import { ManagedRuntime } from 'effect';
import { atom } from 'jotai';
import { observe } from 'jotai/utils';

export const _runtimeAtom =
  atom<ManagedRuntime.ManagedRuntime<ThemeService, never>>();

export const runtimeAtom = atom((get) => {
  const value = get(_runtimeAtom);
  if (!value) {
    throw new Error('runtime is not initialized');
  }
  return value;
});

export const registerEffect = () => {
  const unobserveRuntime = observe((_get, set) => {
    const runtime = ManagedRuntime.make(ThemeServiceLayer);

    set(_runtimeAtom, runtime);

    return () => {
      runtime.dispose();
    };
  });

  return () => {
    unobserveRuntime();
  };
};
```

And all we need to do is register the effect in `App.tsx` in react:

```tsx
registerEffect();

function App() {
  // app implementation
}
```

It's also possible to merge multiple service layers into a single runtime. We can call it `AppLayer`:

```ts
export const AppLayer = Layer.mergeAll(
  ThemeServiceLayer,
  I18nServiceLayer,
  ToastServiceLayer,
  ...
);

export type AppEnv = Layer.Layer.Success<typeof AppLayer>
```

---

# Reactive Pitfalls

However, the theme atom won't work as expected! If you click the toggle theme button, nothing happens. Why?

In fact, the value of the `Ref` in effect is changed, but it doesn't trigger the Jotai atom update.
This is because Jotai uses reactive primitives to manage state, and the effect is not directly tied to the atom's state.

As a workaround, we need to introduce an `updater` atom to trigger the update manually.

```ts
const _updaterAtom = atom(0);

export const themeAtom = atom(
  async (get) => {
    get(_updaterAtom);
    const runtime = get(runtimeAtom);
    const theme = await runtime.runPromise(getTheme);
    return theme;
  },
  async (get, set) => {
    set(_updaterAtom, (x) => x + 1);
    const runtime = get(runtimeAtom);
    await runtime.runPromise(toggleTheme);
  }
);
```

Now, the button works as expected! When you click the button, it will toggle the theme correctly.

---

# Building a Effect-Jotai Bridge

There is a lot of boilerplate code when using effects with Jotai.
To simplify this process, we can create a bridge between effects and Jotai atoms.

```ts
import { Effect } from 'effect';
import { atom, WritableAtom, Atom, Setter } from 'jotai';

class EffectScope {
  static refreshTriggers = new Map<symbol, WritableAtom<number, [number | ((prev: number) => number)], void>>();
  private readonly _scopeSymbol: symbol;
  private readonly _debugName: string;

  private _getRefreshTrigger() {
    if (!EffectScope.refreshTriggers.has(this._scopeSymbol)) {
      EffectScope.refreshTriggers.set(this._scopeSymbol, atom(0));
    }
    return EffectScope.refreshTriggers.get(this._scopeSymbol)!;
  }

  private _triggerScopeRefresh(set: Setter) {
    const refreshTrigger = this._getRefreshTrigger();
    set(refreshTrigger, (prev) => prev + 1);
  }

  constructor(debugName: string) {
    this._scopeSymbol = Symbol(`EffectScope(${debugName})`);
    this._debugName = debugName;
  }
}
```

First, we'll add a `atom` method. The method takes an effect that returns a value and a fallback value.
This `atom` means a getter for the effect's result.

```ts
class EffectScope {
  atom<T>(
    effectGetter: Effect.Effect<T, never, AppEnv>,
    fallback: T,
  ): Atom<Promise<T>> {
    return atom(async (get) => {
      // Subscribe to this scope's refresh trigger for optimized reactivity
      const triggerAtom = this._getRefreshTrigger();
      get(triggerAtom);

      // Get the Effect runtime from Jotai store
      const runtime = get(runtimeAtom);
      if (!runtime) {
        console.error(`Runtime not found for scope: ${this._debugName}`);
        return fallback;
      }

      try {
        // Execute the Effect asynchronously and return the result
        return await runtime.runPromise(effectGetter);
      } catch (error) {
        console.error(`Error running effect in scope ${this._debugName}:`, error);
        return fallback;
      }
    });
  }
}
```

With this `atom` method, we can easily define our `themeValueAtom`:

```ts
const themeScope = new EffectScope('theme');
const themeValueAtom = themeScope.atom(getTheme, 'light');
```

Next, let's define an `action` method, which is used to run effects and generate some updates:

```ts
class EffectScope {
  action(effectAction: Effect.Effect<void, never, AppEnv>): WritableAtom<null, [], void>;
  action<TArgs extends unknown[]>(effectActionFactory: (...args: TArgs) => Effect.Effect<void, never, AppEnv>): WritableAtom<null, TArgs, void>;

  // Implementation
  action<TArgs extends unknown[]>(
    effectActionOrFactory:
      | Effect.Effect<void, never, AppEnv>
      | ((...args: TArgs) => Effect.Effect<void, never, AppEnv>),
  ): WritableAtom<null, TArgs, void> | WritableAtom<null, [], void> {
    return atom(null, async (get, set, ...args: TArgs) => {
      // Get the Effect runtime from Jotai store
      const runtime = get(runtimeAtom);
      if (!runtime) {
        console.error(`Runtime not found for scope: ${this._debugName}`);
        return;
      }

      let effectAction: Effect.Effect<void, never, AppEnv>;

      // Check if it's a factory function or direct Effect
      if (typeof effectActionOrFactory === 'function') {
        // It's a factory function, call it with the provided arguments
        effectAction = effectActionOrFactory(...args);
      } else {
        // It's a direct Effect action
        effectAction = effectActionOrFactory;
      }

      await runtime.runPromise(effectAction);

      this._triggerScopeRefresh(set);
    });
  }
}
```

With this `action` method, we can easily define our `toggleThemeAtom`:

```ts
export const toggleThemeAtom = themeScope.action(toggleTheme);
```

This `action` method actually supports callback, so we can also define a `setThemeAtom`:

```ts
export const setThemeAtom = themeScope.action((newTheme: Theme) => setTheme(newTheme));
```

Now we have a clean and reusable way to integrate Effect with Jotai:

```tsx
import { useAtomValue, useSetAtom } from 'jotai';

const MyComponent = () => {
  const theme = useAtomValue(themeValueAtom);
  const toggleTheme = useSetAtom(toggleThemeAtom);
  const setTheme = useSetAtom(setThemeAtom);

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
    </div>
  );
};
```

---

# What's the Benefit?

Putting heavy business logic in the Effect layer keeps our components clean and focused on rendering. This separation allows for easier testing and maintenance of both the UI and business logic.

For example, if we want to add support for reading theme from local storage, we can just change the effect service. Our components won't need to know about the implementation details, making them more reusable and easier to work with.

First, let's define error types for our side effects:

```ts
import { Data } from 'effect';

class LocalStorageError extends Data.TaggedError('LocalStorageError')<{
  operation: 'read' | 'write';
  cause: unknown;
}> {}

class DOMError extends Data.TaggedError('DOMError')<{
  operation: string;
  cause: unknown;
}> {}
```

These tagged error types allow Effect to provide type-safe error handling and make it easy to catch specific error types.

Next, we'll create effects for localStorage operations:

```ts
export const readThemeFromStorage: Effect.Effect<string | null, LocalStorageError, never> = Effect.try({
  try: () => window.localStorage.getItem('theme'),
  catch: (cause) => new LocalStorageError({ operation: 'read', cause }),
});

export const saveThemeToStorage = (theme: Theme): Effect.Effect<void, LocalStorageError, never> =>
  Effect.try({
    try: () => window.localStorage.setItem('theme', theme),
    catch: (cause) => new LocalStorageError({ operation: 'write', cause }),
  });
```

The `Effect.try` function wraps potentially failing operations and converts exceptions into typed errors.

Now let's create an effect to read the initial theme with proper error handling:

```ts
const readInitialTheme: Effect.Effect<Theme, never, never> = Effect.gen(function*() {
  // Try to read from storage
  const themeResult = yield* readThemeFromStorage.pipe(
    Effect.catchTag('LocalStorageError', (error) => {
      console.warn('Failed to read theme from localStorage:', error.cause);
      return Effect.succeed(null);
    }),
  );

  // Validate and return theme
  if (typeof themeResult === 'string' && ['light', 'dark'].includes(themeResult)) {
    return themeResult as Theme;
  }

  return 'light';
});
```

This effect gracefully handles localStorage errors and validates the stored value, falling back to 'light' theme if anything goes wrong.

We'll also create a DOM manipulation effect:

```ts
export const applyThemeToDOM = (theme: Theme): Effect.Effect<void, DOMError, never> =>
  Effect.try({
    try: () => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    catch: (cause) => new DOMError({ operation: 'apply-theme-classes', cause }),
  });
```

Next, let's create a combined effect that handles both localStorage and DOM updates:

```ts
const writeTheme = (theme: Theme): Effect.Effect<void, never, never> =>
  Effect.gen(function*() {
    // Try to save to localStorage (non-blocking)
    yield* saveThemeToStorage(theme).pipe(
      Effect.catchTag('LocalStorageError', (error) => {
        console.warn('Failed to save theme to localStorage:', error.cause);
        return Effect.succeed(void 0);
      }),
    );

    // Try to apply to DOM (non-blocking)
    yield* applyThemeToDOM(theme).pipe(
      Effect.catchTag('DOMError', (error) => {
        console.warn('Failed to apply theme to DOM:', error.cause);
        return Effect.succeed(void 0);
      }),
    );
  });
```

This effect combines multiple side effects and handles their errors independently. If one fails, the other can still succeed.

Finally, let's update our ThemeServiceLayer to use these new effects:

```ts
export const ThemeServiceLayer: Layer.Layer<ThemeService, never, never> = Layer.effect(
  ThemeService,
  Effect.gen(function*() {
    const initial = yield* readInitialTheme;
    yield* writeTheme(initial);

    const themeRef = yield* Ref.make(initial);

    const getTheme = Ref.get(themeRef);
    const toggleTheme = Effect.gen(function*() {
      const currentTheme = yield* getTheme;
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      yield* writeTheme(newTheme);
      yield* Ref.set(themeRef, newTheme);
    });

    const setTheme = (theme: Theme) => Effect.gen(function*() {
      yield* writeTheme(theme);
      yield* Ref.set(themeRef, theme);
    });

    return {
      getTheme,
      toggleTheme,
      setTheme,
    };
  }),
);
```

Now our theme service automatically reads the initial theme from localStorage, applies it to the DOM, and persists any changes. All of this complexity is hidden from our React components, which can continue using the same simple Jotai atoms.

---

# Performance Considerations

When using Effect TS with Jotai in production applications, consider these performance optimizations:

1. **Fine-grained Atoms**: Split large state objects into smaller, focused atoms to minimize unnecessary re-renders.

2. **Runtime Lifecycle**: Create runtime instances once and reuse them across components rather than creating new ones.

3. **Selective Subscriptions**: Use Jotai's `qualityFn`, `prevSlice` or `selectAtom` from `jotai/utils` to subscribe only to specific parts of complex state.

4. **Batch Updates**: Leverage React's batching mechanisms to group multiple state updates together.

5. **Effect Composition**: Compose effects efficiently and avoid unnecessary Effect chains that could impact performance.

These optimizations become more important as your application scales and the number of atoms and effects grows.

---

# Conclusion

By combining Effect TS with Jotai, we can achieve a clean separation between business logic and UI state management. The `EffectScope` bridge reduces boilerplate code and provides a reactive interface that works seamlessly with React components.

This approach offers several benefits:

1. **Type Safety**: Effect TS provides excellent type safety for your business logic
2. **Separation of Concerns**: Business logic stays in Effect, UI state in Jotai
3. **Reactivity**: Jotai's reactive system ensures components update when needed
4. **Reusability**: The bridge pattern can be applied to any Effect-based service

The integration pattern shown here can be extended to other services like authentication, API calls, or any other side effects your application needs to manage.
