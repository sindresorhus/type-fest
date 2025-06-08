import {expectType} from 'tsd';
import type {Case} from '../../source/internal/index.d.ts';

type Phrase = 'foo bar_baz-case';

expectType<Case<'Camel', Phrase>>('fooBarBazCase');
expectType<Case<'Pascal', Phrase>>('FooBarBazCase');
expectType<Case<'Kebab', Phrase>>('foo-bar-baz-case');
expectType<Case<'Snake', Phrase>>('foo_bar_baz_case');
expectType<Case<'Delimiter', Phrase>>('foo#bar#baz#case');
expectType<Case<'Delimiter', Phrase, {delimiter: '/'}>>('foo/bar/baz/case');

type Template = {
	'write file': 'write file';
	'write folder': 'write folder';
	'write link': 'write link';
	'read file': 'read file';
	'read folder': 'read folder';
	'read link': 'read link';
	'delete file': 'delete file';
	'delete folder': 'delete folder';
	'delete link': 'delete link';
};

type CamelTemplate = Case<'CamelProp', Template>;
type PascalTemplate = Case<'PascalProp', Template>;
type KebabTemplate = Case<'KebabProp', Template>;
type SnakeTemplate = Case<'SnakeProp', Template>;
type DelimiterTemplate = Case<'DelimiterProp', Template>;
type DelimiterTemplate_ = Case<'DelimiterProp', Template, {delimiter: '/'}>;

expectType<CamelTemplate>({
	writeFile: 'write file',
	writeFolder: 'write folder',
	writeLink: 'write link',
	readFile: 'read file',
	readFolder: 'read folder',
	readLink: 'read link',
	deleteFile: 'delete file',
	deleteFolder: 'delete folder',
	deleteLink: 'delete link',
});

expectType<PascalTemplate>({
	WriteFile: 'write file',
	WriteLink: 'write link',
	WriteFolder: 'write folder',
	ReadLink: 'read link',
	ReadFile: 'read file',
	ReadFolder: 'read folder',
	DeleteLink: 'delete link',
	DeleteFile: 'delete file',
	DeleteFolder: 'delete folder',
});

expectType<KebabTemplate>({
	'write-link': 'write link',
	'write-file': 'write file',
	'write-folder': 'write folder',
	'read-link': 'read link',
	'read-file': 'read file',
	'read-folder': 'read folder',
	'delete-link': 'delete link',
	'delete-file': 'delete file',
	'delete-folder': 'delete folder',
});

expectType<SnakeTemplate>({
	write_file: 'write file',
	write_link: 'write link',
	write_folder: 'write folder',
	read_link: 'read link',
	read_file: 'read file',
	read_folder: 'read folder',
	delete_link: 'delete link',
	delete_file: 'delete file',
	delete_folder: 'delete folder',
});

expectType<DelimiterTemplate>({
	'write#file': 'write file',
	'write#folder': 'write folder',
	'write#link': 'write link',
	'read#file': 'read file',
	'read#folder': 'read folder',
	'read#link': 'read link',
	'delete#file': 'delete file',
	'delete#folder': 'delete folder',
	'delete#link': 'delete link',
});

expectType<DelimiterTemplate_>({
	'write/file': 'write file',
	'write/folder': 'write folder',
	'write/link': 'write link',
	'read/file': 'read file',
	'read/folder': 'read folder',
	'read/link': 'read link',
	'delete/file': 'delete file',
	'delete/folder': 'delete folder',
	'delete/link': 'delete link',
});
