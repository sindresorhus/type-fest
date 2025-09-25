import {createRuleTester} from './test-utils.js';
import {importPathRule} from './import-path.js';

const ruleTester = createRuleTester();

const invalidImport = (code, output) => ({
	code,
	errors: [{messageId: 'incorrectImportPath'}],
	output,
});

ruleTester.run('import-path', importPathRule, {
	valid: [
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
	],
	invalid: [
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
	],
});
