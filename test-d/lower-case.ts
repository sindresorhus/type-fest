import {expectType} from 'tsd';
import type {LowerCase} from '../index.d.ts';

const lowerFromCamel: LowerCase<'fooBar'> = 'foobar';
expectType<'foobar'>(lowerFromCamel);

const lowerFromPascal: LowerCase<'FooBar'> = 'foobar';
expectType<'foobar'>(lowerFromPascal);

const lowerFromKebab: LowerCase<'foo-bar'> = 'foobar';
expectType<'foobar'>(lowerFromKebab);

const lowerFromSnake: LowerCase<'foo_bar'> = 'foobar';
expectType<'foobar'>(lowerFromSnake);

const lowerFromMixed: LowerCase<'foo-bar_abc xyzBarFoo'> = 'foobarabcxyzbarfoo';
expectType<'foobarabcxyzbarfoo'>(lowerFromMixed);

declare const withPunctuation: LowerCase<'onDialog:close'>;
expectType<'ondialog:close'>(withPunctuation);

declare const withPunctuationSplit: LowerCase<'onDialog:close', {splitOnPunctuation: true}>;
expectType<'ondialogclose'>(withPunctuationSplit);
