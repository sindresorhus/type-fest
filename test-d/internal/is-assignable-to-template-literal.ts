import {expectType} from 'tsd';
import type {IsAssignableToTemplateLiteral} from '../../source/internal';

expectType<true>(null! as IsAssignableToTemplateLiteral<'foobar'>);
expectType<true>(null! as IsAssignableToTemplateLiteral<`pre${string}`>);
expectType<true>(null! as IsAssignableToTemplateLiteral<`@${number}`>);

expectType<false>(null! as IsAssignableToTemplateLiteral<string>);
expectType<false>(null! as IsAssignableToTemplateLiteral<`${string}`>);
expectType<false>(null! as IsAssignableToTemplateLiteral<Capitalize<string>>);
