/**
Create a type from another type with all properties set to optional and the nested properties of all properties set to optional

@example
```
import {PartialDeep} from 'type-fest';

interface Baz {
    qux: string;
    corge: {
        waldo: number[];
        fred: string;
    };
}

function foo(bar: PartialDeep<Baz>) { }

foo({ corge: { waldo: [ 1, 2 ] } });
```
*/
export type PartialDeep<T> = {
    [KeyObject in keyof T]?: T[KeyObject] extends Array<infer InferredType>
        ? Array<PartialDeep<InferredType>>
        : T[KeyObject] extends ReadonlyArray<infer InferredType>
            ? ReadonlyArray<PartialDeep<InferredType>>
            : PartialDeep<T[KeyObject]>;
};
