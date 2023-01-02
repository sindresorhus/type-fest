import {expectType, expectAssignable} from 'tsd';
import type {TsConfigJson} from '../index';

const tsConfig: TsConfigJson = {};

expectType<boolean | undefined>(tsConfig.compileOnSave);
expectType<TsConfigJson.CompilerOptions | undefined>(tsConfig.compilerOptions);
expectType<string[] | undefined>(tsConfig.exclude);
expectType<string | undefined>(tsConfig.extends);
expectType<string[] | undefined>(tsConfig.files);
expectType<string[] | undefined>(tsConfig.include);
expectType<TsConfigJson.References[] | undefined>(tsConfig.references);
expectType<TsConfigJson.TypeAcquisition | undefined>(tsConfig.typeAcquisition);

// Testing compilerOptions#target
type TargetOption = NonNullable<TsConfigJson.CompilerOptions['target']>;
type TargetOptionMap = {
	[ K in TargetOption ]: TargetOption
};

expectAssignable<TargetOptionMap>({
	ES3: 'ES3',
	ES5: 'ES5',
	ES6: 'ES6',
	ES2015: 'ES2015',
	ES2016: 'ES2016',
	ES2017: 'ES2017',
	ES2018: 'ES2018',
	ES2019: 'ES2019',
	ES2020: 'ES2020',
	ES2021: 'ES2021',
	ES2022: 'ES2022',
	ESNext: 'ESNext',
	// Lowercase alternatives
	es3: 'es3',
	es5: 'es5',
	es6: 'es6',
	es2015: 'es2015',
	es2016: 'es2016',
	es2017: 'es2017',
	es2018: 'es2018',
	es2019: 'es2019',
	es2020: 'es2020',
	es2021: 'es2021',
	es2022: 'es2022',
	esnext: 'esnext',
});
