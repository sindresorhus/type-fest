/**
Returns a boolean for whether the two given types are equal.

@link https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
@link https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796#68963796

@example
```
import type {IsEqual} from 'type-fest';

type Expect<T extends true> = T
type Case = Expect<IsEqual<Uppercase<"sample">, "SAMPLE">>
```

@category Utilities
*/
export type IsEqual<X, Y> =
	(<G>() => G extends X ? 1 : 2) extends
	(<G>() => G extends Y ? 1 : 2)
		? true
		: false;
