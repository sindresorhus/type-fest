<div align="center">
	<br>
	<br>
	<img src="media/logo.svg" alt="type-fest" height="300">
	<br>
	<br>
	<b>TypeScript基本类型的集合</b>
	<br>
	<br>
	<br>
	<br>
	<div align="center">
		<p>
			<p>
				<sup>
					<a href="https://github.com/sponsors/sindresorhus">Sindre Sorhus的开源工作得到了社区的支持</a>
				</sup>
			</p>
			<sup>特别感谢:</sup>
			<br>
			<br>
			<a href="https://standardresume.co/tech">
				<img src="https://sindresorhus.com/assets/thanks/standard-resume-logo.svg" width="180"/>
			</a>
			<br>
			<br>
			<a href="https://workos.com/?utm_campaign=github_repo&utm_medium=referral&utm_content=type-fest&utm_source=github">
				<div>
					<img src="https://sindresorhus.com/assets/thanks/workos-logo-white-bg.svg" width="220" alt="WorkOS">
				</div>
				<b>您的应用程序，企业级应用程序</b>
				<div>
					<sub>只需几行代码就可以开始向企业客户销售。</sub>
					<br>
					<sup>在几分钟内而不是几个月内增加单点登录（以及更多）。</sup>
				</div>
			</a>
		</p>
	</div>
	<br>
	<hr>
</div>
<br>
<br>

