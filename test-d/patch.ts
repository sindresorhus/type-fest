import { expectType } from 'tsd';
import type { Patch } from '../index';

declare const patch: <T, UserConfig extends Patch.Settings.Config = never>(
	treeRoot: T,
	userConfig?: UserConfig
) =>
	Patch<T, UserConfig>

type Maybe<T> = Patch.Example.Maybe_<T>

declare namespace arrange {
	const customSymbol: unique symbol
	const input: { a: { b: 1 }, f?: { g: 2 }, j: { k?: 3 }, m?: { n?: 4 } };
	const defaultConfig: Patch.Settings.Defaults
	const customReplaceFnConfig: Patch.Example.CustomReplaceFn
	const unknown: unknown
	const never: never
	const any: any
}

expectType<Patch<unknown>>(arrange.unknown)
expectType<unknown>(patch(arrange.unknown))

expectType<Patch<any>>(arrange.unknown)
expectType<unknown>(patch(arrange.any))

expectType<Patch<never>>(arrange.never)
expectType<never>(patch(arrange.never))


declare namespace T00 {
	const input: typeof arrange.input
	const config: typeof arrange.customReplaceFnConfig
	const output: {
		a: { b: 1; };
		f: Maybe<{ g: 2; }>;
		j: { k: Maybe<3> };
		m: Maybe<{ n: Maybe<4> }>;
	}
}

expectType<typeof T00.output>(patch(T00.input, T00.config))
expectType<ReturnType<typeof patch<typeof T00.input, typeof T00.config>>>(T00.output)

declare namespace T_01 {
	const config: { replaceWith: typeof arrange.customSymbol, maxDepth: 1 }
	const input: { abc?: { def?: { ghi: undefined | 1 } } }
	const output: { abc: typeof arrange.customSymbol | { def?: { ghi: undefined | 1 } } }
}

expectType<ReturnType<typeof patch<typeof T_01.input, typeof T_01.config>>>(T_01.output)
expectType<typeof T_01.output>(patch(T_01.input, T_01.config))

declare namespace T_02 {
	const config: { replaceWith: typeof arrange.customSymbol, maxDepth: 1 }
	const input: typeof arrange.input
	// const output: { a: { b: 1 }, f: undefined | { g: 2 }, j: { k?: 3 }, m: undefined | { n?: 4 } }
	const output: {
		a: { b: 1; };
		f: typeof arrange.customSymbol | { g: 2; };
		j: { k?: 3 | undefined; };
		m: typeof arrange.customSymbol | { n?: 4 | undefined }
	}
}

expectType<typeof T_02.output>(patch(T_02.input, T_02.config))
expectType<ReturnType<typeof patch<typeof T_02.input, typeof T_02.config>>>(T_02.output)

declare namespace T_03 {
	const config: typeof arrange.defaultConfig
	const input: typeof arrange.input
	const output: {
		a: { b: 1; };
		f: { g: 2; } | undefined;
		j: { k?: 3 | undefined; };
		m: { n?: 4 | undefined; } | undefined;
	}
}

expectType<typeof T_03.output>(patch(T_03.input, T_03.config))
expectType<ReturnType<typeof patch<typeof T_03.input, typeof T_03.config>>>(T_03.output)

declare namespace T_04 {
	const config: { replaceWith: Patch.Example.Maybe, maxDepth: -1 }
	const input: { abc?: { def?: { ghi: undefined | 1 } } }
	const output: { abc: Maybe<{ def: Maybe<{ ghi: undefined | 1 }> }> }
}

expectType<typeof T_04.output>(patch(T_04.input, T_04.config))
expectType<ReturnType<typeof patch<typeof T_04.input, typeof T_04.config>>>(T_04.output)

declare namespace T_05 {
	const config: Patch.Settings.CreateConfig<null, 2>
	const input: typeof arrange.input
	const output: { a: { b: 1; }; f: { g: 2; } | null; j: { k: 3 | null; }; m: { n: 4 | null; } | null; }
}

expectType<typeof T_05.output>(patch(T_05.input, T_05.config))
expectType<ReturnType<typeof patch<typeof T_05.input, typeof T_05.config>>>(T_05.output)

