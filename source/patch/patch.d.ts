export {
	type Patch,
	type Config,
	type Example
}

/** @internal */
declare namespace Local {
	/** @internal */
	export type PLACEHOLDER = typeof PLACEHOLDER
	/** @internal */
	export const PLACEHOLDER: unique symbol
	/** @internal */
	export type URI = typeof URI
	/** @internal */
	export const URI: unique symbol
	/** @internal */
	export interface ReplaceFn {
		[URI]: never
		input: unknown
		output: unknown
	}
	/** @internal */
	export type Run<Fn extends ReplaceFn, Arg>
		= (Fn & { input: Arg })["output"]

	/** @internal */
	export type Spread<L, R>
		= { [K in keyof L]-?: K extends keyof R ? {} extends R[K] ? Exclude<R[K], undefined> : R[K] : L[K] }

	/** TODO: Do you actually need this one? */
	/** @internal */
	export type isUnion<U>
		= ([U] extends [infer V] ? V : never) extends
		| infer V ? V extends V ? [U] extends [V] ? false : true : never : never
		;
}

declare namespace Config {
	export type ReplaceFn<fn extends Local.ReplaceFn = Local.ReplaceFn> = fn

	export { Options as options }
	export type Options<t extends Partial<Config.new> = Partial<Config.new>> = t

	export { Define as new }
	interface Define<
		replaceWith = unknown,
		maxDepth extends number = number
	> {
		replaceWith: replaceWith
		maxDepth: maxDepth
	}

	export { Default as default }
	type Default = Config.new<undefined, 1>
}

declare namespace Example {
	type Maybe_<T> = Nothing | Just<T>
	interface Nothing { tag: "Nothing" }
	interface Just<T> { tag: "Just"; value: T }

	interface Maybe extends Config.ReplaceFn {
		output: Nothing | Just<this["input"]>
	}

	type CustomReplaceFn = Config.new<Example.Maybe, -1>
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
	TreeRoot,
	UserConfig extends
	| Config.options
	= Config.default
>
	= unknown extends TreeRoot ? unknown
	: Local.Spread<Config.default, UserConfig> extends
	| Config.options<infer config>
	? Local.isUnion<TreeRoot> extends true ?
	(TreeRoot extends TreeRoot ? Patch<TreeRoot, UserConfig> : never)

	: ApplyPatch<
		Plug<[], config["maxDepth"] & {}, TreeRoot>,
		config["replaceWith"]
	>
	: never
	;

type Plug<
	Depth extends void[],
	MaxDepth extends number,
	Tree
> = Depth["length"] extends MaxDepth ? Tree
	: Tree extends object
	? { [ix in keyof Tree]
		-?:
		Plug<[...Depth, void], MaxDepth, (
			{} extends Pick<Tree, ix>
			? (Local.PLACEHOLDER | Exclude<Tree[ix], undefined>)
			: Tree[ix]
		)>
	}
	: Tree
	;

type ApplyPatch<
	tree,
	replaceWith
>
	= Local.PLACEHOLDER extends tree
	? [replaceWith] extends [Config.ReplaceFn]
	? Local.Run<replaceWith, ApplyPatch<Exclude<tree, Local.PLACEHOLDER>, replaceWith>>
	: replaceWith | ApplyPatch<Exclude<tree, Local.PLACEHOLDER>, replaceWith>
	: tree extends object ? { [ix in keyof tree]: ApplyPatch<tree[ix], replaceWith> }
	: tree
	;

