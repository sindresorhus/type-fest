import type { ReplaceDeep, Config } from '../source/replace-deep';

declare namespace Fn {
	export { Duplicate as duplicate }
	interface Duplicate extends Config.ReplaceFn { output: [this["input"], this["input"]] }
	type duplicate<T> = [T, T]

	export { Identity as identity }
	interface Identity extends Config.ReplaceFn { output: this["input"] }

	export { ToString as toString }
	interface ToString extends Config.ReplaceFn { output: toString<this["input"]> }
	type toString<type> = type extends number ? `${type}` : type

	export { ParseInt as parseInt }
	interface ParseInt extends Config.ReplaceFn { output: parseInt<this["input"]> }
	type parseInt<type> = type extends `${infer x extends number}` ? x : type

	export { Box as box }
	interface Box extends Config.ReplaceFn { output: box<this["input"]> }
	type box<type> = never | [type]

	export { Unbox as unbox }
	interface Unbox extends Config.ReplaceFn { output: unbox<this["input"]> }
	type unbox<type>
		= type extends readonly [infer contents] ? contents
		: type extends readonly unknown[] ? type[number]
		: type;
}

declare namespace __Spec__ {
	type spec<t extends true> = t
	type equals<t, u> = [t, u] extends [u, t] ? true : false

	type __ReplaceDeep__ = [
		spec<equals<
			ReplaceDeep<
				{ a: { b: { c: 1, d: 2, e: { d: 3 | 4 }, f: 5 } } },
				{ needle: number, replaceWith: Fn.duplicate }
			>,
			{ a: { b: { c: [1, 1], d: [2, 2], e: { d: [3 | 4, 3 | 4] }, f: [5, 5] } } }
		>>,
		spec<equals<
			ReplaceDeep<
				{ a: { b: { c: 1, d: 2, e: { d: 3 | 4 }, f: 5 } } },
				{ needle: number, replaceWith: Fn.toString }
			>,
			{ a: { b: { c: "1", d: "2", e: { d: "3" | "4" }, f: "5" } } }
		>>,
		spec<equals<
			ReplaceDeep<
				{ a: { b: { c: "1", d: "2", e: { d: "3" | "4" }, f: "5" } } },
				{ needle: `${number}`, replaceWith: Fn.parseInt }
			>,
			{ a: { b: { c: 1, d: 2, e: { d: 3 | 4 }, f: 5 } } }
		>>,
		spec<equals<
			ReplaceDeep<
				{ a: { b: { c: ["1"], d: ["2"], e: { d: ["3" | "4", "5" | "6"] }, f: "7" } } },
				{ needle: readonly string[], replaceWith: Fn.identity }
			>,
			{ a: { b: { c: ["1"], d: ["2"], e: { d: ["3" | "4", "5" | "6"] }, f: "7" } } }
		>>,
		spec<equals<
			ReplaceDeep<
				{ a: { b: { c: "1", d: "2", e: { d: "3" | "4" | "5" | "6" }, f: "7" } } },
				{ needle: string, replaceWith: Fn.box }
			>,
			{ a: { b: { c: ["1"], d: ["2"], e: { d: ["3" | "4" | "5" | "6"] }, f: ["7"] } } }
		>>,
		spec<equals<
			ReplaceDeep<
				{ a: { b: { c: "1", d: "2", e: { d: ["3" | "4", "5" | "6"] }, f: "7" } } },
				{ needle: readonly string[], replaceWith: Fn.unbox }
			>,
			{ a: { b: { c: "1", d: "2", e: { d: "3" | "4" | "5" | "6" }, f: "7" } } }
		>>,
	]
}
