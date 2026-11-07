import markdown from '@eslint/markdown';
import {createRuleTester, createFixtures, dedenter, errorAt} from './testing-utilities.js';
import {readmeApiTypesRule} from './readme-api-types.js';

const {fixturePath} = createFixtures({
	'index.d.ts': dedenter`
		export type {Listed, SecondListed} from './source/listed.d.ts';
		export type {Missing} from './source/missing.d.ts';
		export type {Duplicate} from './source/duplicate.d.ts';
		export type {Deprecated} from './source/deprecated.d.ts';
		export type {SomeOptions} from './source/some-options.d.ts';
		export type {Tag} from './source/tag.d.ts';
		export type * from './source/star.d.ts';
		export type {NestedType} from './source/nested-a.d.ts';
		export type {Tagged} from 'type-fest';
		export type * from './source/reused-root.d.ts';
		export type {OriginalName as Renamed} from './source/renamed.d.ts';
		export type * from './source/cycle-a.d.ts';
	`,
	'source/listed.d.ts': dedenter`
		export type Listed = string;
		export type SecondListed = string;
	`,
	'source/missing.d.ts': 'export type Missing = string;\n',
	'source/duplicate.d.ts': 'export type Duplicate = string;\n',
	'source/deprecated.d.ts': dedenter`
		/**
		Deprecated type.
		@deprecated Use something else.
		*/
		export type Deprecated = string;
	`,
	'source/some-options.d.ts': 'export type SomeOptions = {value: string};\n',
	'source/tag.d.ts': 'export type Tag = string;\n',
	'source/star.d.ts': dedenter`
		export type StarType = string;
		export type StarOptions = {value: string};

		/**
		Deprecated star type.
		@deprecated Use something else.
		*/
		export type StarDeprecated = string;
	`,
	'source/nested-a.d.ts': 'export type * from \'./nested-b.d.ts\';\n',
	'source/nested-b.d.ts': 'export type NestedType = string;\n',
	'source/reused-root.d.ts': dedenter`
		export type {ReusedOne} from './reused.d.ts';
		export type {ReusedTwo} from './reused.d.ts';
	`,
	'source/reused.d.ts': dedenter`
		export type ReusedOne = string;
		export type ReusedTwo = string;
	`,
	'source/renamed.d.ts': 'export type OriginalName = string;\n',
	'source/cycle-a.d.ts': dedenter`
		export type * from './cycle-b.d.ts';
		export type CycleA = string;
	`,
	'source/cycle-b.d.ts': dedenter`
		export type * from './cycle-a.d.ts';
		export type CycleB = string;
	`,
});

const ruleTester = createRuleTester({
	plugins: {markdown},
});

const testCase = test => ({
	filename: fixturePath('readme.md'),
	language: 'markdown/commonmark',
	...test,
});

const entries = [
	'- [`Listed`](source/listed.d.ts) - Listed.',
	'- [`SecondListed`](source/listed.d.ts) - Second listed.',
	'- [`Missing`](source/missing.d.ts) - Missing.',
	'- [`Duplicate`](source/duplicate.d.ts) - Duplicate.',
	'- [`StarType`](source/star.d.ts) - Star type.',
	'- [`NestedType`](source/nested-a.d.ts) - Nested type.',
	'- [`ReusedOne`](source/reused.d.ts) - Reused one.',
	'- [`ReusedTwo`](source/reused.d.ts) - Reused two.',
	'- [`Renamed`](source/renamed.d.ts) - Renamed.',
	'- [`CycleA`](source/cycle-a.d.ts) - Cycle A.',
	'- [`CycleB`](source/cycle-b.d.ts) - Cycle B.',
];

const apiList = list => `## API\n\n${list.join('\n')}`;

const without = (...typeNames) => entries.filter(entry => typeNames.every(typeName => !entry.startsWith(`- [\`${typeName}\`]`)));

