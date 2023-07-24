# RxStore Core

A Rxjs based Type-safe state management tool
(JavaScript Environment Independent)

## Install

npm install rx-store-core

## Use a Normal Reactive Store (NRS):

**Import**

```javascript
import { NRS } from "rx-store-core";
```

**Overview**

```javascript
const {
  setState, // the only way to trigger data change
  observe, // observe single data
  observeAll, // observe all stored data
  observeMultiple, // observe multiple data changes
  withComputation, // create a observable computation form stored data
  createDispatch, // create a dispatch function with a Reducer, to handle complex Reactive data management
  getState, // get a non-reactive data, it is mutable, please try to avoid to use this
  getClonedState, // get a cloned non-reactive data, by default, it is shallow cloned, you can define a custom clone function when create a NRS
  getDataSource, // get a RxJS Observable object, you can add any mid wares into its pipe function
  getImmutableState, // try to parse a normal JS object into a Immutable object
  getStateAll, // get a mutable object containing all stored data, avoid to use it
  getStates, // get multiple stored non-reactive data, avoid to use it
  reset, // reset a stored data to its default value
  resetMultiple, // reset multiple stored data to its default value
  resetAll, // reset all stored data to its default value
  getDefault, // get default value of a non-reactive data
  getDefaultAll, // get all default values of all non-reactive data
  getDefaults, // get multiple default values of multiple non-reactive data
} = NRS({
  height: () => 0, // this is a data default value factory
  id: () => "",
  complex: () => ({
    uid: "",
    name: "",
  }),
  keys: (): string[] => [], // you can define function return type to achieve type safety when we observe it
  groups: (): Array<{ num: 0, score: 0, alias: "" }> => [],
});
```

**_Define stored data_**

example:

```javascript
const { observe, observeMultiple, observeAll, getDefault } = NRS({
  complex: () => ({
    uid: "",
    name: "",
  }),
  height: () => 0,
});
```

**_Observe stored data_**

example 1:

```javascript
const unObserve = observe("complex", (r) => {
  console.log(r);
});

setTimeout(unObserve, 5000); // stop observe after about 5 seconds
```

example 2 (React):

```javascript
const [complex, setComplex] = useState(getDefault("complex"));

useEffect(() => {
  const unObserve = observe("complex", (c) => {
    setComplex(c);
  });
  return unObserve; // stop observe on unmount
}, []);
```

example 3 (observe multiple and all):

```javascript
const unObserveMultiple = observeMultiple(
  ["height", "complex"],
  ({ height, complex }) => {
    console.log(height, complex);
  }
);

const unObserveAll = observeAll(({ height, complex }) => {
  console.log(height, complex);
});

setTimeout(() => {
  unObserveMultiple();
  unObserveAll();
}, 5000);
```

**_Only way to change stored data_**

You can pass a function or a Object into setState function as argument

example:

```javascript
const { setState } = NRS({
  complex: () => ({
    uid: "",
    name: "",
  }),
  height: () => 0,
});

setTimeout(() => {
  setState({ height: 42 }); // "height" wil be observed after 5 seconds
  setState((prevState) => {
    if (!prevState.complex) {
      return { complex: { uid: "114514", name: "1g1g1g1g" } }; // the mutation will be observed
    }
    return prevState; // no change will be observed
  });
}, 5000);
```

**_Create a dispatch function for stored data_**
createDispatch
sometimes we might need to manage complex state by a reducer

arguments: [key, reducer]

key is the state name defined in store

reducer is the similar function with React userReducer parameter, first arg is previous value, second arg is the action contains type and an optional payload*

the type of this payload is the same as related state marked with "key(first argument)" defined inside store

return a dispatch function, we can use this dispatch function to emit actions

example:

```javascript
const { observe, createDispatch } = NRS({
  complex: () => ({
    uid: "",
    name: "",
  }),
  height: () => 0,
});

const dispatchHeight = createDispatch<"height", "clear" | "auto">({
    key: "height", // the name of defined data
    reducer: (h, action) => {
        if(action.type === "clear") {
            return 0;
        }

        if(action.type === "auto") {
            return action.payload
        }
        return h;
    }
})

const changeHeight = () => {
    dispatchHeight({
        type:"auto", // type is required
        payload: Math.floor(Math.random() * 10)
    })
}

const clearHeight = () => {
    dispatchHeight({
        type: "clear",
        // payload is optional
    })
}

const setHeightBtn = document.querySelector<HTMLButtonElement>("#height-setter");
setHeightBtn?.addEventListener("click", changeHeight);

const clearHeightBtn = document.querySelector<HTMLButtonElement>("#height-clear");
clearHeightBtn?.addEventListener("click", clearHeight);

const output = document.querySelector<HTMLDivElement>("#height-output");
observe("height", (h) => {
   if(output) {
      output.style.height = `${h}px`; // dynamically change a height of a HTMLDivElement
    }
})
```

