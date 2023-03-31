# RxStore Core

An Rxjs based Type-safe state management tool
(JavaScript Environment Independent)

## install

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
  getDataSource, // get a RxJS Observable object, you can add any midwares into its pipe function
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
const unboserve = observe("complex", (r) => {
  console.log(r);
});

setTimeout(unboserve, 5000); // stop observe after about 5 seconds
```

example 2 (React):

```javascript
const [complex, setComplex] = useState(getDefault("complex"));

useEffect(() => {
  const unboserve = observe("complex", (c) => {
    setComplex(c);
  });
  return unboserve; // stop observe on unmount
}, []);
```

example 3 (observe multiple and all):

```javascript
const unboserveMultiple = observeMultiple(
  ["height", "complex"],
  ({ height, complex }) => {
    console.log(height, complex);
  }
);

const unboserveAll = observeAll(({ height, complex }) => {
  console.log(height, complex);
});

setTimeout(() => {
  unboserveMultiple();
  unboserveAll();
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
    if(!prevState.complex) {
      return { complex: { uid:"114514", name:"1g1g1g1g" } } // the mutation will be observed
    }
    return prevState; // nochange will be observed
  })
}, 5000);
```

**_Create a dispatch function for stored data_**

example:

```javascript
const { observe, createDispatch } = NRS({
  complex: () => ({
    uid: "",
    name: "",
  }),
  height: () => 0,
});

const dispatchHeight = createDispatch<"height", "clear" | "auto", number>({
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
clearHeightBtn?.addEventListener("click", changeHeight);

const output = document.querySelector<HTMLDivElement>("#height-output");
observe("height", (h) => {
   if(output) {
      output.style.height = `${h}px`; // dynamically change a height of a HTMLDivElement
    }
})
```

**_Create a asynchronous dispatch function for stored data_**

sometimes we might need a asynchronous process happened after dispatching data, we can return a Promise or Observable in defined Reducer

the second argument is a config object containing:

***Start?: () => void***
fire on start

***success?: (r: ReturnType<S[K]>) => void***
fire on start, carried with resolved value

***fail?: (error: unknown) => void***
fire on error

***errorFallback?: () => ReturnType<S[K]>***
a callback providing a value when error to update store, the store will not be updated if it is undefined

***always?: () => void***
fire on the Observable complete or Promise finalized

```javascript
const dispatchHeight = createAsyncDispatch<"height", "clear" | "auto", number>({
  key: "height",
  reducer: (h, action) => {
    if (action.type === "clear") {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(0);
        }, 1000);
      });
    }

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
// optional second argument
);
// we can observe "height" like usual
```

**_Clone and compare_**
sometimes we need some special clone or/and compare function
we can define them in the factory function

clone function is for achieveing immutability
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
// shoud not equal given a specific deepclone function
console.log(g1[0] === getClonedState("groups")[0]);

setTimeout(() => {
  setState({ complex: { ...getDefault("complex") } });
}, 1000);
setTimeout(() => {
  setState({ complex: { ...getDefault("complex") } });
}, 2000);

// only log one time, even the "complex" object changed, because the compare criterion is the "complex.id, see the compare function defination"
observe("complex", console.log);
```

**_Observable computation_**

sometimes we want a reduced or mapped value from our defined data in store

example
```javascript
const { withComputation } = NRS({
  height: () => 0,
});

const compute = withComputation({
  keys: ["height"],
  computation: ({ height }) => {
    return height * 2;
  },
});

const unobserve = compute.observe((h) => {
  console.log(h);
  // shoud log 84 after 1 second
});

setTimeout(() => {
  setState({ height: 42 });
}, 1000);

setTimeout(unobserve, 2000);
```

**_Observable asynchronous computation_**

sometimes the computation might not immediately computed, we can return an Observable object instead.

example
```javascript
import { map, timer } from "rxjs";

const compute = withAsyncComputation({
  keys: ["height"],
  computation: ({ height }) => {
    return timer(1000).pipe(map(() => height * 2));
  },
});

compute.observe((h) => {
  console.log(h);
  // shoud log 84 after 1 second
});

setState({ height: 42 });
```
**_Schedule and fire on create_**

schedule mode: sync or async, default to async, if set to async, only the last value of current call stack can be observed

fire on create: the default can be observed if set to true

example:
```javascript
const { withComputation } = NRS({
  height: () => 0,
}, 
  {
    config: {
      schedule: "async", // you can call setState many times in a sync way, but only last mutation can be observed, normally useful on production, but keeping it "sync" is good for development debugging
      fireOnCreate: false,// the default value cannot be observed
    },
  }
);
```

## Use a Immutable Reactive Store (IRS):

Only [Immutable data structure](https://immutable-js.com/) or Premitive data type accepted by IRS

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