import {type Config} from './patch'
import * as P from './patch'

export * as Patch from './patch'
export type Patch<
	TreeRoot,
	UserConfig extends
	| Config.options
	= Config.default
> = P.Patch<TreeRoot, UserConfig>;