**_Create a asynchronous dispatch function for stored data_**
createAsyncDispatch:
sometimes we might need a asynchronous process happened after dispatching data, we can return a Promise or Observable in defined Reducer

arguments: [key, reducer, config]

key is the state name defined in store

reducer is the similar function with React userReducer parameter, first arg is previous value, second arg is the action contains type and an optional payload*

the type of this payload is the same as related state marked with "key(first argument)" defined inside store

the third argument is a config object containing:
a boolean parameter "lazy", if  it is true, reducer will not be invoked until previous async process is not pending.

And Functions:

| Function      | Argument         | Return           | Required     | Description                                                                                               |
| ------------- | ---------------- | ---------------- |------------- | --------------------------------------------------------------------------------------------------------- |
| start         | N/A              | void             | No           | fire on start      |                                                                                            
| success       | ReturnType<S[K]> | void             | No           | fire on success, carried with resolved value |
| fail          | unknown          | void             | No           | fire on error, carried with an error |
| fallback      | N/A              | ReturnType<S[K]> | No           | a callback providing a value when error to update store, the store will not be updated if it is undefined |
| always        | N/A              | void             | No           | fire on the Observable complete or Promise finalized |

return a constant array [dispatch, observe]

we can dispatch actions mixed with a config object (mentioned above third parameter)

observe returns a destructor, start to listen the dispatch activity until we call the destructor
***you do not need to try catch the async dispatch function, as the error has been captured inside, use the second argument to handle error***

```javascript
const [dispatchHeight, observeHeightReducer] = createAsyncDispatch<"height", "clear" | "auto">({
  key: "height",
  reducer: (h, action) => {
    if (action.type === "clear") {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 1000);
      });
    }
  // action.payload is a number
    if (action.type === "auto") {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(action.payload);
        }, 1000);
      });
    }
    return Promise.resolve(h);
  },
},
// optional third argument
);
// we can observe "height" like usual
observe("height", console.log)

// need to start observe the dispatch activity and use reducer as the observer

const unObserve = observeHeightReducer();

// call unObserve when we are not caring the dispatch activity

dispatchHeight(
  {
    type:"auto",
    payload: 100,
    fail: (err) => console.error(err)
  }
)
// dispatch an action with config, the config will overwrite the third argument only in current dispatch activity
```

**_Clone and compare_**
sometimes we need some special clone or/and compare function
we can define them in the factory function

clone function is for achieving immutability
compare function is for reducing unnecessary observation

example

```javascript
import { clone, cloneDeep } from "lodash";
const { getState, setState } = NRS(
  {
    complex: () => ({
      uid: "",
      name: "",
    }),
    height: () => 0,
    groups: (): Array<{ num: number, score: number, alias: string }> => [
      {
        num: 42,
        score: 0,
        alias: "none",
      },
    ],
  },
  // second argument is optional and all properties are optional
  {
    comparator: (var1, var2) => var1 === var2, // set default comparator,
    comparatorMap: { complex: (c1, c2) => c1.uid === c2.uid }, // set specified comparator for "complex"
    cloneFunction: clone, // use Lodash provided shallow clone
    cloneFunctionMap: {
      groups: cloneDeep, // use Lodash provided deep clone just for "group"
    },
  }
);

const c1 = getState("complex");
// should not equal, memory location different
console.log(c1 === getClonedState("complex"));

const g1 = getState("groups");
// should equal with a default clone function, inner objects are not cloned
// should not equal given a specific deep clone function
console.log(g1[0] === getClonedState("groups")[0]);

setTimeout(() => {
  setState({ complex: { ...getDefault("complex") } });
}, 1000);
setTimeout(() => {
  setState({ complex: { ...getDefault("complex") } });
}, 2000);

// only log one time, even the "complex" object changed, because the compare criterion is the "complex.id, see the compare function definition"
observe("complex", console.log);
```

**_Observable computation_**

sometimes we want a computed value from our defined data in store

example

```javascript
const { withComputation } = NRS({
  height: () => 0,
});

const compute = withComputation({
  computation: ({ height }) => {
    return height * 2;
  },
});

const unObserve = compute.observe((h) => {
  console.log(h);
  // should log 84 after 1 second
});

setTimeout(() => {
  setState({ height: 42 });
}, 1000);

setTimeout(unObserve, 2000);
```

**_Observable asynchronous computation_**

sometimes the computation might not immediately computed, we can return an Observable object instead.

the argument of "withAsyncComputation" is a configurable object containing

and functions below:

