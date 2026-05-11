import {expectType} from 'tsd';
import type {LowerCasedProperties} from '../index.d.ts';

type Foobar = {helloWorld1: {fooBar: string}};
type FoobarPunctuated = {'hello@World1': {'foo::Bar': string}};

declare const foo: LowerCasedProperties<Foobar>;
expectType<{helloworld1: {fooBar: string}}>(foo);

declare const bar: LowerCasedProperties<Foobar, {splitOnNumbers: true}>;
expectType<{helloworld1: {fooBar: string}}>(bar);

declare const fooBarPunctuated: LowerCasedProperties<FoobarPunctuated>;
expectType<{'hello@world1': {'foo::Bar': string}}>(fooBarPunctuated);

declare const fooBarPunctuatedSplit: LowerCasedProperties<FoobarPunctuated, {splitOnPunctuation: true}>;
expectType<{helloworld1: {'foo::Bar': string}}>(fooBarPunctuatedSplit);
