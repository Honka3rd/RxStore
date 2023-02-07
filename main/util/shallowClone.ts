export const shallowClone = <T>(input: T) => {
  if (!input) {
    return input;
  }

  if (typeof input !== "object") {
    return input;
  }

  if (input instanceof Date) {
    return new Date(input) as T;
  }

  if (input instanceof RegExp) {
    return new RegExp(input) as T;
  }

  if (input instanceof Set) {
    return new Set(input) as T;
  }

  if (input instanceof Map) {
    return new Map(input) as T;
  }

  const ownKeys = Object.getOwnPropertyNames(input) as Array<keyof T>;
  const copied = Object.create(
    Object.getPrototypeOf(input),
    Object.getOwnPropertyDescriptors(input)
  );
  ownKeys.forEach((k: keyof T) => {
    copied[k] = input[k];
  });
  return copied as T;
};
