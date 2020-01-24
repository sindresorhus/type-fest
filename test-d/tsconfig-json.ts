import {expectType} from 'tsd';
import {TsConfigJson} from '..';

const tsConfig: TsConfigJson = {};

expectType<boolean | undefined>(tsConfig.compileOnSave);
expectType<TsConfigJson.CompilerOptions | undefined>(tsConfig.compilerOptions);
expectType<string[] | undefined>(tsConfig.exclude);
expectType<string | undefined>(tsConfig.extends);
expectType<string[] | undefined>(tsConfig.files);
expectType<string[] | undefined>(tsConfig.include);
expectType<TsConfigJson.References[] | undefined>(tsConfig.references);
expectType<TsConfigJson.TypeAcquisition | undefined>(tsConfig.typeAcquisition);
