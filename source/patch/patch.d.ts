export {
	type Patch,
	type Settings,
	type Example
}

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
	export type call<Fn extends ReplaceFn, Arg>
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

	interface Maybe extends Settings.ReplaceFn {
		output: Nothing | Just<this["input"]>
	}

	type CustomReplaceFn = Settings.CreateConfig<Example.Maybe, -1>
}

/**
 * {@link Patch}
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
>
	= unknown extends treeRoot ? unknown

	: Local.spread<Settings.Defaults, userConfig> extends
	| Settings.Config<infer config>
	? Local.isUnion<treeRoot> extends true ?
	(treeRoot extends treeRoot ? Patch<treeRoot, userConfig> : never)

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
	? Local.call<replaceWith, ApplyPatch<Exclude<tree, Local.STOP>, replaceWith>>
	: replaceWith | ApplyPatch<Exclude<tree, Local.STOP>, replaceWith>
	: tree extends object ? { [ix in keyof tree]: ApplyPatch<tree[ix], replaceWith> }
	: tree
	;

