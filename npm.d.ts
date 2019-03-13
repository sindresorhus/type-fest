import {LiteralUnion} from '.';

/**
A person who has been involved in creating or maintaining the package.
*/
export type Person =
	| string
	| {
		name: string;
		url?: string;
		email?: string;
	};

export type BugsLocation =
	| string
	| {
		/**
		The URL to the package's issue tracker.
		*/
		url?: string;

		/**
		The email address to which issues should be reported.
		*/
		email?: string;
	};

export interface DirectoryLocations {
	/**
	Location for executable scripts. Sugar to generate entries in the `bin` property by walking the folder.
	*/
	bin?: string;

	/**
	Location for Markdown files.
	*/
	doc?: string;

	/**
	Location for example scripts.
	*/
	example?: string;

	/**
	Location for the bulk of the library.
	*/
	lib?: string;

	/**
	Location for man pages. Sugar to generate a `man` array by walking the folder.
	*/
	man?: string;

	/**
	Location for test files.
	*/
	test?: string;

	[directoryType: string]: unknown;
}

export interface ScriptsDefinition {
	/**
	Run **before** the package is published (Also run on local `npm install` without any arguments).
	*/
	prepublish?: string;

	/**
	Run both **before** the package is packed and published, and on local `npm install` without any arguments. This is run **after** `prepublish`, but **before** `prepublishOnly`.
	*/
	prepare?: string;

	/**
	Run **before** the package is prepared and packed, **only** on `npm publish`.
	*/
	prepublishOnly?: string;

	/**
	Run **before** a tarball is packed (on `npm pack`, `npm publish`, and when installing git dependencies).
	*/
	prepack?: string;

	/**
	Run **after** the tarball has been generated and moved to its final destination.
	*/
	postpack?: string;

	/**
	Run **after** the package is published.
	*/
	publish?: string;

	/**
	Run **after** the package is published.
	*/
	postpublish?: string;

	/**
	Run **before** the package is installed.
	*/
	preinstall?: string;

	/**
	Run **after** the package is installed.
	*/
	install?: string;

	/**
	Run **after** the package is installed and after `install`.
	*/
	postinstall?: string;

	/**
	Run **before** the package is uninstalled and before `uninstall`.
	*/
	preuninstall?: string;

	/**
	Run **before** the package is uninstalled.
	*/
	uninstall?: string;

	/**
	Run **after** the package is uninstalled.
	*/
	postuninstall?: string;

	/**
	Run **before** bump the package version and before `version`.
	*/
	preversion?: string;

	/**
	Run **before** bump the package version.
	*/
	version?: string;

	/**
	Run **after** bump the package version.
	*/
	postversion?: string;

	/**
	Run with the `npm test` command, before `test`.
	*/
	pretest?: string;

	/**
	Run with the `npm test` command.
	*/
	test?: string;

	/**
	Run with the `npm test` command, after `test`.
	*/
	posttest?: string;

	/**
	Run with the `npm stop` command, before `stop`.
	*/
	prestop?: string;

	/**
	Run with the `npm stop` command.
	*/
	stop?: string;

	/**
	Run with the `npm stop` command, after `stop`.
	*/
	poststop?: string;

	/**
	Run with the `npm start` command, before `start`.
	*/
	prestart?: string;

	/**
	Run with the `npm start` command.
	*/
	start?: string;

	/**
	Run with the `npm start` command, after `start`.
	*/
	poststart?: string;

	/**
	Run with the `npm restart` command, before `restart`. Note: `npm restart` will run the `stop` and `start` scripts if no `restart` script is provided.
	*/
	prerestart?: string;

	/**
	Run with the `npm restart` command. Note: `npm restart` will run the `stop` and `start` scripts if no `restart` script is provided.
	*/
	restart?: string;

	/**
	Run with the `npm restart` command, after `restart`. Note: `npm restart` will run the `stop` and `start` scripts if no `restart` script is provided.
	*/
	postrestart?: string;

	[scriptName: string]: string | undefined;
}

/**
Array of package names that is bundled when the package is publihed.
*/
export type BundledDependency = string[];

/**
Dependencies of the package. The version range is a string which has one or more space-separated descriptors. Dependencies can also be identified with a tarball or Git URL.
*/
export interface Dependency {
	[packageName: string]: string;
}

