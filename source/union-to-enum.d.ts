import type {ToEnumOptions, TupleToEnum} from './tuple-to-enum.d.ts';
import type {UnionToTuple} from './union-to-tuple.d.ts';

/**
Converts a union of property keys (string, number, or symbol) into an **Enum**.

The keys are preserved, and their values are either:

- Their own literal values (by default)
- Or numeric indices (`1`, `2`, ...) if {@link ToEnumOptions.numeric `numeric`} is `true`. Union ordering is not guaranteed.

By default, **numeric Enums** start from **Index `1`**. See {@link ToEnumOptions.startIndex `startIndex`} to change this behavior.

This is useful for creating strongly typed enums from a union of literals.

@example
```
import type {UnionToEnum} from 'type-fest';

type E1 = UnionToEnum<'A' | 'B' | 'C'>;
//=> { A: 'A'; B: 'B'; C: 'C' }

type E2 = UnionToEnum<'X' | 'Y' | 'Z', {numeric: true}>;
//=> { X: 1; Y: 2; Z: 3 }

type E3 = UnionToEnum<'Play' | 'Pause' | 'Stop', {numeric: true; startIndex: 3}>;
//=> { Play: 3; Pause: 4; Stop: 5 }

type E4 = UnionToEnum<1 | 2 | 3>;
//=> { 1: 1; 2: 2; 3: 3 }

type E5 = UnionToEnum<1 | 2 | 3, {numeric: true; startIndex: -1}>;
//=> { 1: -1; 2: 0; 3: 1 }

type E6 = UnionToEnum<never>;
//=> {}
```

@example
```
import type {UnionToEnum, CamelCasedProperties} from 'type-fest';

const verb = ['write', 'read', 'delete'] as const;
const resource = ['file', 'folder', 'link'] as const;

declare function createEnum<
	const T extends readonly string[],
	const U extends readonly string[],
>(x: T, y: U): CamelCasedProperties<UnionToEnum<`${T[number]}_${U[number]}`>>;

const Template = createEnum(verb, resource);
//=> {
//    writeFile: 'write_file',
//    writeFolder: 'write_folder',
//    writeLink: 'write_link',
//    readFile: 'read_file',
//    readFolder: 'read_folder',
//    readLink: 'read_link',
//    deleteFile: 'delete_file',
//    deleteFolder: 'delete_folder',
//    deleteLink: 'delete_link',
// }
```

@see {@link TupleToEnum}
@see {@link UnionToTuple}
@category Object
*/
export type UnionToEnum<
	Keys extends PropertyKey,
	Options extends ToEnumOptions = {},
> = TupleToEnum<UnionToTuple<Keys>, Options>;

export {};