| Function      | Argument         | Return           | Required     | Description                                                                                               |
| ------------- | ---------------- | ---------------- |------------- | --------------------------------------------------------------------------------------------------------- |
| onStart         | { [K in keyof S]: ReturnType<S[K]> }             | void             | No           | fire on start      |                                                                                            
| onError       | any | void             | No           | fire on error, carried with an error |
| onSuccess          | result: R          | void             | No           | fire on success, carried with a resolved computed result|
| onComplete | N/A              | void | No           | fire on the async computation stream complete |
| comparator        | N/A              | void             | No           | customer comparator to compare upstream values (keys related values), to determine whether should the computation function get called |

example

```javascript
import { map, timer } from "rxjs";

const { withAsyncComputation } = NRS({
  height: () => 0,
});

const compute = withAsyncComputation({
  computation: ({ height }) => {
    return timer(1000).pipe(map(() => height * 2));
  },
  // ...optional functions below
});

compute.observe((h) => {
  console.log(h);
  // should log 84 after 1 second
}, onPending // optional, fire on start async process
);

setState({ height: 42 });

// you can also get a value and state by calling get
// "state" is a enum including: PENDING, ERROR and FULFILLED
console.log(compute.get())
// should log { state: PENDING, value: 0 }

setTimeout(() => {
  console.log(compute.get())
  // should log { state: FULFILLED, value: 84 }
}, 1500)
```

**_Schedule and fire on create_**

schedule mode: sync or async, default to async, if set to async, only the last value of current call stack can be observed

fire on create: the default can be observed if set to true

example:

```javascript
NRS(
  {
    height: () => 0,
  },
  {
    config: {
      schedule: "async", // you can call setState many times in a sync way, but only last mutation can be observed, normally useful on production, but keeping it "sync" is good for development debugging
      fireOnCreate: false, // the default value cannot be observed
    },
  }
);
```

**_Define your own Mid-wares_**

"getDataSource" method returns a RxJS Observable, which gives you a independent data stream pipeline.

we can add some Mid-wares to achieve certain effects.

example: Report some data change to a server.

```javascript
import {
  map,
  exhaustMap,
  ajax,
  catchError,
  of,
  distinctUntilChange,
  AjaxResponse,
  AjaxError,
} from "rxjs";
const { getDataSource } = NRS({
  complex: () => ({
    uid: "",
    name: "",
  }),
});
getDataSource()
  .pipe(
    map(({ complex }) => complex.uid),
    distinctUntilChange(), // do not trigger a request if uid not change
    exhaustMap((uid) =>
      ajax({
        // wait until previous request finish, ignore incoming uid during previous requesting
        method: "POST",
        url: "some.url.example",
      }).pipe(
        catchError((err: AjaxError) => of(err)) // catch the request error to keep the data stream alive
      )
    )
  )
  .subscribe((r: AjaxError | AjaxResponse<any>) => {
    // perform some tasks if needed
  });
```

## Use a Immutable Reactive Store (IRS):

Only [Immutable data structure](https://immutable-js.com/) or Primitive data type accepted by IRS

Immutable follows Deep-copy-on-write pattern and has its own equals method to compare, so we do not need to provide clone and compare function

example:

```javascript
import { Map as IMap, List } from "immutable";

const { getStates, getStateAll } = IRS({
  height: () => 0,
  complex: () =>
    IMap(
      new Map([
        ["uid", "" as string],
        ["name", "" as string],
      ] as const)
    ),
  groups: () => List<IMap<"score" | "age", string | number>>([]),
});
// the usage is the same as NRS
// IRS has no methods: getClonedState and getImmutableState
// comparator and comparatorMap, cloneFunction and cloneFunctionMap are no longer be configured, since they are pointless
// fireOnCreate and schedule are still configurable
// getStates and getStateAll returns a Immutable Map rather than a JS object

```

## Common utility functions

some handy functions used in rx-store-core library get exported for common usage or develop related plugins

```javascript
import { shallowClone, shallowCompare, bound, isPrimitive, isObject } from "rx-store-core";  
```

| Function      | Argument         | Return           | Description                                                                                            |
| ------------- | ---------------- | ---------------- |------------------------------------------------------------------------------------------------------- |
| shallowClone  | any              | any              | a function for shallow cloning majority JS data structure       |                                                                                            
| shallowCompare| any, any         | boolean          | a function for shallow compare by each key of object                                                   |
| bound         | Function, ClassMethodDecoratorContext          | void             | a Typescript Method level Decorator for binding class method to instance |
| isPrimitive   | any              | boolean          | a function to judge a value is a primitive type or not                                                 |
| isObject      | any              | boolean          | a function to judge a value is a reference type or not                                                 |