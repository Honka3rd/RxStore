# RxStore
An Rxjs based Type-safe state management tool
(JavaScript Environment Independent)

## Use a Normal Reactive Store (NRS):
**import**
```javascript
import { NRS } from "rx-store-core"; 
```

**overview**
```javascript
const {
  setState, // trigger data change
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
