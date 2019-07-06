import {expectType, expectError} from 'tsd';
import {Stringified} from '../index.d';

declare const stringified: Stringified<{ a: number; b: string }>;
expectType<{ a: string; b: string }>(stringified);

type Car = {
	engine: string;
	speed: number;
};
expectError<Stringified<Car>>({engine: 'as', speed: 123});
expectType<Stringified<Car>>({engine: 'as', speed: '123'});
