/**
Returns a `boolean` type to determine if the two types match exactly.

This can be useful if another type wants to make a decision based on whether one type is exactly the same as the other, with the same keys of the same types.

If you just use the `extends` expression as equality, the result will be `true` even if one of the types has extra keys.

@example
```
import {ExactMatch} from 'type-fest';

interface Foo {
  a: number;
  b: string;
}

interface Bar extends Foo {
  c: number;
}

type TestOptions<FooLike> = ExactMatch<FooLike, Foo> extends true ? { foo?: FooLike } : { foo: FooLike }

class Test<FooLike extends Foo = Foo> {
  private foo: FooLike = { a: 1, b: 'a' } as FooLike;

  constructor(options: TestOptions<FooLike>) {
    if (options.foo) {
      this.foo = options.foo;
    }
  }
}

// With the default type it is not necessary to specify the options.
const a = new Test({})

// With a custom type you need to pass the options to the constructor
// because the new type has the extra key `c`.
const b = new Test<Bar>({
  foo: {
    a: 1,
    b: 'a',
    c: 2
  }
})
```

@category Utilities
*/
export type ExactMatch<FirstType, SecondType> =
  FirstType extends SecondType ?
    Exclude<keyof FirstType, keyof SecondType> extends never ?
      Exclude<keyof SecondType, keyof FirstType> extends never ? true
      : false
    : false
  : false;
