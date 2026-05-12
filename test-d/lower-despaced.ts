import {expectType} from 'tsd';
import type {LowerDespaced, LowerSpaced} from '../index.d.ts';

const lowerDespacedFromCamel: LowerDespaced<'fooBar'> = 'foobar';
expectType<'foobar'>(lowerDespacedFromCamel);

const lowerDespacedFromPascal: LowerDespaced<'FooBar'> = 'foobar';
expectType<'foobar'>(lowerDespacedFromPascal);

const lowerDespacedFromKebab: LowerDespaced<'foo-bar'> = 'foobar';
expectType<'foobar'>(lowerDespacedFromKebab);

const lowerDespacedFromSnake: LowerDespaced<'foo_bar'> = 'foobar';
expectType<'foobar'>(lowerDespacedFromSnake);

const lowerDespacedFromMixed: LowerDespaced<'foo-bar_abc xyzBarFoo'> = 'foobarabcxyzbarfoo';
expectType<'foobarabcxyzbarfoo'>(lowerDespacedFromMixed);

declare const withPunctuation: LowerDespaced<'onDialog:close'>;
expectType<'ondialog:close'>(withPunctuation);

declare const withPunctuationSplit: LowerDespaced<'onDialog:close', {splitOnPunctuation: true}>;
expectType<'ondialogclose'>(withPunctuationSplit);

const lowerSpacedFromCamel: LowerSpaced<'fooBar'> = 'foo bar';
expectType<'foo bar'>(lowerSpacedFromCamel);

const lowerSpacedFromPascal: LowerSpaced<'FooBar'> = 'foo bar';
expectType<'foo bar'>(lowerSpacedFromPascal);

const lowerSpacedFromSnake: LowerSpaced<'foo_bar'> = 'foo bar';
expectType<'foo bar'>(lowerSpacedFromSnake);

const lowerSpacedFromMixed: LowerSpaced<'foo-bar_abc xyzBarFoo'> = 'foo bar abc xyz bar foo';
expectType<'foo bar abc xyz bar foo'>(lowerSpacedFromMixed);

declare const lowerSpacedWithPunctuation: LowerSpaced<'onDialog:close'>;
expectType<'on dialog:close'>(lowerSpacedWithPunctuation);

declare const lowerSpacedWithPunctuationSplit: LowerSpaced<'onDialog:close', {splitOnPunctuation: true}>;
expectType<'on dialog close'>(lowerSpacedWithPunctuationSplit);
