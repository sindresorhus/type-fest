import {KebabCasedProperties} from '../ts41/kebab-cased-properties';
import {expectType} from 'tsd';

declare const foo: KebabCasedProperties<{helloWorld: {fooBar: string}}>;
expectType<{'hello-world': {fooBar: string}}>(foo);

// Verify example
interface User {
	userId: number;
	userName: string;
}
const result: KebabCasedProperties<User> = {
	'user-id': 1,
	'user-name': 'Tom'
};
expectType<KebabCasedProperties<User>>(result);
