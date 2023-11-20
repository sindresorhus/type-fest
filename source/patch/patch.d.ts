export {
	type UserConfig as Configure,
	type Patch,
	type Settings,
}

/** TODO: Delete */
/** @internal */
export type test<t extends true> = t
/** TODO: Delete */
/** @internal */
export type equals<left, right> = [left, right] extends [right, left] ? true : false

/** @internal */
namespace Local {
	/** @internal */
	export type STOP = typeof STOP
	/** @internal */
	export declare const STOP: unique symbol
	/** @internal */
	export type URI = typeof URI
	/** @internal */
	export declare const URI: unique symbol
	/** @internal */
	export interface ReplaceFn {
		[URI]: never
		input: unknown
		output: unknown
	}
	/** @internal */
	export type Call<Fn extends ReplaceFn, Arg>
		= (Fn & { input: Arg })["output"]

	/** @internal */
	export type spread<L, R>
		= { [K in keyof L]-?: K extends keyof R ? {} extends R[K] ? Exclude<R[K], undefined> : R[K] : L[K] }

	/** TODO: Do you actually need this one? */
	/** @internal */
	export type isUnion<U>
		= ([U] extends [infer V] ? V : never) extends
		| infer V ? V extends V ? [U] extends [V] ? false : true : never : never
		;

}

namespace Settings {
	export type ReplaceFn<Fn extends Local.ReplaceFn = Local.ReplaceFn> = Fn
	export type Config<t extends Partial<CreateConfig> = Partial<CreateConfig>> = t

	export interface CreateConfig<replaceWith = unknown, maxDepth extends number = number> {
		replaceWith: replaceWith
		maxDepth: maxDepth
	}

	export type Defaults = CreateConfig<undefined, 1>
}

declare namespace Example {
	type Maybe_<T> = Nothing | Just<T>
	interface Nothing { tag: "Nothing" }
	interface Just<T> { tag: "Just"; value: T }
	interface Maybe extends Settings.ReplaceFn { output: Nothing | Just<this["input"]> }

	type CustomReplaceFnExample = Settings.CreateConfig<Example.Maybe, -1>
}

/**
 * {@link Patch} is a
 *
 * @example
 *  import type { Patch } from "typefest"
 *
 *
 *  type Input = { a: { b: 1 }, f?: { g: 2 }, j: { k?: 3 }, m?: { n?: 4 } }
 *  type Actual = Patch<input, { maxDepth: -1, replaceWith:  }>
 *
 *  type Equals<T, U> = [T, U] extends [U, T] ? "✅" : "🚫"
 *  type Output = Equals<
 *    // ^? type Output = "✅"
 *    Actual,
 *    {
 *      a: { b: 1 },
 *      f: Maybe<{ g: 2 }>,
 *      j: { k: Maybe<3> },
 *      m: Maybe<{ n: Maybe<4> }>,
 *    }
 *  >
 */
type Patch<
	treeRoot,
	userConfig extends
	| Settings.Config
	= Settings.Defaults
> = Helpers.spread<Settings.Defaults, userConfig> extends
	| Settings.Config<infer config>
	? Helpers.isUnion<treeRoot> extends true ?
	(treeRoot extends treeRoot ? Patch<treeRoot, userConfig> : never)
	: unknown extends treeRoot ? unknown
	: ApplyPatch<
		Plug<[], config["maxDepth"], treeRoot>,
		config["replaceWith"]
	>
	: never
	;

type Plug<
	current extends void[],
	max extends number,
	tree
> = current["length"] extends max ? tree
	: tree extends object
	? { [ix in keyof tree]
		-?:
		Plug<[...current, void], max, (
			{} extends Pick<tree, ix>
			? (Local.STOP | Exclude<tree[ix], undefined>)
			: tree[ix]
		)>
	}
	: tree
	;

type ApplyPatch<
	tree,
	replaceWith
>
	= Local.STOP extends tree
	? replaceWith extends Settings.ReplaceFn
	? Settings.Call<replaceWith, ApplyPatch<Exclude<tree, Local.STOP>, replaceWith>>
	: replaceWith | ApplyPatch<Exclude<tree, Local.STOP>, replaceWith>
	: tree extends object ? { [ix in keyof tree]: ApplyPatch<tree[ix], replaceWith> }
	: tree
	;

