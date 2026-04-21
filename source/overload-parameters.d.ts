import type {Overloads} from './overloads.d.ts';

/**
Extract the parameter types of all overloads as a union.

This is the overload-aware counterpart to the built-in `Parameters` utility type, which only extracts from the last overload.

@example
```
import type {OverloadParameters} from 'type-fest';

declare function request(url: string): Promise<string>;
declare function request(url: string, options: {json: true}): Promise<unknown>;

type AllParameters = OverloadParameters<typeof request>;
//=> [url: string] | [url: string, options: {json: true}]
```

Known limitations are the same as {@link Overloads}.

@category Function
*/
export type OverloadParameters<FunctionType extends (...args: any) => any> = Parameters<Overloads<FunctionType>[number]>;

export {};
