import {expectAssignable, expectNotAssignable} from 'tsd';
import type {IfAny} from '../index';

expectAssignable<IfAny<any, number, string>>(1);

expectNotAssignable<IfAny<any, number, string>>('hello');

expectAssignable<IfAny<any, string, number>>('world');

expectNotAssignable<IfAny<any, string, number>>(2);

