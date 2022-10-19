import {expectTypeOf} from 'expect-type';
import type {IterableElement} from '../index';

expectTypeOf<IterableElement<ReturnType<typeof secretGenerator>>>().toEqualTypeOf<1 | 'two'>();

expectTypeOf<IterableElement<ReturnType<typeof secretGeneratorAsync>>>().toEqualTypeOf<true | Date>();

function * secretGenerator() {
	yield 1;
	yield 'two';
}

async function * secretGeneratorAsync() {
	yield true;
	yield new Date();
}
