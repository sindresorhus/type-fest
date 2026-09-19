import type {Overloads} from './overloads.d.ts';

/**
Extract the return types of all overloads as a union.

This is the overload-aware counterpart to the built-in `ReturnType` utility type, which only extracts from the last overload.

@example
```
import type {OverloadReturnType} from 'type-fest';

declare function request(url: string): Promise<string>;
declare function request(url: string, options: {json: true}): Promise<unknown>;

type AllReturnTypes = OverloadReturnType<typeof request>;
//=> Promise<string> | Promise<unknown>
```

Known limitations are the same as {@link Overloads}.

@category Function
*/
export type OverloadReturnType<FunctionType extends (...args: any) => any> = ReturnType<Overloads<FunctionType>[number]>;

export {};
