import {expectType} from 'tsd';
import type {PascalCase} from '../index.d.ts';

const pascalFromCamel: PascalCase<'fooBar'> = 'FooBar';
expectType<'FooBar'>(pascalFromCamel);

const pascalFromKebab: PascalCase<'foo-bar'> = 'FooBar';
expectType<'FooBar'>(pascalFromKebab);

const pascalFromComplexKebab: PascalCase<'foo-bar-abc-123'> = 'FooBarAbc123';
expectType<'FooBarAbc123'>(pascalFromComplexKebab);

expectType<PascalCase<'fooBAR'>>('FooBar');
expectType<PascalCase<'fooBAR', {preserveConsecutiveUppercase: true}>>('FooBAR');

expectType<PascalCase<'fooBARBiz'>>('FooBarBiz');
expectType<PascalCase<'fooBARBiz', {preserveConsecutiveUppercase: true}>>('FooBARBiz');

expectType<PascalCase<'foo BAR-Biz_BUZZ', {preserveConsecutiveUppercase: true}>>('FooBARBizBUZZ');
expectType<PascalCase<'foo BAR-Biz_BUZZ', {preserveConsecutiveUppercase: false}>>('FooBarBizBuzz');
expectType<PascalCase<'foo\tBAR-Biz_BUZZ'>>('FooBarBizBuzz');

expectType<PascalCase<string, {preserveConsecutiveUppercase: true}>>({} as Capitalize<string>);
expectType<PascalCase<string>>({} as Capitalize<string>);
