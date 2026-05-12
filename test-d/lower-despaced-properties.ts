import {expectType} from 'tsd';
import type {LowerDespacedProperties} from '../index.d.ts';

type Foobar = {helloWorld1: {fooBar: string}};
type FoobarPunctuated = {'hello@World1': {'foo::Bar': string}};

declare const foo: LowerDespacedProperties<Foobar>;
expectType<{helloworld1: {fooBar: string}}>(foo);

declare const bar: LowerDespacedProperties<Foobar, {splitOnNumbers: true}>;
expectType<{helloworld1: {fooBar: string}}>(bar);

declare const fooBarPunctuated: LowerDespacedProperties<FoobarPunctuated>;
expectType<{'hello@world1': {'foo::Bar': string}}>(fooBarPunctuated);

declare const fooBarPunctuatedSplit: LowerDespacedProperties<FoobarPunctuated, {splitOnPunctuation: true}>;
expectType<{helloworld1: {'foo::Bar': string}}>(fooBarPunctuatedSplit);
