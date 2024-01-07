type Query = { needle: unknown, replaceWith: unknown }

declare namespace Local {
	/** @internal */
	export type URI = typeof URI
	/** @internal */
	export const URI: unique symbol
	/** @internal */
	export type Run<Fn extends Config.ReplaceFn, Arg>
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

declare namespace Config {
	export interface ReplaceFn {
		[Local.URI]: never
		input: unknown
		output: unknown
	}
}

export type ReplaceDeep<haystack, query extends Query>
	= query extends { needle: infer needle, replaceWith: infer replaceWith }
	? [haystack] extends [needle]
	? [replaceWith] extends [Config.ReplaceFn]
	? Local.Run<replaceWith, Extract<haystack, needle>>
	: replaceWith | Exclude<haystack, needle>
	: haystack extends Local.Primitive ? haystack
	: { [ix in keyof haystack]: ReplaceDeep<haystack[ix], query> }
	: haystack
	;
