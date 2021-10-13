import {expectType} from 'tsd';
import {ExcludeStrict} from '../index';

type ShirtSizes = 'xxxl' | 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs' | 'xxs';

type OnlyLargeShirts = ExcludeStrict<ShirtSizes, 'm' | 's' | 'xs' | 'xxs'>;
expectType<'xxxl' | 'xxl' | 'xl' | 'l' >('m' as OnlyLargeShirts);
