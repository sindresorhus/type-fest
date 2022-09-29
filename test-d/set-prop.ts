import {expectAssignable} from 'tsd';
import type {SetProp} from '../index';

type Source = {name: 'nyan'; level1: {plop: 42}};

type Data0 = SetProp<Source, 'level1', number>;
expectAssignable<Data0>({name: 'nyan', level1: 42});

type Data1 = SetProp<Source, 'level1.level2.level3', number>;
expectAssignable<Data1>({name: 'nyan', level1: {plop: 42, level2: {level3: 42}}});

type Data2 = SetProp<Source, 'level1.level2.0.value', number>;
expectAssignable<Data2>({name: 'nyan', level1: {plop: 42, level2: [{value: 42}]}});

type Data3 = SetProp<Source, 'level1.level2[0].value', number>;
expectAssignable<Data3>({name: 'nyan', level1: {plop: 42, level2: [{value: 42}]}});

type Data4 = SetProp<Source, 'level1.level2[0].level3[0].value', number>;
expectAssignable<Data4>({name: 'nyan', level1: {plop: 42, level2: [{level3: [{value: 42}]}]}});

type Data5 = SetProp<Source, 'level1.level2[0].level3[1].value', number>;
expectAssignable<Data5>({name: 'nyan', level1: {plop: 42, level2: [{level3: [null, {value: 42}]}]}});

type Data6 = SetProp<Source, 'level1.level2[1].level3[0].value', number>;
expectAssignable<Data6>({name: 'nyan', level1: {plop: 42, level2: [null, {level3: [{value: 42}]}]}});

type Data7 = SetProp<Source, 'level1.level2[1].level3[1].value', number>;
expectAssignable<Data7>({name: 'nyan', level1: {plop: 42, level2: [null, {level3: [null, {value: 42}]}]}});

const data = {name: 'nyan', items: {life: 42}};

type SetLifeString = SetProp<typeof data, 'items.life', '42'>;
type CreateLevels = SetProp<SetLifeString, 'items.levels', number[]>;

expectAssignable<CreateLevels>({name: 'nyan', items: {life: '42', levels: [1, 2, 3]}});
