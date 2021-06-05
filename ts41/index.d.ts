// These are all the basic types that's compatible with all supported TypeScript versions.
export * from '../base';

// These are special types that require at least TypeScript 4.1.
export {
	CamelCase,
	CamelCase as DromedaryCase,
} from './camel-case';
export {
	CamelCasedProperties,
	CamelCasedProperties as DromedaryCasedProperties,
} from './camel-cased-properties';
export {
	CamelCasedPropertiesDeep,
	CamelCasedPropertiesDeep as DromedaryCasedPropertiesDeep,
} from './camel-cased-properties-deep';
export {
	KebabCase,
	KebabCase as DashCase,
	KebabCase as LispCase,
	KebabCase as ParamCase,
} from './kebab-case';
export {
	KebabCasedProperties,
	KebabCasedProperties as DashCasedProperties,
	KebabCasedProperties as LispCasedProperties,
	KebabCasedProperties as ParamCasedProperties,
} from './kebab-cased-properties';
export {
	KebabCasedPropertiesDeep,
	KebabCasedPropertiesDeep as DashCasedPropertiesDeep,
	KebabCasedPropertiesDeep as LispCasedPropertiesDeep,
	KebabCasedPropertiesDeep as ParamCasedPropertiesDeep,
} from './kebab-cased-properties-deep';
export {
	PascalCase,
	PascalCase as StudlyCase,
	PascalCase as UpperCamelCase,
} from './pascal-case';
export {
	PascalCasedProperties,
	PascalCasedProperties as StudlyCasedProperties,
	PascalCasedProperties as UpperCamelCasedProperties,
} from './pascal-cased-properties';
export {
	PascalCasedPropertiesDeep,
	PascalCasedPropertiesDeep as StudlyCasedPropertiesDeep,
	PascalCasedPropertiesDeep as UpperCamelCasedPropertiesDeep,
} from './pascal-cased-properties-deep';
export {
	SnakeCase,
	SnakeCase as PotholeCase,
} from './snake-case';
export {
	SnakeCasedProperties,
	SnakeCasedProperties as PotholeCasedProperties,
} from './snake-cased-properties';
export {
	SnakeCasedPropertiesDeep,
	SnakeCasedPropertiesDeep as PotholeCasedPropertiesDeep
} from './snake-cased-properties-deep';
export {
	ScreamingSnakeCase,
	ScreamingSnakeCase as ConstantCase,
	ScreamingSnakeCase as MacroCase
} from './screaming-snake-case';
export {DelimiterCase} from './delimiter-case';
export {DelimiterCasedProperties} from './delimiter-cased-properties';
export {DelimiterCasedPropertiesDeep} from './delimiter-cased-properties-deep';
export {Split} from './split';
export {Trim} from './trim';
export {Get} from './get';
export {LastArrayElement} from './last-array-element';
