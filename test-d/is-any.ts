import {expectAssignable, expectNotAssignable} from 'tsd';
import type {IsAny} from '../index';

expectAssignable<IsAny<number>>(false);

expectNotAssignable<IsAny<any>>(false);

expectAssignable<IsAny<any>>(true);

expectNotAssignable<IsAny<number>>(true);