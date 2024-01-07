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
}

declare namespace Config {
	export {
		Options as options,
		New as new,
		Default as default,
		ReplaceFn,
	}

	type ReplaceFn<fn extends Local.ReplaceFn = Local.ReplaceFn> = fn
	type Options<t extends Partial<Config.new> = Partial<Config.new>> = t
	type Default = Config.new<undefined, 1>
	interface New<
		replaceWith = unknown,
		maxDepth extends number = number
	> {
		replaceWith: replaceWith
		maxDepth: maxDepth
	}
}

declare namespace Example {
	type ExampleConfig = Config.new<Example.MaybeFn, -1>
	type Maybe<T> = Nothing | Just<T>
	interface Nothing { tag: "Nothing" }
	interface Just<T> { tag: "Just"; value: T }
	interface MaybeFn extends Config.ReplaceFn {
		output: Maybe<this["input"]>
	}
}

/**
 * {@link Patch}
 *
 * @example
 *  import type { Patch } from "typefest"
 *
 *  type Equals<T, U> = [T, U] extends [U, T] ? "✅" : "🚫"
 *
 *  // Imported to demo the `replaceWith` option (see example #3)
 *  import Maybe = Patch.Example.Maybe
 *  import MaybeFn = Patch.Example.MaybeFn
 *
 *  //////
 *  // EXAMPLE #1:
 *  type DemoShallowPatch = Equals<
 *    // ^? type DemoShallowPatch = "✅"
 *    Patch<{
 *      a: { b: 1 }
 *      f?: { g: 2 }
 *      j: { k?: 3 }
 *      m?: { n?: 4 }
 *    }>,
 *    {
 *      a: { b: 1 }
 *      f: { g: 2 } | undefined
 *      j: { k?: 3 }
 *      m: { n?: 4 } | undefined
 *    }
 *  >
 *
 *  //////
 *  // EXAMPLE #2:
 *  type DemoDeepPatch = Equals<
 *    // ^? type DemoDeepPatch = "✅"
 *    Patch<
 *    	{
 *    	  a: { b: 1 }
 *    	  f?: { g: 2 }
 *    	  j: { k?: 3 }
 *    	  m?: { n?: 4 }
 *    	},
 *    	{ maxDepth: never, replaceWith: null }
 *    >,
 *    {
 *      a: { b: 1 }
 *      f: { g: 2 } | null
 *      j: { k: 3 | null }
 *      m: { n: 4 | null } | null
 *    }
 *  >
 *
 *  //////
 *  // EXAMPLE #3:
 *  type DemoPatchWithCustomReplace = Equals<
 *    // ^? type DemoPatchWithCustomReplace = "✅"
 *    Patch<
 *      {
 *        a: { b: 1 }
 *        f?: { g: 2 }
 *        j: { k?: 3 }
 *        m?: { n?: 4 }
 *      },
 *      { maxDepth: -1, replaceWith: MaybeFn }
 *    >,
 *    (
 *      {
 *        a: { b: 1 }
 *        f: Maybe<{ g: 2 }>
 *        j: { k: Maybe<3> }
 *        m: Maybe<{ n: Maybe<4> }>
 *      }
 *    )
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
	| Config.options<infer config> ?
	(
		ApplyPatch<
			Plug<[], config["maxDepth"] & {}, TreeRoot>,
			config["replaceWith"]
		>
	)
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

type _3 = Local.Run<Example.MaybeFn, 3>
