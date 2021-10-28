import {expectType} from 'tsd';
import {TitleCase} from '../index';
import {ApaIgnoreUpperCase} from '../source/title-case';

const apaTitleFromCamel: TitleCase<'fooBarIsGreat'> = 'Foo Bar is Great';
expectType<'Foo Bar is Great'>(apaTitleFromCamel);

const apaTitleFromKebabWithCustomCaseIgnore: TitleCase<'bar-baz-is-ok', ApaIgnoreUpperCase | 'ok'> = 'Bar Baz is ok';
expectType<'Bar Baz is ok'>(apaTitleFromKebabWithCustomCaseIgnore);

const apaTitleFromComplexKebab: TitleCase<'foo-bar-abc-123'> = 'Foo Bar Abc 123';
expectType<'Foo Bar Abc 123'>(apaTitleFromComplexKebab);

const apaTitleFromSnake: TitleCase<'foo_bar_abc'> = 'Foo Bar Abc';
expectType<'Foo Bar Abc'>(apaTitleFromSnake);
