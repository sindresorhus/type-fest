
type MakeQuery<needle = unknown, replaceWith = unknown> = readonly [needle: needle, replaceWith: replaceWith]

type Query<t extends | MakeQuery = MakeQuery> = t

namespace Local {
	export interface ReplaceFn {
		[URI]: never
		input: unknown
		output: unknown
	}
	/** @internal */
	export type URI = typeof URI
	/** @internal */
	export declare const URI: unique symbol
	/** @internal */
	export type call<Fn extends ReplaceFn, Arg>
		= (Fn & { input: Arg })["output"]
	/** @internal */
	export type Primitive =
		| string
		| number
		| boolean
		| symbol
		| null
		| undefined
		| bigint
		;
}

namespace Settings {
	export type ReplaceFn = Local.ReplaceFn
}

export type ReplaceDeep<haystack, query extends Query>
	= query extends MakeQuery<infer needle, infer replaceWith>
	? haystack extends needle
	? [replaceWith] extends [Settings.ReplaceFn]
	? Local.call<replaceWith, Extract<haystack, needle>>
	: replaceWith | Exclude<haystack, needle>
	: haystack extends Local.Primitive ? haystack
	: { [ix in keyof haystack]: ReplaceDeep<haystack[ix], query> }
	: haystack
	;

interface Duplicate extends Settings.ReplaceFn {
	output: [this["input"], this["input"]]
}

interface StringFromNumber extends Settings.ReplaceFn {
	output
	: this["input"] extends number ? `${this["input"]}` : this["input"]
}

interface NumberFromString extends Settings.ReplaceFn {
	output
	: this["input"] extends `${infer x extends number}` ? x : this["input"]
}

interface Identity extends Settings.ReplaceFn {
	output: this["input"]
}

interface Box extends Settings.ReplaceFn {
	output: [this["input"]]
}

namespace __Spec__ {
	type spec<t extends true> = t
	type equals<t, u> = [t, u] extends [u, t] ? true : false

	type __ReplaceDeep__ = [
		spec<equals<
			ReplaceDeep<{ a: { b: { c: 1, d: 2, e: { d: 3 | 4 }, f: 5 } } }, [number, Duplicate]>,
			{ a: { b: { c: [1, 1]; d: [2, 2]; e: { d: [3, 3] | [4, 4]; }; f: [5, 5]; }; }; },
		>>,
		spec<equals<
			ReplaceDeep<{ a: { b: { c: 1, d: 2, e: { d: 3 | 4 }, f: 5 } } }, [number, StringFromNumber]>,
			{ a: { b: { c: "1"; d: "2"; e: { d: "3" | "4"; }; f: "5"; }; } }
		>>,
		spec<equals<
			ReplaceDeep<{ a: { b: { c: "1", d: "2", e: { d: "3" | "4" }, f: "5" } } }, [string, NumberFromString]>,
			{ a: { b: { c: 1; d: 2; e: { d: 3 | 4; }; f: 5; }; }; }
		>>,
		spec<equals<
			ReplaceDeep<{ a: { b: { c: ["1"], d: ["2"], e: { d: ["3" | "4", "5" | "6"] }, f: "7" } } }, [readonly string[], Identity]>,
			{ a: { b: { c: ["1"], d: ["2"], e: { d: ["3" | "4", "5" | "6"] }, f: "7" } } }
		>>,
		spec<equals<
			ReplaceDeep<{ a: { b: { c: ["1"], d: ["2"], e: { d: ["3" | "4", "5" | "6"] }, f: "7" } } }, [readonly string[], Box]>,
			{ a: { b: { c: 1; d: 2; e: { d: 3 | 4; }; f: 5; }; }; }
		>>,
	]
}
