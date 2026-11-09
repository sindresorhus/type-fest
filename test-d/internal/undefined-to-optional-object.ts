import {expectTypeOf} from 'nz';
import type {Except, MergeDeepOptions} from '../../index.d.ts';
import type {UndefinedToOptionalObject} from '../../source/internal/index.d.ts';

type Foo = {
	a: string;
	b?: string;
	c: undefined;
	d: number | undefined;
};

type OptionalFoo = UndefinedToOptionalObject<Foo>;

declare const optionalFoo: OptionalFoo;

expectTypeOf(optionalFoo).toBe<{
	a: string;
	b?: string;
	c: undefined;
	d?: number;
}>();

// Broad values have no explicit union with `undefined` to normalize.
expectTypeOf<UndefinedToOptionalObject<{anything: any; input: unknown; impossible: never}>>()
	.toBe<{anything: any; input: unknown; impossible: never}>();
expectTypeOf<UndefinedToOptionalObject<{optional?: unknown; explicit?: string | undefined}>>()
	.toBe<{optional?: unknown; explicit?: string}>();

// Keep generic options assignable without waiting for the public container dispatcher to resolve.
function normalizeOptions<Options extends MergeDeepOptions>(options: UndefinedToOptionalObject<Except<Options, 'arrayMergeMode'> & {arrayMergeMode: 'spread'}>): MergeDeepOptions {
	return options;
}

normalizeOptions<{recurseIntoArrays: true}>({arrayMergeMode: 'spread', recurseIntoArrays: true});
