/**
Can be used as a short-circuit-esque/fallback-esque operator.
Probably most useful when the underlying type of the 1st passed
parameter is unknown or a union of sorts (such as in Object[key]
or Array[key] situations), but can be used anywhere a shorthand
for `A extends B ? A : C` seems useful.

@example
```
import {ExtendsOr} from 'type-fest';

// Say we are trying to convert an async api that uses callbacks
// as the last param to use native promises instead, resolving the
// last param the callback is called with (e.g. npm request package).
// We don't want Functions that don't take a Function as their last
// param to be promise-wrapped, nor do we want to alter the types of
// non-Function properties.

type PromiseApi = {
    [key in keyof Api]: LastTupleElement<
        Parameters<
            ExtendsOr<
                Api[key], // <--unsure if Function,
                // outer Parameters<> would err without ExtendsOr<> here
                Function, // <--if Function, passthru type
                (a: 0) => void // <--else fallback to this
            >
        >
    > extends Function
        ? (
              ...args: RemoveLastParam<Api[key]>
          ) => Promise<
              LastTupleElement<
                  Parameters<LastTupleElement<Parameters<Api[key]>>>
              >
          >
        : Api[key]; // passthru everything else untouched, including:
                    // non-Function types, Functions with no params,
                    // and Functions whose last param isn't Function
};
```

@category Utilities
*/
export type ExtendsOr<SomeType, Test, OrType> = SomeType extends Test
    ? SomeType
    : OrType;

/**
The inverse of ExtendsOr<>.

Probably most useful when the underlying type of the 1st passed
parameter is unknown or a union of sorts (such as in Object[key]
or Array[key] situations), but can be used anywhere a shorthand
for `A extends B ? C : A` seems useful. @see ExtendsOr

@example
```
import {ExtendsAnd} from 'type-fest';

type TruthyObject<Obj> = {
    [key in keyof Obj]: ExtendsAnd<Obj[k], boolean, true>;
};

// TruthyObject<{ notBool: string; bool1: boolean; bool2: boolean }>

// becomes...

// {
//     notBool: string;
//     bool1: true;
//     bool2: true;
// }
```

@category Utilities
*/
export type ExtendsAnd<SomeType, Test, AndType> = SomeType extends Test
    ? AndType
    : SomeType;

/**
Conditional shorthand.

Can be used anywhere a conditional expression could,
but otherwise cannot be used to "infer" types.

@example
```
import {ExtendsThenElse, ExtendsAnd} from 'type-fest';

type TruthyObjectWithDates<Obj> = {
    [key in keyof Obj]: ExtendsThenElse<
        Obj[key],
        boolean,
        true,
        ExtendsAnd<
            Obj[key],
            string,
            `${number}${number}${number}${number}-${number}${number}-${number}${number}`
        >
    >;
};

// TruthyObjectWithDates<{
//     date1: string;
//     bool1: boolean;
//     bool2: boolean;
//     leftAlone: Function
// }>

// becomes...

// {
//     date1: `${number}${number}${number}${number}-${number}${number}-${number}${number}`;
//     bool1: true;
//     bool2: true;
//     leftAlone: Function
// }
```

@category Utilities
*/
export type ExtendsThenElse<
    SomeType,
    Test,
    ThenValue,
    ElseValue,
> = SomeType extends Test ? ThenValue : ElseValue;
