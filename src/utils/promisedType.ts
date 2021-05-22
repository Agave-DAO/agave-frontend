export type PromisedType<T> = T extends PromiseLike<infer P> ? P : never;
