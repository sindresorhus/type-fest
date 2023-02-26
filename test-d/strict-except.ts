import type {StrictExcept} from '../index';

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

const foo2: FooWithoutA = {
    b: 'b',
    c: true
}

// const fooWithoutA: FooWithoutA = foo; This is an error, as it should be.
const realFooWithoutA: FooWithoutA = foo2; // Success.