export type PackageJson = {
	/**
	The name of the package.
	*/
	name?: string;

	/**
	Package version, parseable by [`node-semver`](https://github.com/npm/node-semver).
	*/
	version?: string;

	/**
	Package description, listed in `npm search`.
	*/
	description?: string;

	/**
	Keywords associated with package, listed in `npm search`.
	*/
	keywords?: string[];

	/**
	The URL to the package's homepage.
	*/
	homepage?: LiteralUnion<'.', string>;

	/**
	The URL to the package's issue tracker and/or the email address to which issues should be reported.
	*/
	bugs?: BugsLocation;

	/**
	The license for the package.
	*/
	license?: string;

	/**
	The licenses for the package.
	*/
	licenses?: {
		type?: string;
		url?: string;
	}[];

	author?: Person;

	/**
	A list of people who contributed to the package.
	*/
	contributors?: Person[];

	/**
	A list of people who maintain the package.
	*/
	maintainers?: Person[];

	/**
	The files included in the package.
	*/
	files?: string[];

	/**
	The module ID that is the primary entry point to the program.
	*/
	main?: string;

	bin?:
	| string
	| {
		[binary: string]: string;
	};

	/**
	Location of the bundled TypeScript declaration file.
	*/
	types?: string;

	/**
	Location of the bundled TypeScript declaration file. Synonymous with `types`.
	*/
	typings?: string;

	/**
	Filenames to put in place for the `man` program to find.
	*/
	man?: string | string[];

	directories?: DirectoryLocations;

	/**
	Location for the code repository.
	*/
	repository?:
	| string
	| {
		type: string;
		url: string;
	};

	/**
	Script commands that are run at various times in the lifecycle of the package. The key is the lifecycle event, and the value is the command to run at that point.
	*/
	scripts?: ScriptsDefinition;

	/**
	Is used to set configuration parameters used in package scripts that persist across upgrades.
	*/
	config?: {
		[configKey: string]: unknown;
	};

	/**
	The dependencies of the package.
	*/
	dependencies?: Dependency;

	/**
	Additional tooling dependencies that are not required for the package to work. Usually test, build, or documentation tooling.
	*/
	devDependencies?: Dependency;

	/**
	Dependencies that are skipped if they fail to install.
	*/
	optionalDependencies?: Dependency;

	/**
	Dependencies that will usually be required by the package user directly or via another dependency.
	*/
	peerDependencies?: Dependency;

	/**
	Package names that are bundled when the package is published.
	*/
	bundleDependencies?: string[];

	/**
	Synonym for `bundleDependencies`.
	 */
	bundledDependencies?: string[];

	resolutions?: Dependency;

	/**
	Engines that this package runs on.
	*/
	engines?: {
		[engineName: string]: string;
	};

	/**
	 * @deprecated
	 */
	engineStrict?: boolean;

	/**
	Operating systems the module runs on.
	*/
	os?: LiteralUnion<
		'darwin' | 'linux' | 'win32' | '!darwin' | '!linux' | '!win32',
		string
	>[];

	/**
	CPU architectures the module runs on.
	*/
	cpu?: LiteralUnion<
		'x64' | 'ia32' | 'arm' | 'mips' | '!x64' | '!ia32' | '!arm' | '!mips',
		string
	>[];

	/**
	If set to `true`, a warning will be shown if package is installed locally. Useful if the package is primarily a command-line application that should be installed globally.

	@deprecated
	*/
	preferGlobal?: boolean;

	/**
	If set to `true`, then npm will refuse to publish it.
	*/
	private?: boolean;

	/**
	 * A set of config values that will be used at publish-time. It's especially handy to set the tag, registry or access, to ensure that a given package is not tagged with 'latest', published to the global public registry or that a scoped module is private by default.
	 */
	publishConfig?: {
		[config: string]: unknown;
	};

	dist?: {
		shasum?: string;
		tarball?: string;
		integrity?: string;
		[key: string]: unknown;
	};

	readme?: string;

	/**
	An ECMAScript module ID that is the primary entry point to the program.
	*/
	module?: string;

	/**
	A module ID with untranspiled code that is the primary entry point to the program.
	*/
	esnext?:
	| string
	| {
		main?: string;
		browser?: string;
		[moduleName: string]: string | undefined;
	};

	/**
	JSPM configuration.
	*/
	jspm?: PackageJson;
} & {
	[k: string]: unknown;
};
