import {expectType} from 'tsd';
import type {LowerCaseProperties} from '../index.d.ts';

type Input = {
	helloWorld: {fooBar: string};
	'HELLO-WORLD': string;
	'hello.world': number;
};

declare const result: LowerCaseProperties<Input>;
expectType<{
	helloworld: {fooBar: string};
	'hello-world': string;
	'hello.world': number;
}>(result);