ruleTester.run('readme-api-types', readmeApiTypesRule, {
	valid: [
		// Every public type is listed once.
		testCase({
			code: apiList(entries),
		}),
		// Types inside an API subsection still count.
		testCase({
			code: apiList(entries).replace('## API\n', '## API\n\n### Basic\n'),
		}),
		// `*Options` types and deprecated types are not required, and duplicates of them are ignored.
		testCase({
			code: apiList([
				...entries,
				'- [`Deprecated`](source/deprecated.d.ts) - Deprecated.',
				'- [`Deprecated`](source/deprecated.d.ts) - Deprecated.',
				'- [`SomeOptions`](source/some-options.d.ts) - Options.',
				'- [`Tag`](source/tag.d.ts) - Tag.',
				'- [`Tag`](source/tag.d.ts) - Tag again.',
				'- [`StarOptions`](source/star.d.ts) - Star options.',
				'- [`StarDeprecated`](source/star.d.ts) - Deprecated star type.',
			]),
		}),
		// A README without an API section is not checked.
		testCase({
			code: `## Types\n\n${entries.join('\n')}`,
		}),
		// A list item that does not start with a link is ignored.
		testCase({
			code: apiList([...entries, '- Some unrelated note.']),
		}),
		// Only `readme.md` is checked.
		testCase({
			filename: fixturePath('types.md'),
			code: apiList(['- [`Listed`](source/listed.d.ts) - Listed.']),
		}),
	],
	invalid: [
		// A public type without an entry.
		testCase({
			code: apiList(without('Missing')),
			errors: [{messageId: 'missingType', data: {typeName: 'Missing'}}],
		}),
		// A public type with more than one entry reports the later entry.
		testCase({
			code: apiList([...entries, '- [`Duplicate`](source/duplicate.d.ts) - Duplicate again.']),
			errors: [errorAt({
				line: 3 + entries.length,
				textBeforeStart: '- ',
				messageId: 'duplicateType',
				target: '[`Duplicate`](source/duplicate.d.ts)',
			})],
		}),
		// An entry in another top-level section does not count.
		testCase({
			code: `${apiList(without('Missing'))}\n\n## Other\n\n- [\`Missing\`](source/missing.d.ts) - Missing.`,
			errors: [{messageId: 'missingType', data: {typeName: 'Missing'}}],
		}),
		// A type added through `export type *` is required.
		testCase({
			code: apiList(without('StarType')),
			errors: [{messageId: 'missingType', data: {typeName: 'StarType'}}],
		}),
		// Every type in a multi-name export is required.
		testCase({
			code: apiList(without('SecondListed')),
			errors: [{messageId: 'missingType', data: {typeName: 'SecondListed'}}],
		}),
		// A type from a nested re-export is required.
		testCase({
			code: apiList(without('NestedType')),
			errors: [{messageId: 'missingType', data: {typeName: 'NestedType'}}],
		}),
		// A file re-exported by name twice must contribute its types each time.
		testCase({
			code: apiList(without('ReusedTwo')),
			errors: [{messageId: 'missingType', data: {typeName: 'ReusedTwo'}}],
		}),
		// The public name is the alias, not the original name.
		testCase({
			code: apiList([...without('Renamed'), '- [`OriginalName`](source/renamed.d.ts) - Original name.']),
			errors: [{messageId: 'missingType', data: {typeName: 'Renamed'}}],
		}),
		// Re-export cycles terminate and still collect both files.
		testCase({
			code: apiList(without('CycleB')),
			errors: [{messageId: 'missingType', data: {typeName: 'CycleB'}}],
		}),
		// All missing types are reported.
		testCase({
			code: apiList(without('StarType', 'NestedType')),
			errors: [
				{messageId: 'missingType', data: {typeName: 'StarType'}},
				{messageId: 'missingType', data: {typeName: 'NestedType'}},
			],
		}),
		// An external link does not count as an entry.
		testCase({
			code: apiList([...without('Missing'), '- [`Missing`](https://example.com/missing.d.ts) - Missing.']),
			errors: [{messageId: 'missingType', data: {typeName: 'Missing'}}],
		}),
		// A link to a non-`.d.ts` file does not count as an entry.
		testCase({
			code: apiList([...without('Missing'), '- [`Missing`](source/missing.ts) - Missing.']),
			errors: [{messageId: 'missingType', data: {typeName: 'Missing'}}],
		}),
	],
});
