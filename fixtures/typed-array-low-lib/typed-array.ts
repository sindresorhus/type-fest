import type {FindGlobalInstanceType, TypedArray} from '../../index.d.ts';

// This fixture is compiled with `lib: ['ES2022']` (see `tsconfig.json` in this directory) to ensure that `TypedArray` does not reference globals that only exist in newer libs, like `Float16Array`, which requires `ES2025.Float16`.

// https://github.com/sindresorhus/type-fest/issues/1520
type Float16ArrayMember = Extract<TypedArray, FindGlobalInstanceType<'Float16Array'>>;

type Expect<Type extends true> = Type;
type IsNever<Type> = [Type] extends [never] ? true : false;

// When the lib does not define `Float16Array`, the member is omitted from the union instead of failing compilation with `TS2304: Cannot find name 'Float16Array'`.
type Float16ArrayOmittedOnLowerLibs = Expect<IsNever<Float16ArrayMember>>;

// The remaining members still form a usable union on lower libs.
const uint8Array: TypedArray = new Uint8Array(10);
const float64Array: TypedArray = new Float64Array(10);

export type {Float16ArrayOmittedOnLowerLibs};
export {uint8Array, float64Array};