declare namespace T_06 {
	const config: Patch.Settings.CreateConfig<null, 2>
	const input: { abc?: { def?: { ghi?: { jkl: 1 | undefined } } } }
	const output: { abc: { def: { ghi?: { jkl: 1 | undefined } } | null } | null }
}

expectType<typeof T_06.output>(patch(T_06.input, T_06.config))
expectType<ReturnType<typeof patch<typeof T_06.input, typeof T_06.config>>>(T_06.output)

declare namespace T_07 {
	const input: { abc?: { def?: { ghi: 1 | undefined } } },
	const config: Patch.Example.CustomReplaceFn
	const output: { abc: Maybe<{ def: Maybe<{ ghi: 1 | undefined }> }> }
}

expectType<typeof T_07.output>(patch(T_07.input, T_07.config))
expectType<ReturnType<typeof patch<typeof T_07.input, typeof T_07.config>>>(T_07.output)

declare namespace T_08 {
	const input: { abc: [1, [2?, 3?, [4, [[5, 6, 7?]]]?]] },
	const config: Patch.Settings.CreateConfig<undefined, -1>
	const output: { abc: [1, [2 | undefined, 3 | undefined, [4, [[5, 6, 7 | undefined]]] | undefined]] }
}

expectType<typeof T_08.output>(patch(T_08.input, T_08.config))
expectType<ReturnType<typeof patch<typeof T_08.input, typeof T_08.config>>>(T_08.output)

declare namespace T_09 {
	const input:
		| []
		| { abc: [1, [2?, 3?, [4, [[5, 6, 7?]]]?]] },
	const config: { maxDepth: -1 }
	const output: | []
		| { abc: [1, [2 | undefined, 3 | undefined, [4, [[5, 6, 7 | undefined]]] | undefined]] }
}

expectType<typeof T_09.output>(patch(T_09.input, T_09.config))
expectType<ReturnType<typeof patch<typeof T_09.input, typeof T_09.config>>>(T_09.output)

declare namespace T_10 {
	const input:
		| { def?: 1 }
		| { abc?: [1, [2?, 3?, [4, [[5, 6, 7?]]]?]] }
	const config: { maxDepth: -1 }
	const output:
		| { def: 1 | undefined }
		| { abc: [1, [2 | undefined, 3 | undefined, [4, [[5, 6, 7 | undefined]]] | undefined]] | undefined }
}

expectType<typeof T_10.output>(patch(T_10.input, T_10.config))
expectType<ReturnType<typeof patch<typeof T_10.input, typeof T_10.config>>>(T_10.output)

declare namespace T_11 {
	const input:
		| { def?: 1 }
		| { abc?: [1, [2?, 3?, [4, [[5, 6, 7?]]]?]] }
	const config: { maxDepth: -1 }
	const output:
		| { def: 1 | undefined }
		| { abc: [1, [2 | undefined, 3 | undefined, [4, [[5, 6, 7 | undefined]]] | undefined]] | undefined }
}

expectType<typeof T_11.output>(patch(T_11.input, T_11.config))
expectType<ReturnType<typeof patch<typeof T_11.input, typeof T_11.config>>>(T_11.output)

declare namespace T_12 {
	const input:
		| { def?: 1 }
		| { abc?: [1, [2?, 3?, [4, [[5, 6, 7?]]]?]] },
	const config: { replaceWith: Patch.Example.Maybe, maxDepth: -1 }
	const output:
		| { def: Maybe<1> }
		| { abc: Maybe<[1, [Maybe<2>, Maybe<3>, Maybe<[4, [[5, 6, Maybe<7>]]]>]]> }
}

expectType<typeof T_12.output>(patch(T_12.input, T_12.config))
expectType<ReturnType<typeof patch<typeof T_12.input, typeof T_12.config>>>(T_12.output)

declare namespace T_13 {
	const input: typeof arrange.input
	const config: Patch.Example.CustomReplaceFn
	const output: {
		a: { b: 1 },
		f: Maybe<{ g: 2 }>,
		j: { k: Maybe<3> },
		m: Maybe<{ n: Maybe<4> }>,
	}
}

expectType<typeof T_13.output>(patch(T_13.input, T_13.config))
expectType<ReturnType<typeof patch<typeof T_13.input, typeof T_13.config>>>(T_13.output)