namespace __Spec__ {
	type Maybe<T> = Example.Maybe_<T>
	declare const CustomSymbol: unique symbol
	type input = { a: { b: 1 }, f?: { g: 2 }, j: { k?: 3 }, m?: { n?: 4 } }

	type __Spread__ = test<equals<
		Helpers.spread<Settings.Defaults, { replaceWith: Example.Maybe }>,
		{ replaceWith: Example.Maybe, maxDepth: 1 }
	>>

	type __Patch__ = [
		test<equals<Patch<unknown>, unknown>>,
		test<equals<Patch<never>, never>>,
		test<equals<Patch<any>, unknown>>, // eslint-disable-line @typescript-eslint/no-explicit-any

		test<equals<
			Patch<
				{ abc?: { def?: { ghi: undefined | 1 } } },
				{ replaceWith: typeof CustomSymbol, maxDepth: 1 }
			>,
			{ abc: typeof CustomSymbol | { def?: { ghi: undefined | 1 } } }
		>>,

		test<equals<
			Patch<input, Settings.Defaults>,
			{ a: { b: 1 }, f: undefined | { g: 2 }, j: { k?: 3 }, m: undefined | { n?: 4 } }
		>>,

		test<equals<
			Patch<input, { replaceWith: undefined, maxDepth: 1 }>,
			Patch<input>
		>>,

		test<equals<
			Patch<
				{ abc?: { def?: { ghi: undefined | 1 } } },
				{ replaceWith: Example.Maybe, maxDepth: -1 }
			>,
			{ abc: Maybe<{ def: Maybe<{ ghi: undefined | 1 }> }> }
		>>,

		test<equals<
			Patch<{ abc?: { def?: { ghi: 1 | undefined } } }>,
			{ abc: { def?: { ghi: 1 | undefined } } | undefined }
		>>,

		test<equals<
			Patch<
				{ abc?: { def?: { ghi?: { jkl: 1 | undefined } } } },
				Settings.CreateConfig<null, 2>
			>,
			{ abc: { def: { ghi?: { jkl: 1 | undefined } } | null } | null }
		>>,

		test<equals<
			Patch<
				{ abc?: { def?: { ghi: 1 | undefined } } },
				Settings.CustomReplaceFnExample
			>,
			{ abc: Maybe<{ def: Maybe<{ ghi: 1 | undefined }> }> }
		>>,

		test<equals<
			Patch<
				{ abc: [1, [2?, 3?, [4, [[5, 6, 7?]]]?]] },
				Settings.CreateConfig<undefined, -1>
			>,
			{ abc: [1, [2 | undefined, 3 | undefined, [4, [[5, 6, 7 | undefined]]] | undefined]] }
		>>,

		test<equals<
			Patch<
				| []
				| { abc: [1, [2?, 3?, [4, [[5, 6, 7?]]]?]] },
				{ maxDepth: -1 }
			>,
			| []
			| { abc: [1, [2 | undefined, 3 | undefined, [4, [[5, 6, 7 | undefined]]] | undefined]] }
		>>,

		test<equals<
			Patch<
				| { def?: 1 }
				| { abc?: [1, [2?, 3?, [4, [[5, 6, 7?]]]?]] },
				{ maxDepth: -1 }
			>,
			| { def: 1 | undefined }
			| { abc: [1, [2 | undefined, 3 | undefined, [4, [[5, 6, 7 | undefined]]] | undefined]] | undefined }
		>>,

		test<equals<
			Patch<
				| { def?: 1 }
				| { abc?: [1, [2?, 3?, [4, [[5, 6, 7?]]]?]] },
				{ replaceWith: Example.Maybe, maxDepth: -1 }
			>,
			| { def: Maybe<1> }
			| { abc: Maybe<[1, [Maybe<2>, Maybe<3>, Maybe<[4, [[5, 6, Maybe<7>]]]>]]> }
		>>,

		test<equals<
			Patch<input, Settings.CustomReplaceFnExample>,
			{
				a: { b: 1 },
				f: Maybe<{ g: 2 }>,
				j: { k: Maybe<3> },
				m: Maybe<{ n: Maybe<4> }>,
			}
		>>
	]
}
