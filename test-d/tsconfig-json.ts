import {expectTypeOf} from 'expect-type';
import type {TsConfigJson} from '../index';

const tsConfig: TsConfigJson = {};

expectTypeOf(tsConfig.compileOnSave).toEqualTypeOf<boolean | undefined>();
expectTypeOf(tsConfig.compilerOptions).toEqualTypeOf<TsConfigJson.CompilerOptions | undefined>();
expectTypeOf(tsConfig.exclude).toEqualTypeOf<string[] | undefined>();
expectTypeOf(tsConfig.extends).toEqualTypeOf<string | undefined>();
expectTypeOf(tsConfig.files).toEqualTypeOf<string[] | undefined>();
expectTypeOf(tsConfig.include).toEqualTypeOf<string[] | undefined>();
expectTypeOf(tsConfig.references).toEqualTypeOf<TsConfigJson.References[] | undefined>();
expectTypeOf(tsConfig.typeAcquisition).toEqualTypeOf<TsConfigJson.TypeAcquisition | undefined>();
