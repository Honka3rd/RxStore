export declare function bound<This, Args extends any[], Return>(target: (this: This, ...args: Args) => Return, context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>): void;
