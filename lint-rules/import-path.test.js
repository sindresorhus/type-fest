import {createRuleTester} from './testing-utilities.js';
import {importPathRule} from './import-path.js';

const ruleTester = createRuleTester();

const invalidImport = (code, output) => ({
	code,
	errors: [{messageId: 'incorrectImportPath'}],
	output,
});

ruleTester.run('import-path', importPathRule, {
	valid: [
		// A dotted stem is part of the filename, not its declaration extension.
		{
			code: 'import type {Foo} from "./foo.shared.d.ts";',
		},
		// A stem ending in .d still has a valid declaration suffix.
		{
			code: 'import type {Foo} from "./foo.d.d.ts";',
		},
		// Dotted directories, re-exports and dotfiles use the same final-suffix rule.
		{
			code: 'export type {Foo} from "./types.generated/foo.shared.d.ts";',
		},
		{
			code: 'export * as Types from "../types.generated/foo.shared.d.ts";',
		},
		{
			code: 'import type {Config} from "./.config.d.ts";',
		},
		// Already has .d.ts extension
		{
			code: 'import type {Foo} from "./foo.d.ts";',
		},
		{
			code: 'import type {Bar} from "../bar.d.ts";',
		},
		{
			code: 'import {Baz} from "./types/baz.d.ts";',
		},
		// Non-relative imports are ignored
		{
			code: 'import {something} from "external-package";',
		},
		{
			code: 'import type {Type} from "@types/node";',
		},
		// Export named declarations with .d.ts extension
		{
			code: 'export type {Foo} from "./foo.d.ts";',
		},
		{
			code: 'export {Bar} from "../bar.d.ts";',
		},
		{
			code: 'export type {Baz as Qux} from "./types/baz.d.ts";',
		},
		// Export all declarations with .d.ts extension
		{
			code: 'export * from "./foo.d.ts";',
		},
		{
			code: 'export * from "../bar.d.ts";',
		},
		{
			code: 'export * as Types from "./types.d.ts";',
		},
		// Non re-exports are ignored
		{
			code: 'export {localVar};',
		},
		{
			code: 'export type {LocalType};',
		},
		{
			code: 'export type Foo = string;',
		},
		// Non-relative exports are ignored
		{
			code: 'export {something} from "external-package";',
		},
		{
			code: 'export * from "@types/node";',
		},
	],
	invalid: [
		// Replacing the final extension must preserve the whole module name.
		invalidImport(
			'import type {Foo} from "./foo.shared.ts";',
			'import type {Foo} from \'./foo.shared.d.ts\';',
		),
		// Fixing imports and re-exports replaces only the final extension, not any dotted directory or stem.
		invalidImport(
			'export type {Foo} from "./types.generated/foo.shared.js";',
			'export type {Foo} from \'./types.generated/foo.shared.d.ts\';',
		),
		invalidImport(
			'export * as Types from "../types.generated/foo.shared.tsx";',
			'export * as Types from \'../types.generated/foo.shared.d.ts\';',
		),
		invalidImport(
			'import type {Foo} from "./types.generated/foo";',
			'import type {Foo} from \'./types.generated/foo.d.ts\';',
		),
		// A dotfile without an extension has no suffix to replace.
		invalidImport(
			'import type {Config} from "./.config";',
			'import type {Config} from \'./.config.d.ts\';',
		),
		invalidImport(
			'import type {Config} from "./.config.ts";',
			'import type {Config} from \'./.config.d.ts\';',
		),
		// Missing extension
		invalidImport(
			'import type {Foo} from "./foo";',
			'import type {Foo} from \'./foo.d.ts\';',
		),
		// Wrong extension .ts
		invalidImport(
			'import type {Bar} from "../bar.ts";',
			'import type {Bar} from \'../bar.d.ts\';',
		),
		// Wrong extension .js
		invalidImport(
			'import type {Baz} from "./types.js";',
			'import type {Baz} from \'./types.d.ts\';',
		),
		// Deep path
		invalidImport(
			'import type {Deep} from "../../deep/path.tsx";',
			'import type {Deep} from \'../../deep/path.d.ts\';',
		),
		// Export named declarations - missing extension
		invalidImport(
			'export type {Foo} from "./foo";',
			'export type {Foo} from \'./foo.d.ts\';',
		),
		invalidImport(
			'export {Bar} from "../bar";',
			'export {Bar} from \'../bar.d.ts\';',
		),
		// Export named declarations - wrong extension
		invalidImport(
			'export type {Baz} from "./types.ts";',
			'export type {Baz} from \'./types.d.ts\';',
		),
		invalidImport(
			'export {Qux} from "./qux.js";',
			'export {Qux} from \'./qux.d.ts\';',
		),
		// Export all declarations - missing extension
		invalidImport(
			'export * from "./foo";',
			'export * from \'./foo.d.ts\';',
		),
		invalidImport(
			'export * from "../bar";',
			'export * from \'../bar.d.ts\';',
		),
		// Export all declarations - wrong extension
		invalidImport(
			'export * from "./types.ts";',
			'export * from \'./types.d.ts\';',
		),
		invalidImport(
			'export * as AllTypes from "../../all.js";',
			'export * as AllTypes from \'../../all.d.ts\';',
		),
	],
});
