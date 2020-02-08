import {expectType} from 'tsd';
import {AsyncReturnType} from '..';

function asyncFunction () {
    return Promise.resolve(2);
}

type Value = AsyncReturnType<typeof asyncFunction>;

asyncFunction().then(function (value) {
    expectType<Value>(value);
});
