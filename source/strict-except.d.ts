import type { Except } from "./except";

/**
Filter out keys from an object - in stricter way.
It overcomes the fact that typescript errors on excess properties when defining the object as a literal.

@see https://github.com/sindresorhus/type-fest/issues/556
@example
```
import { Except } from "type-fest";

type Foo = {
    a: number;
    b: string;
    c: boolean;
};

type FooWithoutA = Except<Foo, 'a'>;

const foo: Foo = {
    a: 1,
    b: 'b',
    c: true
}

const fooWithoutA: FooWithoutA = foo; // not error: 
```

@example
```
import { StrictExcept } from "type-fest";

type Foo = {
    a: number;
    b: string;
    c: boolean;
};

type FooWithoutA = StrictExcept<Foo, 'a'>;

const foo: Foo = {
    a: 1,
    b: 'b',
    c: true
}

const fooWithoutA: FooWithoutA = foo; // error: 
```

*/
type StrictExcept<T, K extends keyof T> = Except<T, K> &
	Partial<Record<K, never>>;
