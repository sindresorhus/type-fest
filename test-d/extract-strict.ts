import {expectType} from 'tsd';
import {ExtractStrict} from '../index';

type ShirtSizes = 'xxxl' | 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs' | 'xxs';

type NoLargeShirts = ExtractStrict<ShirtSizes, 'm' | 's' | 'xs' | 'xxs'>;
expectType<'m' | 's' | 'xs' | 'xxs' >('m' as NoLargeShirts);
