import {expectType} from 'tsd';
import type {LowerSpacedProperties} from '../index.d.ts';

type Foobar = {helloWorld1: {fooBar: string}};
type FoobarPunctuated = {'hello@World1': {'foo::Bar': string}};

declare const foo: LowerSpacedProperties<Foobar>;
expectType<{'hello world1': {fooBar: string}}>(foo);

declare const bar: LowerSpacedProperties<Foobar, {splitOnNumbers: true}>;
expectType<{'hello world 1': {fooBar: string}}>(bar);

declare const fooBarPunctuated: LowerSpacedProperties<FoobarPunctuated>;
expectType<{'hello@ world1': {'foo::Bar': string}}>(fooBarPunctuated);

declare const fooBarPunctuatedSplit: LowerSpacedProperties<FoobarPunctuated, {splitOnPunctuation: true}>;
expectType<{'hello world1': {'foo::Bar': string}}>(fooBarPunctuatedSplit);