[![](https://img.shields.io/badge/unicorn-approved-ff69b4.svg)](https://giphy.com/gifs/illustration-rainbow-unicorn-26AHG5KGFxSkUWw1i)
[![npm dependents](https://badgen.net/npm/dependents/type-fest)](https://www.npmjs.com/package/type-fest?activeTab=dependents)
[![npm downloads](https://badgen.net/npm/dt/type-fest)](https://www.npmjs.com/package/type-fest)
[![Docs](https://paka.dev/badges/v0/cute.svg)](https://paka.dev/npm/type-fest)

<hr/>

[English](./readme.md)|[中文](./readme_zh.md)

这里的许多类型都应该是内置的。你可以通过向[TypeScript 项目](https://github.com/Microsoft/TypeScript/blob/master/CONTRIBUTING.md)建议其中的一些类型来提供帮助。

要么把这个包作为依赖关系加入，要么复制粘贴需要的类型。不需要引入。 👌

欢迎对其他常用的类型和文档的改进进行 PR。请先阅读[贡献指南](.github/contributing.md)。

## Install

```
$ npm install type-fest
```

_需要 TypeScript >=3.4_

## Usage

```ts
import { Except } from "type-fest";

type Foo = {
	unicorn: string;
	rainbow: boolean;
};

type FooWithoutRainbow = Except<Foo, "rainbow">;
//=> {unicorn: string}
```

## API

点击类型名称查看完整文档。

### Basic

- [`Primitive`](source/primitive.d.ts) - 匹配任何 [原始数据类型](https://developer.mozilla.org/en-US/docs/Glossary/Primitive).
- [`Class`](source/basic.d.ts) - 匹配一个[`类`构造函数](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).
- [`TypedArray`](source/typed-array.d.ts) - 匹配任何 [数组类型](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), 如 `Uint8Array` 或 `Float64Array`.
- [`JsonObject`](source/basic.d.ts) - 匹配一个 JSON 对象.
- [`JsonArray`](source/basic.d.ts) - 匹配一个 JSON 数组.
- [`JsonValue`](source/basic.d.ts) - 匹配一个 JSON 的值.
- [`ObservableLike`](source/observable-like.d.ts) - 匹配一个像[可观察对象(Observable)](https://github.com/tc39/proposal-observable)的值.

### Utilities

- [`Except`](source/except.d.ts) - 从一个没有特定键的对象类型创建一个类型。这是[`Omit`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-5.html#the-omit-helper-type)的一个更严格的版本。
- [`Mutable`](source/mutable.d.ts) - 创建一个类型，将 `只读(readonly)` 从一个对象的全部或部分键中剥离。是 `Readonly<T>` 的逆类型。
- [`Merge`](source/merge.d.ts) - 将两个类型合并成一个新的类型。第二个类型的键覆盖第一个类型的键。
- [`MergeExclusive`](source/merge-exclusive.d.ts) - 创建一个具有互斥键的类型。
- [`RequireAtLeastOne`](source/require-at-least-one.d.ts) - 创建一个至少需要一个给定键的类型。
- [`RequireExactlyOne`](source/require-exactly-one.d.ts) - 创建一个类型，该类型正好需要一个给定的键，不允许更多的键。
- [`PartialDeep`](source/partial-deep.d.ts) - 创建另一个类型的深度可选版本。如果你只需要一个层次的深度，请使用[`Partial<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1401-L1406)。
- [`ReadonlyDeep`](source/readonly-deep.d.ts) - 创建一个深度不可变的`object`/`Map`/`Set`/`Array`类型。如果你只需要一个级别的深度，请使用[`Readonly<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1415-L1420)。
- [`LiteralUnion`](source/literal-union.d.ts) - 通过结合原始类型和文字类型创建联合类型，而不牺牲 IDE 中对联合的文字类型部分的自动补全。针对 [Microsoft/TypeScript#29729](https://github.com/Microsoft/TypeScript/issues/29729) 的解决方法。
- [`Promisable`](source/promisable.d.ts) - 创建一个类型，代表值或用`PromiseLike`包裹的值。
- [`Opaque`](source/opaque.d.ts) - 创建一个[不透明的类型(opaque type)](https://codemix.com/opaque-types-in-javascript/).
- [`SetOptional`](source/set-optional.d.ts) - 创建一个类型，使给定的键成为可选的。
- [`SetRequired`](source/set-required.d.ts) - 创建一个类型，使给定的键成为必选的。
- [`ValueOf`](source/value-of.d.ts) - 创建一个给定对象的值的联合类型，并可以选择指定从哪个键获取值。
- [`PromiseValue`](source/promise-value.d.ts) - 返回被包裹在`Promise`中的类型。
- [`AsyncReturnType`](source/async-return-type.d.ts) - 解除返回 `Promise` 的函数的返回类型。
- [`ConditionalKeys`](source/conditional-keys.d.ts) - 从一个形态中提取键，其中值扩展了给定的`Condition`类型。
- [`ConditionalPick`](source/conditional-pick.d.ts) - 和`Pick`一样，只是它从一个形态中选择属性，其中的值扩展了给定的`Condition`类型。
- [`ConditionalExcept`](source/conditional-except.d.ts) - 和`Omit`一样，只是它从一个形态中删除属性，其中的值扩展了给定的`Condition`类型。
- [`UnionToIntersection`](source/union-to-intersection.d.ts) - 将一个联合类型转换为一个交叉类型。
- [`Stringified`](source/stringified.d.ts) - 创建一个类型，将给定类型的键改为`string`类型。
- [`FixedLengthArray`](source/fixed-length-array.d.ts) - 创建一个类型，代表给定类型和长度的数组。
- [`IterableElement`](source/iterable-element.d.ts) - 获取一个`Iterable`/`AsyncIterable`的元素类型。例如，一个数组(array)或一个生成器(generator)。
- [`Entry`](source/entry.d.ts) -创建一个类型，代表一个集合的条目的类型。
- [`Entries`](source/entries.d.ts) - 创建一个类型，代表一个集合的条目的类型。
- [`SetReturnType`](source/set-return-type.d.ts) - 创建一个函数类型，其返回类型由你选择，参数与给定的函数类型相同。
- [`Asyncify`](source/asyncify.d.ts) - 创建一个给定函数类型的异步版本。
- [`Simplify`](source/simplify.d.ts) - 扁平化类型输出以改善编辑器中显示的类型提示。

### Template literal types

_Note:_ 这些需要[TypeScript 4.1 或更新的版本](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/#template-literal-types).

- [`CamelCase`](ts41/camel-case.d.ts) – 将一个字符串字转换为小驼峰式写法(`fooBar`)。
- [`CamelCasedProperties`](ts41/camel-cased-properties.d.ts) – 将一个对象属性转换为小驼峰式写法(`fooBar`)。
- [`CamelCasedPropertiesDeep`](ts41/camel-cased-properties-deep.d.ts) – 递归地将对象属性转换为小驼峰式写法(`fooBar`)。
- [`KebabCase`](ts41/kebab-case.d.ts) – 将一个字符串字转换为烤串式写法(`foo-bar`).
- [`KebabCasedProperties`](ts41/kebab-cased-properties.d.ts) – 将一个对象属性转换为烤串式写法(`foo-bar`).
- [`KebabCasedPropertiesDeep`](ts41/kebab-cased-properties-deep.d.ts) – 递归地将对象属性转换为烤串式写法 (`foo-bar`).
- [`PascalCase`](ts41/pascal-case.d.ts) – 将一个字符串字转换为大驼峰式写法 (`FooBar`)
- [`PascalCasedProperties`](ts41/pascal-cased-properties.d.ts) – 将一个对象属性转换为大驼峰式写法 (`FooBar`)
- [`PascalCasedPropertiesDeep`](ts41/pascal-cased-properties-deep.d.ts) – 递归地将对象属性转换为大驼峰式写法 (`FooBar`)
- [`SnakeCase`](ts41/snake-case.d.ts) – 将一个字符串字转换为小蛇式写法 (`foo_bar`).
- [`SnakeCasedProperties`](ts41/snake-cased-properties-deep.d.ts) – 将一个对象属性转换为小蛇式写法 ((`foo_bar`).
- [`SnakeCasedPropertiesDeep`](ts41/snake-cased-properties-deep.d.ts) – 递归地将对象属性转换为小蛇式写法 (`foo_bar`).
- [`ScreamingSnakeCase`](ts41/screaming-snake-case.d.ts) - 将一个字符串字头转换为大蛇式写法 (`FOO_BAR`).
- [`DelimiterCase`](ts41/delimiter-case.d.ts) – 将一个字符串字头转换为一个自定义的字符串分隔符小写。
- [`DelimiterCasedProperties`](ts41/delimiter-cased-properties.d.ts) – 将对象属性转换为自定义字符串分隔符的小写。
- [`DelimiterCasedPropertiesDeep`](ts41/delimiter-cased-properties-deep.d.ts) – 递归地将对象属性转换为自定义的字符串分隔符。
- [`Split`](ts41/split.d.ts) - 代表一个使用给定字符或字符集分割的字符串数组。
- [`Trim`](ts41/trim.d.ts) - 从一个字符串中删除前面和尾部的空格。
- [`Get`](ts41/get.d.ts) - 使用关键路径从一个对象中获取一个深度嵌套的属性，就像[Lodash 的`.get()`](https://lodash.com/docs/latest#get) 方法。
- [`LastArrayElement`](ts41/last-array-element.d.ts) - 提取一个数组中最后一个元素的类型。

### Miscellaneous

- [`PackageJson`](source/package-json.d.ts) - 用于 [npm 的 `package.json` 文件](https://docs.npmjs.com/creating-a-package-json-file)的类型。
- [`TsConfigJson`](source/tsconfig-json.d.ts) - 用于 [Typescript 的 `tsconfig.json` 文件](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)的类型 (TypeScript 3.7).

## Declined types

_如果我们拒绝一个类型的增加，我们将确保在这里记录更好的解决方案。_

- [`Diff` and `Spread`](https://github.com/sindresorhus/type-fest/pull/7) - PR 作者没有提供任何真实场景中的使用案例，并且该 PR 已经过时了。如果你认为这种类型是有用的，请提供一些真实场景的使用案例，我们可能会重新考虑。
- [`Dictionary`](https://github.com/sindresorhus/type-fest/issues/33) - 你只需从[`Record`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1429-L1434)中保存几个字符(`Dictionary<number>` vs `Record<string, number>`)，它更灵活，更出名。另外，你不应该用一个对象作为一个字典。我们现在在 JavaScript 中有`Map`。
- [`ExtractProperties` and `ExtractMethods`](https://github.com/sindresorhus/type-fest/pull/4) - 这些类型违反了单一责任原则。相反，将你的类型细化为更细化的类型层次。

## Tips

### Related

- [typed-query-selector](https://github.com/g-plane/typed-query-selector) - 增强`document.querySelector`和`document.querySelectorAll`的模板字面类型，匹配从 HTML 元素查询选择器返回的元素类型。

### Built-in types

有许多先进的类型是大多数用户不知道的。

- [`Partial<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1401-L1406) - 让`T`中的所有属性都是可选的。
  <details>
  <summary>
  		Example
  </summary>

  [Playground](https://www.typescriptlang.org/play/#code/JYOwLgpgTgZghgYwgAgHIHsAmEDC6QzADmyA3gLABQyycADnanALYQBcyAzmFKEQNxUaddFDAcQAV2YAjaIMoBfKlQQAbOJ05osEAIIMAQpOBrsUMkOR1eANziRkCfISKSoD4Pg4ZseAsTIALyW1DS0DEysHADkvvoMMQA0VsKi4sgAzAAMuVaKClY2wPaOknSYDrguADwA0sgQAB6QIJjaANYQAJ7oMDp+LsQAfAAUXd0cdUnI9mo+uv6uANp1ALoAlKHhyGAAFsCcAHTOAW4eYF4gyxNrwbNwago0ypRWp66jH8QcAApwYmAjxq8SWIy2FDCNDA3ToKFBQyIdR69wmfQG1TOhShyBgomQX3w3GQE2Q6IA8jIAFYQBBgI4TTiEs5bTQYsFInrLTbbHZOIlgZDlSqQABqj0kKBC3yINx6a2xfOQwH6o2FVXFaklwSCIUkbQghBAEEwENSfNOlykEGefNe5uhB2O6sgS3GPRmLogmslG1tLxUOKgEDA7hAuydtteryAA)

  ```ts
  interface NodeConfig {
  	appName: string;
  	port: number;
  }

  class NodeAppBuilder {
  	private configuration: NodeConfig = {
  		appName: "NodeApp",
  		port: 3000,
  	};

  	private updateConfig<Key extends keyof NodeConfig>(
  		key: Key,
  		value: NodeConfig[Key]
  	) {
  		this.configuration[key] = value;
  	}

  	config(config: Partial<NodeConfig>) {
  		type NodeConfigKey = keyof NodeConfig;

  		for (const key of Object.keys(config) as NodeConfigKey[]) {
  			const updateValue = config[key];

  			if (updateValue === undefined) {
  				continue;
  			}

  			this.updateConfig(key, updateValue);
  		}

  		return this;
  	}
  }

  // `Partial<NodeConfig>`` 允许我们只提供NodeConfig接口的一部分。
  new NodeAppBuilder().config({ appName: "ToDoApp" });
  ```

  </details>

- [`Required<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1408-L1413) - 使`T`中的所有属性成为必选的。
  <details>
  <summary>
  		Example
  </summary>

  [Playground](https://typescript-play.js.org/?target=6#code/AQ4SwOwFwUwJwGYEMDGNgGED21VQGJZwC2wA3gFCjXAzFJgA2A-AFzADOUckA5gNxUaIYjA4ckvGG07c+g6gF8KQkAgCuEFFDA5O6gEbEwUbLm2ESwABQIixACJIoSdgCUYAR3Vg4MACYAPGYuFvYAfACU5Ko0APRxwADKMBD+wFAAFuh2Vv7OSBlYGdmc8ABu8LHKsRyGxqY4oQT21pTCIHQMjOwA5DAAHgACxAAOjDAAdChYxL0ANLHUouKSMH0AEmAAhJhY6ozpAJ77GTCMjMCiV0ToSAb7UJPPC9WRgrEJwAAqR6MwSRQPFGUFocDgRHYxnEfGAowh-zgUCOwF6KwkUl6tXqJhCeEsxDaS1AXSYfUGI3GUxmc0WSneQA)

  ```ts
  interface ContactForm {
  	email?: string;
  	message?: string;
  }

  function submitContactForm(formData: Required<ContactForm>) {
  	// 将表单数据发送到服务器。
  }

  submitContactForm({
  	email: "ex@mple.com",
  	message: "Hi! Could you tell me more about…",
  });

  // TypeScript error: 缺少 'message' 属性
  submitContactForm({
  	email: "ex@mple.com",
  });
  ```

  </details>

- [`Readonly<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1415-L1420) - 使`T`中的所有属性都是只读的。
  <details>
  <summary>
  		Example
  </summary>

  [Playground](https://typescript-play.js.org/?target=6#code/AQ4UwOwVwW2AZA9gc3mAbmANsA3gKFCOAHkAzMgGkOJABEwAjKZa2kAUQCcvEu32AMQCGAF2FYBIAL4BufDRABLCKLBcywgMZgEKZOoDCiCGSXI8i4hGEwwALmABnUVxXJ57YFgzZHSVF8sT1BpBSItLGEnJz1kAy5LLy0TM2RHACUwYQATEywATwAeAITjU3MAPnkrCJMXLigtUT4AClxgGztKbyDgaX99I1TzAEokr1BRAAslJwA6FIqLAF48TtswHp9MHDla9hJGACswZvmyLjAwAC8wVpm5xZHkUZDaMKIwqyWXYCW0oN4sNlsA1h0ug5gAByACyBQAggAHJHQ7ZBIFoXbzBjMCz7OoQP5YIaJNYQMAAdziCVaALGNSIAHomcAACoFJFgADKWjcSNEwG4vC4ji0wggEEQguiTnMEGALWAV1yAFp8gVgEjeFyuKICvMrCTgVxnst5jtsGC4ljsPNhXxGaAWcAAOq6YRXYDCRg+RWIcA5JSC+kWdCepQ+v3RYCU3RInzRMCGwlpC19NYBW1Ye08R1AA)

  ```ts
  enum LogLevel {
  	Off,
  	Debug,
  	Error,
  	Fatal,
  }

  interface LoggerConfig {
  	name: string;
  	level: LogLevel;
  }

  class Logger {
  	config: Readonly<LoggerConfig>;

  	constructor({ name, level }: LoggerConfig) {
  		this.config = { name, level };
  		Object.freeze(this.config);
  	}
  }

  const config: LoggerConfig = {
  	name: "MyApp",
  	level: LogLevel.Debug,
  };

  const logger = new Logger(config);

  // TypeScript Error: 不能分配给只读属性。(cannot assign to read-only property.)
  logger.config.level = LogLevel.Error;

  // 我们能够随意编辑配置变量。
  config.level = LogLevel.Error;
  ```

  </details>

- [`Pick<T, K>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1422-L1427) - 从`T`中，挑选一组键值在联盟`K`中的属性。
  <details>
  <summary>
  		Example
  </summary>

  [Playground](https://typescript-play.js.org/?target=6#code/AQ4SwOwFwUwJwGYEMDGNgEE5TCgNugN4BQoZwOUBAXMAM5RyQDmA3KeSFABYCuAtgCMISMHloMmENh04oA9tBjQJjFuzIBfYrOAB6PcADCcGElh1gEGAHcKATwAO6ebyjB5CTNlwFwSxFR0BX5HeToYABNgBDh5fm8cfBg6AHIKG3ldA2BHOOcfFNpUygJ0pAhokr4hETFUgDpswywkggAFUwA3MFtgAF5gQgowKhhVKTYKGuFRcXo1aVZgbTIoJ3RW3xhOmB6+wfbcAGsAHi3kgBpgEtGy4AAfG54BWfqAPnZm4AAlZUj4MAkMA8GAGB4vEgfMlLLw6CwPBA8PYRmMgZVgAC6CgmI4cIommQELwICh8RBgKZKvALh1ur0bHQABR5PYMui0Wk7em2ADaAF0AJS0AASABUALIAGQAogR+Mp3CROCAFBBwVC2ikBpj5CgBIqGjizLA5TAFdAmalImAuqlBRoVQh5HBgEy1eDWfs7J5cjzGYKhroVfpDEhHM4MV6GRR5NN0JrtnRg6BVirTFBeHAKYmYY6QNpdB73LmCJZBlSAXAubtvczeSmQMNSuMbmKNgBlHFgPEUNwusBIPAAQlS1xetTmxT0SDoESgdD0C4aACtHMwxytLrohawgA)

  ```ts
  interface Article {
  	title: string;
  	thumbnail: string;
  	content: string;
  }

  // 从 `Article` 接口中创建新的类型。由文章的两个属性组成。`title`和`thumbnail`。
  // `ArticlePreview = {title: string; thumbnail: string}`
  type ArticlePreview = Pick<Article, "title" | "thumbnail">;

  // 只用标题和描述来呈现文章的列表。
  function renderArticlePreviews(previews: ArticlePreview[]): HTMLElement {
  	const articles = document.createElement("div");

  	for (const preview of previews) {
  		// 在文章中附加预览。
  	}

  	return articles;
  }

  const articles = renderArticlePreviews([
  	{
  		title: "TypeScript tutorial!",
  		thumbnail: "/assets/ts.jpg",
  	},
  ]);
  ```

  </details>

- [`Record<K, T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1429-L1434) - 构建一个具有`T` 类型的属性集`K` 的类型。
  <details>
  <summary>
  		Example
  </summary>

  [Playground](https://typescript-play.js.org/?target=6#code/AQ4ejYAUHsGcCWAXBMB2dgwGbAKYC2ADgDYwCeeemCaWArgE7ADGMxAhmuQHQBQoYEnJE8wALKEARnkaxEKdMAC8wAOS0kstGuAAfdQBM8ANzxlRjXQbVaWACwC0JPB0NqA3HwGgIwAJJoWozYHCxixnAsjAhStADmwESMMJYo1Fi4HMCIaPEu+MRklHj8gpqyoeHAAKJFFFTAAN4+giDYCIxwSAByHAR4AFw5SDF5Xm2gJBzdfQPD3WPxE5PAlBxdAPLYNQAelgh4aOHDaPQEMowrIAC+3oJ+AMKMrlrAXFhSAFZ4LEhC9g4-0BmA4JBISXgiCkBQABpILrJ5MhUGhYcATGD6Bk4Hh-jNgABrPDkOBlXyQAAq9ngYmJpOAAHcEOCRjAXqwYODfoo6DhakUSph+Uh7GI4P0xER4Cj0OSQGwMP8tP1hgAlX7swwAHgRl2RvIANALSA08ABtAC6AD4VM1Wm0Kow0MMrYaHYJjGYLLJXZb3at1HYnC43Go-QHQDcvA6-JsmEJXARgCDgMYWAhjIYhDAU+YiMAAFIwex0ZmilMITCGF79TLAGRsAgJYAAZRwSEZGzEABFTOZUrJ5Yn+jwnWgeER6HB7AAKJrADpdXqS4ZqYultTG6azVfqHswPBbtauLY7fayQ7HIbAAAMwBuAEoYw9IBq2Ixs9h2eFMOQYPQObALQKJgggABeYhghCIpikkKRpOQRIknAsZUiIeCttECBEP8NSMCkjDDAARMGziuIYxHwYOjDCMBmDNnAuTxA6irdCOBB1Lh5Dqpqn66tISIykawBnOCtqqC0gbjqc9DgpGkxegOliyfJDrRkAA)

  ```ts
  // 我们公司员工的职位
  type MemberPosition = "intern" | "developer" | "tech-lead";

  // 描述单个雇员属性的接口。
  interface Employee {
  	firstName: string;
  	lastName: string;
  	yearsOfExperience: number;
  }

  // 创建一个对象，将所有可能的`MemberPosition`值设置为键值。
  // 这些键将存储一个相同位置的雇员集合。
  const team: Record<MemberPosition, Employee[]> = {
  	intern: [],
  	developer: [],
  	"tech-lead": [],
  };

  // 我们的团队决定帮助约翰实现他的梦想，即成为软件开发人员。
  team.intern.push({
  	firstName: "John",
  	lastName: "Doe",
  	yearsOfExperience: 0,
  });

  // 我们的团队决定帮助约翰实现他的梦想，即成为软件开发人员。
  // TypeScript Error: "tech-lead" property is missing ("tech-lead "属性缺失)
  const teamEmpty: Record<MemberPosition, null> = {
  	intern: null,
  	developer: null,
  };
  ```

  </details>

- [`Exclude<T, U>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1436-L1439) - 从 `T` 中排除那些可分配给 `U` 的类型。
  <details>
  <summary>
  		Example
  </summary>

  [Playground](https://typescript-play.js.org/?target=6#code/JYOwLgpgTgZghgYwgAgMrQG7QMIHsQzADmyA3gFDLIAOuUYAXMiAK4A2byAPsgM5hRQJHqwC2AI2gBucgF9y5MAE9qKAEoQAjiwj8AEnBAATNtGQBeZAAooWphu26wAGmS3e93bRC8IASgsAPmRDJRlyAHoI5ABRAA8ENhYjFFYOZGVVZBgoXFFkAAM0zh5+QRBhZhYJaAKAOkjogEkQZAQ4X2QAdwALCFbaemRgXmQtFjhOMFwq9K6ULuB0lk6U+HYwZAxJnQaYFhAEMGB8ZCIIMAAFOjAANR2IK0HGWISklIAedCgsKDwCYgAbQA5M9gQBdVzFQJ+JhiSRQMiUYYwayZCC4VHPCzmSzAspCYEBWxgFhQAZwKC+FpgJ43VwARgADH4ZFQSWSBjcZPJyPtDsdTvxKWBvr8rD1DCZoJ5HPopaYoK4EPhCEQmGKcKriLCtrhgEYkVQVT5Nr4fmZLLZtMBbFZgT0wGBqES6ghbHBIJqoBKFdBWQpjfh+DQbhY2tqiHVsbjLMVkAB+ZAAZiZaeQTHOVxu9ySjxNaujNwDVHNvzqbBGkBAdPoAfkQA)

  ```ts
  interface ServerConfig {
  	port: null | string | number;
  }

  type RequestHandler = (request: Request, response: Response) => void;

  // 从 `null | string | number` 中排除 `null` 类型.
  // 如果端口等于 `null`，我们将使用默认值。
  function getPortValue(port: Exclude<ServerConfig["port"], null>): number {
  	if (typeof port === "string") {
  		return parseInt(port, 10);
  	}

  	return port;
  }

  function startServer(handler: RequestHandler, config: ServerConfig): void {
  	const server = require("http").createServer(handler);

  	const port = config.port === null ? 3000 : getPortValue(config.port);
  	server.listen(port);
  }
  ```

  </details>

- [`Extract<T, U>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1441-L1444) - 从`T`中提取可分配给`U`的类型。
  <details>
  <summary>
  		Example
  </summary>

  [Playground](https://typescript-play.js.org/?target=6#code/CYUwxgNghgTiAEAzArgOzAFwJYHtXzSwEdkQBJYACgEoAueVZAWwCMQYBuAKDDwGcM8MgBF4AXngBlAJ6scESgHIRi6ty5ZUGdoihgEABXZ888AN5d48ANoiAuvUat23K6ihMQ9ATE0BzV3goPy8GZjZOLgBfLi4Aejj4AEEICBwAdz54MAALKFQQ+BxEeAAHY1NgKAwoIKy0grr4DByEUpgccpgMaXgAaxBerCzi+B9-ZulygDouFHRsU1z8kKMYE1RhaqgAHkt4AHkWACt4EAAPbVRgLLWNgBp9gGlBs8uQa6yAUUuYPQwdgNpKM7nh7mMML4CgA+R5WABqUAgpDeVxuhxO1he0jsXGh8EoOBO9COx3BQPo2PBADckaR6IjkSA6PBqTgsMBzPsicdrEC7OJWXSQNwYvFEgAVTS9JLXODpeDpKBZFg4GCoWa8VACIJykAKiQWKy2YQOAioYikCg0OEMDyhRSy4DyxS24KhAAMjyi6gS8AAwjh5OD0iBFHAkJoEOksC1mnkMJq8gUQKDNttKPlnfrwYp3J5XfBHXqoKpfYkAOI4ansTxaeDADmoRSCCBYAbxhC6TDx6rwYHIRX5bScjA4bLJwoDmDwDkfbA9JMrVMVdM1TN69LgkTgwgkchUahqIA)

  ```ts
  declare function uniqueId(): number;

  const ID = Symbol("ID");

  interface Person {
  	[ID]: number;
  	name: string;
  	age: number;
  }

  // 只要属性键是字符串类型的，就允许改变人物数据。
  function changePersonData<
  	Obj extends Person,
  	Key extends Extract<keyof Person, string>,
  	Value extends Obj[Key]
  >(obj: Obj, key: Key, value: Value): void {
  	obj[key] = value;
  }

  // 小安德鲁出生了。
  const andrew = {
  	[ID]: uniqueId(),
  	name: "Andrew",
  	age: 0,
  };

  // 很好，我们对此没有意见。
  changePersonData(andrew, "name", "Pony");

  // 政府不喜欢你想改变身份的事实。
  changePersonData(andrew, ID, uniqueId());
  ```

  </details>

- [`NonNullable<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1446-L1449) - 从`T`中排除`null`和`undefined`。
  <details>
  <summary>
  		Example
  </summary>
  在<code>strictNullChecks</code>设置为<code>true</code>的情况下工作。(阅读更多<a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html">这里</a>)

  [Playground](https://typescript-play.js.org/?target=6#code/C4TwDgpgBACg9gJ2AOQK4FsBGEFQLxQDOwCAlgHYDmUAPlORtrnQwDasDcAUFwPQBU-WAEMkUOADMowqAGNWwwoSgATCBIqlgpOOSjAAFsOBRSy1IQgr9cKJlSlW1mZYQA3HFH68u8xcoBlHA8EACEHJ08Aby4oKDBUTFZSWXjEFEYcAEIALihkXTR2YSSIAB54JDQsHAA+blj4xOTUsHSACkMzPKD3HHDHNQQAGjSkPMqMmoQASh7g-oihqBi4uNIpdraxPAI2VhmVxrX9AzMAOm2ppnwoAA4ABifuE4BfKAhWSyOTuK7CS7pao3AhXF5rV48E4ICDAVAIPT-cGQyG+XTEIgLMJLTx7CAAdygvRCA0iCHaMwarhJOIQjUBSHaACJHk8mYdeLwxtdcVAAOSsh58+lXdr7Dlcq7A3n3J4PEUdADMcspUE53OluAIUGVTx46oAKuAIAFZGQwCYAKIIBCILjUxaDHAMnla+iodjcIA)

  ```ts
  type PortNumber = string | number | null;

  /** 用来建立服务器的类定义的一部分 */
  class ServerBuilder {
  	portNumber!: NonNullable<PortNumber>;

  	port(this: ServerBuilder, port: PortNumber): ServerBuilder {
  		if (port == null) {
  			this.portNumber = 8000;
  		} else {
  			this.portNumber = port;
  		}

  		return this;
  	}
  }

  const serverBuilder = new ServerBuilder();

  serverBuilder
  	.port("8000") // portNumber = '8000'
  	.port(null) // portNumber =  8000
  	.port(3000); // portNumber =  3000

  // TypeScript error
  serverBuilder.portNumber = null;
  ```

  </details>

- [`Parameters<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1451-L1454) - 在一个元组中获取一个函数类型的参数。
  <details>
  <summary>
  		Example
  </summary>

  [Playground](https://typescript-play.js.org/?target=6#code/GYVwdgxgLglg9mABAZwBYmMANgUwBQxgAOIUAXIgIZgCeA2gLoCUFAbnDACaIDeAUIkQB6IYgCypSlBxUATrMo1ECsJzgBbLEoipqAc0J7EMKMgDkiHLnU4wp46pwAPHMgB0fAL58+oSLARECEosLAA5ABUYG2QAHgAxJGdpVWREPDdMylk9ZApqemZEAF4APipacrw-CApEgBogkKwAYThwckQwEHUAIxxZJl4BYVEImiIZKF0oZRwiWVdbeygJmThgOYgcGFYcbhqApCJsyhtpWXcR1cnEePBoeDAABVPzgbTixFeFd8uEsClADcIxGiygIFkSEOT3SmTc2VydQeRx+ZxwF2QQ34gkEwDgsnSuFmMBKiAADEDjIhYk1Qm0OlSYABqZnYka4xA1DJZHJYkGc7yCbyeRA+CAIZCzNAYbA4CIAdxg2zJwVCkWirjwMswuEaACYmCCgA)

  ```ts
  function shuffle(input: any[]): void {
  	// 突变数组，随机改变其元素的索引。
  }

  function callNTimes<Fn extends (...args: any[]) => any>(
  	func: Fn,
  	callCount: number
  ) {
  	// 表示收到的函数参数的类型。
  	type FunctionParameters = Parameters<Fn>;

  	return function (...args: FunctionParameters) {
  		for (let i = 0; i < callCount; i++) {
  			func(...args);
  		}
  	};
  }

  const shuffleTwice = callNTimes(shuffle, 2);
  ```

  </details>

- [`ConstructorParameters<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1456-L1459) - 在一个元组中获得一个构造函数类型的参数。
  <details>
  <summary>
  		Example
  </summary>

  [Playground](https://typescript-play.js.org/?target=6#code/MYGwhgzhAECCBOAXAlqApgWQPYBM0mgG8AoaaFRENALmgkXmQDsBzAblOmCycTV4D8teo1YdO3JiICuwRFngAKClWENmLAJRFOZRAAtkEAHQq00ALzlklNBzIBfYk+KhIMAJJTEYJsDQAwmDA+mgAPAAq0GgAHnxMODCKTGgA7tCKxllg8CwQtL4AngDaALraFgB80EWa1SRkAA6MAG5gfNAB4FABPDJyCrQR9tDNyG0dwMGhtBhgjWEiGgA00F70vv4RhY3hEZXVVinpc42KmuJkkv3y8Bly8EPaDWTkhiZd7r3e8LK3llwGCMXGQWGhEOsfH5zJlsrl8p0+gw-goAAo5MAAW3BaHgEEilU0tEhmzQ212BJ0ry4SOg+kg+gBBiMximIGA0nAfAQLGk2N4EAAEgzYcYcnkLsRdDTvNEYkYUKwSdCme9WdM0MYwYhFPSIPpJdTkAAzDKxBUaZX+aAAQgsVmkCTQxuYaBw2ng4Ok8CYcotSu8pMur09iG9vuObxZnx6SN+AyUWTF8MN0CcZE4Ywm5jZHK5aB5fP4iCFIqT4oRRTKRLo6lYVNeAHpG50wOzOe1zHr9NLQ+HoABybsD4HOKXXRA1JCoKhBELmI5pNaB6Fz0KKBAodDYPAgSUTmqYsAALx4m5nC6nW9nGq14KtaEUA9gR9PvuNCjQ9BgACNvcwNBtAcLiAA)

  ```ts
  class ArticleModel {
  	title: string;
  	content?: string;

  	constructor(title: string) {
  		this.title = title;
  	}
  }

  class InstanceCache<T extends new (...args: any[]) => any> {
  	private ClassConstructor: T;
  	private cache: Map<string, InstanceType<T>> = new Map();

  	constructor(ctr: T) {
  		this.ClassConstructor = ctr;
  	}

  	getInstance(...args: ConstructorParameters<T>): InstanceType<T> {
  		const hash = this.calculateArgumentsHash(...args);

  		const existingInstance = this.cache.get(hash);
  		if (existingInstance !== undefined) {
  			return existingInstance;
  		}

  		return new this.ClassConstructor(...args);
  	}

  	private calculateArgumentsHash(...args: any[]): string {
  		// Calculate hash.
  		return "hash";
  	}
  }

  const articleCache = new InstanceCache(ArticleModel);
  const amazonArticle = articleCache.getInstance("Amazon forests burining!");
  ```

  </details>

- [`ReturnType<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1461-L1464) – 获得一个函数类型的返回类型。
  <details>
  <summary>
  		Example
  </summary>

  [Playground](https://typescript-play.js.org/?target=6#code/MYGwhgzhAECSAmICmBlJAnAbgS2E6A3gFDTTwD2AcuQC4AW2AdgOYAUAlAFzSbnbyEAvkWFFQkGJSQB3GMVI1sNZNwg10TZgG4S0YOUY0kh1es07d+xmvQBXYDXLpWi5UlMaWAGj0GjJ6BtNdkJdBQYIADpXZGgAXmgYpB1ScOwoq38aeN9DYxoU6GFRKzVoJjUwRjwAYXJbPPRuAFkwAAcAHgAxBodsAx9GWwBbACMMAD4cxhloVraOCyYjdAAzMDxoOut1e0d0UNIZ6WhWSPOwdGYIbiqATwBtAF0uaHudUQB6ACpv6ABpJBINqJdAbADW0Do5BOw3u5R2VTwMHIq2gAANtjZ0bkbHsnFCwJh8ONjHp0EgwEZ4JFoN9PkRVr1FAZoMwkDRYIjqkgOrosepoEgAB7+eAwAV2BxOLy6ACCVxgIrFEoMeOl6AACpcwMMORgIB1JRMiBNWKVdhruJKfOdIpdrtwFddXlzKjyACp3Nq842HaDIbL6BrZBIVGhIpB1EMYSLsmjmtWW-YhAA+qegAAYLKQLQj3ZsEsdccmnGcLor2Dn8xGedHGpEIBzEzspfsfMHDNAANTQACMVaIljV5GQkRA5DYmIpVKQAgAJARO9le33BDXIyi0YuLW2nJFGLqkOvxFB0YPdBSaLZ0IwNzyPkO8-xkGgsLh8Al427a3hWAhXwwHA8EHT5PmgAB1bAQBAANJ24adKWpft72RaBUTgRBUCAj89HAM8xCTaBjggABRQx0DuHJv25P9dCkWRZVIAAiBjoFImpmjlFBgA0NpsjadByDacgIDAEAIAAQmYpjoGYgAZSBsmGPw6DtZiiFA8CoJguDmAQmoZ2QvtUKQLdoAYmBTwgdEiCAA)

  ```ts
  /** 向`callback`函数提供迭代器`iter`的每个元素，并将结果存储在一个数组中。 */
  function mapIter<
  	Elem,
  	Func extends (elem: Elem) => any,
  	Ret extends ReturnType<Func>
  >(iter: Iterable<Elem>, callback: Func): Ret[] {
  	const mapped: Ret[] = [];

  	for (const elem of iter) {
  		mapped.push(callback(elem));
  	}

  	return mapped;
  }

  const setObject: Set<string> = new Set();
  const mapObject: Map<number, string> = new Map();

  mapIter(setObject, (value: string) => value.indexOf("Foo")); // number[]

  mapIter(mapObject, ([key, value]: [number, string]) => {
  	return key % 2 === 0 ? value : "Odd";
  }); // string[]
  ```

  </details>

- [`InstanceType<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1466-L1469) – 获取一个构造函数类型的实例类型。
  <details>
  <summary>
  		Example
  </summary>

  [Playground](https://typescript-play.js.org/?target=6#code/MYGwhgzhAECSAmICmBlJAnAbgS2E6A3gFDTTwD2AcuQC4AW2AdgOYAUAlAFzSbnbyEAvkWFFQkGJSQB3GMVI1sNZNwg10TZgG4S0YOUY0kh1es07d+xmvQBXYDXLpWi5UlMaWAGj0GjJ6BtNdkJdBQYIADpXZGgAXmgYpB1ScOwoq38aeN9DYxoU6GFRKzVoJjUwRjwAYXJbPPRuAFkwAAcAHgAxBodsAx9GWwBbACMMAD4cxhloVraOCyYjdAAzMDxoOut1e0d0UNIZ6WhWSPOwdGYIbiqATwBtAF0uaHudUQB6ACpv6ABpJBINqJdAbADW0Do5BOw3u5R2VTwMHIq2gAANtjZ0bkbHsnFCwJh8ONjHp0EgwEZ4JFoN9PkRVr1FAZoMwkDRYIjqkgOrosepoEgAB7+eAwAV2BxOLy6ACCVxgIrFEoMeOl6AACpcwMMORgIB1JRMiBNWKVdhruJKfOdIpdrtwFddXlzKjyACp3Nq842HaDIbL6BrZBIVGhIpB1EMYSLsmjmtWW-YhAA+qegAAYLKQLQj3ZsEsdccmnGcLor2Dn8xGedHGpEIBzEzspfsfMHDNAANTQACMVaIljV5GQkRA5DYmIpVKQAgAJARO9le33BDXIyi0YuLW2nJFGLqkOvxFB0YPdBSaLZ0IwNzyPkO8-xkGgsLh8Al427a3hWAhXwwHA8EHT5PmgAB1bAQBAANJ24adKWpft72RaBUTgRBUCAj89HAM8xCTaBjggABRQx0DuHJv25P9dCkWRZVIAAiBjoFImpmjlFBgA0NpsjadByDacgIDAEAIAAQmYpjoGYgAZSBsmGPw6DtZiiFA8CoJguDmAQmoZ2QvtUKQLdoAYmBTwgdEiCAA)

  ```ts
  class IdleService {
  	doNothing(): void {}
  }

  class News {
  	title: string;
  	content: string;

  	constructor(title: string, content: string) {
  		this.title = title;
  		this.content = content;
  	}
  }

  const instanceCounter: Map<Function, number> = new Map();

  interface Constructor {
  	new (...args: any[]): any;
  }

  // 追踪`Constr'构造函数有多少个实例被创建。
  function getInstance<
  	Constr extends Constructor,
  	Args extends ConstructorParameters<Constr>
  >(constructor: Constr, ...args: Args): InstanceType<Constr> {
  	let count = instanceCounter.get(constructor) || 0;

  	const instance = new constructor(...args);

  	instanceCounter.set(constructor, count + 1);

  	console.log(`Created ${count + 1} instances of ${Constr.name} class`);

  	return instance;
  }

  const idleService = getInstance(IdleService);
  // Will log: `创建了1个IdleService类的实例`
  const newsEntry = getInstance(
  	News,
  	"New ECMAScript proposals!",
  	"Last month..."
  );
  // Will log: `创建了1个新闻类(News class)的实例`
  ```

  </details>

- [`Omit<T, K>`](https://github.com/microsoft/TypeScript/blob/71af02f7459dc812e85ac31365bfe23daf14b4e4/src/lib/es5.d.ts#L1446) – 通过从 T 中选取所有属性，然后删除 K，构建一个类型。
  <details>
  <summary>
  		Example
  </summary>

  [Playground](https://typescript-play.js.org/?target=6#code/JYOwLgpgTgZghgYwgAgIImAWzgG2QbwChlks4BzCAVShwC5kBnMKUcgbmKYAcIFgIjBs1YgOXMpSFMWbANoBdTiW5woFddwAW0kfKWEAvoUIB6U8gDCUCHEiNkICAHdkYAJ69kz4GC3JcPG4oAHteKDABBxCYNAxsPFBIWEQUCAAPJG4wZABySUFcgJAAEzMLXNV1ck0dIuCw6EjBADpy5AB1FAQ4EGQAV0YUP2AHDy8wEOQbUugmBLwtEIA3OcmQnEjuZBgQqE7gAGtgZAhwKHdkHFGwNvGUdDIcAGUliIBJEF3kAF5kAHlML4ADyPBIAGjyBUYRQAPnkqho4NoYQA+TiEGD9EAISIhPozErQMG4AASK2gn2+AApek9pCSXm8wFSQooAJQMUkAFQAsgAZACiOAgmDOOSIJAQ+OYyGl4DgoDmf2QJRCCH6YvALQQNjsEGFovF1NyJWAy1y7OUyHMyE+yRAuFImG4Iq1YDswHxbRINjA-SgfXlHqVUE4xiAA)

  ```ts
  interface Animal {
  	imageUrl: string;
  	species: string;
  	images: string[];
  	paragraphs: string[];
  }

  // 创建新的类型，具有 ` 动物(Animal) ` 界面的所有属性。
  // 除了'图像(images)'和'段落(paragraphs)'属性之外。
  // 我们可以使用这个 类型来渲染维基条目列表的小悬停工具提示。
  type AnimalShortInfo = Omit<Animal, "images" | "paragraphs">;

  function renderAnimalHoverInfo(animals: AnimalShortInfo[]): HTMLElement {
  	const container = document.createElement("div");
  	// Internal implementation.
  	return container;
  }
  ```

  </details>

- [`Uppercase<S extends string>`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types) - 将字符串中的每个字符都转为大写字母。
  <details>
  <summary>
  	Example
  </summary>

  ```ts
  type T = Uppercase<"hello">; // 'HELLO'

  type T2 = Uppercase<"foo" | "bar">; // 'FOO' | 'BAR'

  type T3<S extends string> = Uppercase<`aB${S}`>;
  type T4 = T30<"xYz">; // 'ABXYZ'

  type T5 = Uppercase<string>; // string
  type T6 = Uppercase<any>; // any
  type T7 = Uppercase<never>; // never
  type T8 = Uppercase<42>; // Error, type 'number' does not satisfy the constraint 'string'
  ```

  </details>

- [`Lowercase<S extends string>`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types) - 将字符串中的每个字符都转为小写。
  <details>
  <summary>
  	Example
  </summary>

  ```ts
  type T = Lowercase<"HELLO">; // 'hello'

  type T2 = Lowercase<"FOO" | "BAR">; // 'foo' | 'bar'

  type T3<S extends string> = Lowercase<`aB${S}`>;
  type T4 = T32<"xYz">; // 'abxyz'

  type T5 = Lowercase<string>; // string
  type T6 = Lowercase<any>; // any
  type T7 = Lowercase<never>; // never
  type T8 = Lowercase<42>; // Error, type 'number' does not satisfy the constraint 'string'
  ```

  </details>

- [`Capitalize<S extends string>`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types) - 将一个字符串中的第一个字符转换成大写字母。
  <details>
  <summary>
  	Example
  </summary>

  ```ts
  type T = Capitalize<"hello">; // 'Hello'

  type T2 = Capitalize<"foo" | "bar">; // 'Foo' | 'Bar'

  type T3<S extends string> = Capitalize<`aB${S}`>;
  type T4 = T32<"xYz">; // 'ABxYz'

  type T5 = Capitalize<string>; // string
  type T6 = Capitalize<any>; // any
  type T7 = Capitalize<never>; // never
  type T8 = Capitalize<42>; // Error, type 'number' does not satisfy the constraint 'string'
  ```

  </details>

- [`Uncapitalize<S extends string>`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types) - 将字符串中的第一个字符转为小写。
  <details>
  <summary>
  	Example
  </summary>

  ```ts
  type T = Uncapitalize<"Hello">; // 'hello'

  type T2 = Uncapitalize<"Foo" | "Bar">; // 'foo' | 'bar'

  type T3<S extends string> = Uncapitalize<`AB${S}`>;
  type T4 = T30<"xYz">; // 'aBxYz'

  type T5 = Uncapitalize<string>; // string
  type T6 = Uncapitalize<any>; // any
  type T7 = Uncapitalize<never>; // never
  type T8 = Uncapitalize<42>; // Error, type 'number' does not satisfy the constraint 'string'
  ```

  </details>

你可以在[TypeScript docs](https://www.typescriptlang.org/docs/handbook/advanced-types.html#predefined-conditional-types)中找到一些例子。

## Maintainers

- [Sindre Sorhus](https://github.com/sindresorhus)
- [Jarek Radosz](https://github.com/CvX)
- [Dimitri Benin](https://github.com/BendingBender)
- [Pelle Wessman](https://github.com/voxpelli)

## License

(MIT OR CC0-1.0)

---

<div align="center">
	<b>
		<a href="https://tidelift.com/subscription/pkg/npm-type-fest?utm_source=npm-type-fest&utm_medium=referral&utm_campaign=readme">通过订阅Tidelift获得对该套餐的专业支持</a>
	</b>
	<br>
	<sub>
		Tidelift帮助维护者实现开源的可持续发展，同时为公司提供安全、维护和许可方面的保证，以满足其依赖性。
	</sub>
</div>
