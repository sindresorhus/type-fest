import { type Settings } from "./patch"

export * as Patch from "./patch"
export type Patch<
	TreeRoot,
	UserConfig extends
	| Settings.Config
	= Settings.Defaults
> = import("./patch").Patch<TreeRoot, UserConfig>;
