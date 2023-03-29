# RxStore
An Rxjs based Type-safe state management tool
(JavaScript Environment Independent)

## install
npm install rx-store-core

## Use a Normal Reactive Store (NRS):
**import**
```javascript
import { NRS } from "rx-store-core"; 
```

**overview**
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
  getDefaults // get multiple default values of multiple non-reactive data
} = NRS({
  height: () => 0, // this is a data default value factory
  id: () => "",
  complex: () => ({
    uid: "",
    name: "",
  }),
  keys: (): string[] => [], // you can define function return type to achieve type safety when we observe it
  groups: (): Array<{ num: 0; score: 0; alias: "" }> => [],
});
```

**Observe data change:**
***Define stored data***
```javascript
const { observe, observeMultiple, observeAll, getDefault } = NRS({
  complex: () => ({
    uid: "",
    name: "",
  }),
  height: () => 0,
});
```

***Observe stored data***

example 1:
```javascript
const unboserve = observe("complex", (r) => {
    console.log(r);
});

setTimeout(unboserve, 5000) // stop observe after about 5 seconds
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
const unboserveMultiple =  observeMultiple(["height", "complex"], ({ height, complex }) => {
      console.log(height, complex);
});

const unboserveAll =  observeAll(({ height, complex }) => {
      console.log(height, complex);
});

setTimeout(() => {
  unboserveMultiple();
  unboserveAll();
}, 5000) 

```

***create a dispatch function for stored data***

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
        type:"auto",
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
