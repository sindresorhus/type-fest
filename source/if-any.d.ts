import type {IsAny} from './is-any';

/**
An if-else-like type that resolves depending on whether the given type is `any`.

@see {@link IsAny}

@example
```
import type {IsAny, IfAny} from 'type-fest';

type ShouldBeTrue = IsAny<any> extends true ? true : false;
//=> true

type ShouldBeFalse = IfAny<'not any'>;
//=> false

type ShouldBeNever = IfAny<'not any', 'not never', 'never'>;
//=> 'never'
```

@category Type Guard
@category Utilities
*/
export type IfAny<T, TypeIfAny = true, TypeIfNotAny = false> = (
	IsAny<T> extends true ? TypeIfAny : TypeIfNotAny
);
