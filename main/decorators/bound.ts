export function bound<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<
    This,
    (this: This, ...args: Args) => Return
  >
) {
  const methodName = context.name;
  if (context.private) {
    throw new Error(
      `'bound' cannot decorate private properties like ${methodName as string}.`
    );
  }
  context.addInitializer(function () {
    const self = this as object;
    const toBeBound = Reflect.get(self, methodName) as Function;
    Reflect.set(self, methodName, toBeBound.bind(self));
  });
}
