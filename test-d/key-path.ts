import {expectError, expectType} from 'tsd';
import {KeyPath, PathValue} from '../ts41';

const user = {
    firstName: 'Foo',
    lastName: 'Bar',
    projects: [
        {name: 'Baz', contributors: 68},
        {name: 'Waldo', contributors: 12}
    ]
};

declare function get<T, P extends KeyPath<T>>(object: T, path: P): PathValue<T, P>;

get(user, 'projects.0.name');
expectType<string>(get(user, 'projects.0.name'));
expectType<number>(get(user, 'projects.1.contributors'));

expectError(get(user, 'projects.2.name'));
expectError(get(user, 'projects.name'));
expectError(get(user, 'name'));
