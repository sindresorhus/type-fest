<div align="center">
	<br>
	<br>
	<img src="media/logo.svg" alt="type-fest" height="300">
	<br>
	<br>
	<b>A collection of essential TypeScript types</b>
	<br>
	<hr>
</div>
<br>
<br>

[![Build Status](https://travis-ci.com/sindresorhus/type-fest.svg?branch=master)](https://travis-ci.com/sindresorhus/type-fest)
[![](https://img.shields.io/badge/unicorn-approved-ff69b4.svg)](https://www.youtube.com/watch?v=9auOCbH5Ns4)
<!-- Commented out until they actually show anything
[![npm dependents](https://badgen.net/npm/dependents/type-fest)](https://www.npmjs.com/package/type-fest?activeTab=dependents) [![npm downloads](https://badgen.net/npm/dt/type-fest)](https://www.npmjs.com/package/type-fest)
-->

Many of the types here should have been built-in. You can help by suggesting some of them to the [TypeScript project](https://github.com/Microsoft/TypeScript/blob/master/CONTRIBUTING.md).

Either add this package as a dependency or copy-paste the needed types. No credit required. 👌

PR welcome for additional commonly needed types and docs improvements. Read the [contributing guidelines](.github/contributing.md) first.


## Install

```
$ npm install type-fest
```

*Requires TypeScript >=3.2*


## Usage

```ts
import {Except} from 'type-fest';

type Foo = {
	unicorn: string;
	rainbow: boolean;
};

type FooWithoutRainbow = Except<Foo, 'rainbow'>;
//=> {unicorn: string}
```


## API

Click the type names for complete docs.

### Basic

- [`Primitive`](source/basic.d.ts) - Matches any [primitive value](https://developer.mozilla.org/en-US/docs/Glossary/Primitive).
- [`Class`](source/basic.d.ts) - Matches a [`class` constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes).
- [`TypedArray`](source/basic.d.ts) - Matches any [typed array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray), like `Uint8Array` or `Float64Array`.
- [`JsonObject`](source/basic.d.ts) - Matches a JSON object.
- [`JsonArray`](source/basic.d.ts) - Matches a JSON array.
- [`JsonValue`](source/basic.d.ts) - Matches any valid JSON value.
- [`ObservableLike`](source/basic.d.ts) - Matches a value that is like an [Observable](https://github.com/tc39/proposal-observable).

### Utilities

- [`Except`](source/except.d.ts) - Create a type from an object type without certain keys. This is a stricter version of [`Omit`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-5.html#the-omit-helper-type).
- [`Mutable`](source/mutable.d.ts) - Convert an object with `readonly` properties into a mutable object. Inverse of `Readonly<T>`.
- [`Merge`](source/merge.d.ts) - Merge two types into a new type. Keys of the second type overrides keys of the first type.
- [`MergeExclusive`](source/merge-exclusive.d.ts) - Create a type that has mutually exclusive properties.
- [`RequireAtLeastOne`](source/require-at-least-one.d.ts) - Create a type that requires at least one of the given properties.
- [`ReadonlyDeep`](source/readonly-deep.d.ts) - Create a deeply immutable version of a `object`/`Map`/`Set`/`Array` type.
- [`LiteralUnion`](source/literal-union.d.ts) - Create a union type by combining primitive types and literal types without sacrificing auto-completion in IDEs for the literal type part of the union. Workaround for [Microsoft/TypeScript#29729](https://github.com/Microsoft/TypeScript/issues/29729).
- [`Promisable`](source/promisable.d.ts) - Create a type that represents either the value or the value wrapped in `PromiseLike`.
- [`Opaque`](source/opaque.d.ts) - Create an [opaque type](https://codemix.com/opaque-types-in-javascript/).

### Miscellaneous

- [`PackageJson`](source/package-json.d.ts) - Type for [npm's `package.json` file](https://docs.npmjs.com/creating-a-package-json-file).


## Declined types

*If we decline a type addition, we will make sure to document the better solution here.*

- [`Diff` and `Spread`](https://github.com/sindresorhus/type-fest/pull/7) - The PR author didn't provide any real-world use-cases and the PR went stale. If you think this type is useful, provide some real-world use-cases and we might reconsider.


## Tips

### Built-in types

There are many advanced types most users don't know about.

- [`Partial<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1401-L1406) - Make all properties in `T` optional.
    <details>
    <summary>
        Example
        <a href="https://typescript-play.js.org/?target=6#code/KYOwrgtgBAMg9gcxsAbsANlA3gKClAeQDMiAaPKAEWACMwFz8BRAJxbhcagDEBDAF17ocAXxw4AliH7AWRXgGNgUAHJwAJsADCcEEQkJsFXgAcTK3hGAAuKAGd+LKQgDcFEx363wEGrLf46IjIaOi28EioGG5iOArovHZ2qhrAAIJmAEJgEuiaLEb4Jk4oAsoKuvoIYCwCErq2apo6egZQALyF+FCm5pY2UABETelmg1xFnrYAzAAM8xNQQZGh4cFR6AB0xEQUIm4UFa0IABRHVbYACrws-BJCADwjLVUAfACUXfhEHFBnug4oABrYAATygcCIhBoACtgAp+JsQaC7P9ju9Prhut0joCwCZ1GUAGpCMDKTrnAwAbWRPWSyMhKWalQMAF0Dtj8BIoSd8YSZCT0GSOu1OmAQJp9CBgOpPkc7uBgBzOfwABYSOybSnVWp3XQ0sF04FgxnPFkIVkdKB84mkpUUfCxbEsYD8GogKBqjUBKBiWIAen9UGut3u6CeqReBlePXQQQA7skwMl+HAoMU4CgJJoISB0ODeOmbvwIVC1cAcIGmdpzVApDI5IpgJscNL49WMiZsrl8id3lrzScsD0zBYrLZBgAVOCUOCdwa+95uIA">
            Playground
        </a>
    </summary>

    ```typescript
    enum LogLevel {
        Off,
        Debug,
        Error,
        Fatal,
    };

    interface NodeConfig {
        appName: string;
        port: number;
        logLevel: LogLevel;
    };

    class NodeAppBuilder {
        private configuration: NodeConfig = {
            appName: 'NodeApp',
            port: 3000,
            logLevel: LogLevel.Off,
        };

        config(config: Partial<NodeConfig>) {
            for (const key of Object.keys(config)) {
                const updateValue = config[key as keyof NodeConfig];

                if (updateValue === undefined)
                    continue;

                this.configuration[key as keyof NodeConfig] = updateValue;
            }

            return this;
        }
    }

    // Partial<NodeConfig> allows us to provide only a part of the
    // NodeConfig interface.
    new NodeAppBuilder()
        .config({ appName: 'ToDoApp' });
    ```
    </details>

- [`Required<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1408-L1413) - Make all properties in `T` required.
    <details>
    <summary>
        Example
        <a href="https://typescript-play.js.org/?target=6#code/JYOwLgpgTgZghgYwgAgMIHtyLAMXVAW2QG8AoZZCAuYAGwH4AuZAZzClAHMBuc5GYFDYA5OAQhNW7Lrwq04IsROZsOIHn3EsWcTsqlqNAX1KkYAVxAIwwTK3MAjAsDAYs1vIQAUMfAQAicGBwzABKEACO5oIQACYAPG7BHn4AfACUJHwA9NnIAMoQILHIYAAWKL6EyLFBcKXopRWs0ABu0KQmpCyOzq6Yybh+XmQUVDS0zABEEAAeAAIEAA60EAB0COgEUwA0fAJCYKLi0wBS6GUgu3zyiifIU-7oENcUWjp60wASwACEaOhzLQSgBPQGlCC0WjIcQw-AoOAOQFgNaoqaddK8Ui5ZAAFRBSwg+QQHCWYEoUCg+GYzm0XGQSyphKgYBByAA5O9dBB2d1ei4kthPAQRnxxnRpnNFit1pttnsKAc7hAzhcrgrkLcjkppk8XhjeEA">
            Playground
        </a>
    </summary>

    ```typescript
    interface ContactForm {
        email?: string;
        firstName?: string;
        lastName?: string;
        message?: string;
    }

    function submitContactForm (formData: Required<ContactForm>) {
        // Send the form data to the server
    }

    submitContactForm({
        email: 'ex@mple.com',
        firstName: 'John',
        lastName: 'Doe',
        message: 'Hi! Could you tell me more about...',
    });

    // TypeScript error: missing property 'message'
    submitContactForm({
        email: 'ex@mple.com',
        firstName: 'John',
        lastName: 'Doe',
    });
    ```
    </details>

- [`Readonly<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1415-L1420) - Make all properties in `T` readonly.
    <details>
    <summary>
        Example
        <a href="https://typescript-play.js.org/?target=6#code/KYOwrgtgBAMg9gcxsAbsANlA3gKClAeQDMiAaPKAEWACMwFz8BRAJxbhcagDEBDAF17ocAXxw4AliH7AWRXgGNgsRAlkBhOCCISE2CiF4RgALigBnfiykIA3BXSoMZ+Eifp7YnAvS9z5lQQ1Fn18BS0dBDMAJWBeABMtdABPAB5XYM1tXQA+ewpwkEsWMAV+DgAKLChDY1IoRzRMERdVDQjdAEpQ-Ch+AAsJcwA6QsioAF5sGqNgesaMKBF7XsIaACtgMuGiFmBgAC9gCoGh0Y6ETpWl0XFCyygx3Vag9uy9Kera0ygAIgBZZIAZTAAAdZABBUGg37zdwvZBNYbUOh6ZZ3LQPdBtEJTEDAADugWCFSel3yAHoKVAACrJcFAhTWUH8KCsdgsMwKXggEBwVl+cy6EB9OBQPYJJLJYY4bGvFjnd7DBaYKauREYYbsjiU6kAdWUvD2UF4NEcoqgwHiElZZKgKCNElN5r8UAJylBjj8wBlZOV7kmgQ16C1bB1OCAA">
            Playground
        </a>
    </summary>

    ```typescript
    enum LogLevel {
        Off,
        Debug,
        Error,
        Fatal,
    };

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

    const config: LoggerConfig = { name: 'MySuperApp', level: LogLevel.Debug };

    const logger = new Logger(config);

    // TypeScript Error: cannot assign to readonly.
    logger.config.level = LogLevel.Error;

    // We are able to edit config variable as we please.
    config.level = LogLevel.Error;
    ```
    </details>

- [`Pick<T, K>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1422-L1427) - From `T`, pick a set of properties whose keys are in the union `K`.
    <details>
    <summary>
        Example
        <a href="https://typescript-play.js.org/?target=6#code/JYOwLgpgTgZghgYwgAgIJTMBAbFBvAKGWUzFwC5kBnMKUAcwG4iSALAVwFsAjEOYbJRp0QTFggD24COCG0GzAL4ECYAJ4AHFOkw4IABSgQAbsAgB3ZAF5k+rAGsAPDqy4ANMgBEpXJ+QAfLzAOHj4BTwA+ZgIAehjkACUZABNoZDhkbGAaZAkYdIxXCCpkdioGXJBsNRJgMhQ4EGTkVKoEOg1MKQA6Ahh2EAQukGQjJugXPUMTM3MqAAoNI1MLKkpJ3GmV8wBtAF0ASkoACQAVAFkAGQBRXE4ZMGRCYkkQHLhCvRKbZIkELge3XaEDgkFuEHu4HmnmSwGMngOzGIMAkUGQ81eOSWMwsuXy2O2VAOTxYxDi6Q0WiayAJsxIEjYDU+uCoLGUxCMYHYUBGH10LKUKkxjz5RW+oxSE2ZBmWswWOxYeFq9UonlOmggAGV2sBOiR2GBUcA4NgAISeDzBLi8fiCLwxOBUKgQMBUGKu7oAKw09D8ykOzCAA">
            Playground
        </a>
    </summary>

    ```typescript
    interface Article {
        title: string;
        thumbnail: string;
        content: string;
    }

    type ArticlePreview = Pick<Article, 'title' | 'thumbnail'>;

    // Render a list of articles using only title and description.
    function renderArticlePreviews(previews: ArticlePreview[]): HTMLElement {
        const articles = document.createElement('div');
        for (const preview of previews) {
            // append preview to the articles
        }
        return articles;
    }

    const articles = renderArticlePreviews([
        { title: 'TypeScript tutorial!', thumbnail: '/assets/ts.jpg', },
    ]);
    ```
    </details>

- [`Record<K, T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1429-L1434) - Construct a type with a set of properties `K` of type `T`.
    <details>
    <summary>
        Example
        <a href="https://typescript-play.js.org/?target=6#code/C4TwDgpgBAshC2AjCAnACgewM4Etg4wDssoBeKAIh0OFUIqgB9KATCANwgBsNIUHmFWgGMAFgFouEAIYsKAbgBQi6rRQAzacOhpUWIlADeiqFHU4UWYADlp8CAC4oVlNQDmS012lXb9py7unlAgMpYA8uoAogAefDgQhNpOhACuSKhKAL7KwkRWULR2TgBKEHkoLAA8cBno2HgExAA0ULqWRADaALoAfGRGJlCqdE49zUNsnDx8Y90Tpp1C5RJSshTdc4pZSooA9HtQ4akohTLwUKI+lxYQLFDSUIQQAO5Q9nUAdIpF8J8jKEInzAqSwogAFIYzBZfHZHJQAFIYUT0VreWH+SgAEQwEAorVC0gi0TiqASSXhAAYoFkAJS7A5QMoVe7qDAobQkEAYVKFDDDQiNaRcHAAL2gwq4UAw6kKomgYBQvFQoCgAGsICAsPtDgAVcAQADKwlcYGAUCiKCVKCcyzEkhkcigiuVKFVOBI8A9uEIbkUeWI5t+UXgZpApXK7OqtWQ9Vw+HyrTSXC4-XIxlMpgBhBSqRTC0zU24rtz+e28iAA">
            Playground
        </a>
    </summary>

    ```typescript
    type MemberPositions = 'intern' | 'developer' | 'tech-lead';

    interface Person {
        firstName: string;
        lastName: string;
        yearsOfExperience: number;
    }

    const team: Record<MemberPositions, Person[]> = {
        intern: [],
        developer: [],
        ['tech-lead']: [],
    };

    // Our team has hired a new member.
    team.intern.push({ firstName: 'John', lastName: 'Doe', yearsOfExperience: 0 });

    // Record forces you to initialize all of the property keys
    // TypeScript Error: "tech-lead" property is missing
    const teamEmpty: Record<MemberPositions, null> = {
        intern: null,
        developer: null,
    };
    ```
    </details>

- [`Exclude<T, U>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1436-L1439) - Exclude from `T` those types that are assignable to `U`.
    <details>
    <summary>
        Example
        <a href="https://typescript-play.js.org/?target=6#code/JYOwLgpgTgZghgYwgAgMIHsQ2Ac2QbwChlkBbCMAC3QBMAuZAZzClBwG5jk5GBPEBAwBG6dABsIcEJxIBXKGIbNWIDlwCOs6LyUs2nAL6FCAegBUZ5AHEKyWSGCZk6GMgDyQgFYQEYACq8AA4QAOTIANYQvIzIVHBgyBAAHpAgNMh+cFA4FAHByGYmhGBBKADSUYxuMHkQADwe3r61ADQZWTn+pQB8yAC8BFwA2hW8yKARUS7uXj5dwQC6DI1ztSNRC4kpEGkxmdm5pcgA-MijyAwgEABu0IQGQ5G80yvNpQucphbupMAJVOhGChAlB0MEoGBgBAYnEEslUukAKJJBBiWQ0CC1ApFEr5Ny-eYQUaMBqzN7BNrI1HozE9frIAAKwAQ4TqXFehJaXCpaIxdSeLzJnLOlWqtVJTWFPJptW63UI3U+uJQAGU9KoMFhcMT6cSxaU6prsDg2so2IrkCYTMgQuQATQwgAfG3yMROm2abQhYzmMzESwAMVBpEmz1cRtwDAABraKNQHchnSEePwEO6Qq7056oLwQlH-VtqRiC3qagaIyamOqcN1o7H7enM4mbSmBHmCxI4Nc2MgY620-nscUjgA5TBqlQ4Cs6gbSvkC8OYY1tUviium6tyz6+6y2TBiMYgsHQSHQ2KUeLIGjoZAgdBw7ZpWJHM2qZAwYPP-IVofK5BjkAJzYH8BnxP5amJQ0l1wDdJ0VYwEEwZhb3HasGAAoCNWgvABnwbg+AEBgWC0ZADE4IA">
            Playground
        </a>
    </summary>

    ```typescript
    interface Config {
        method: string;
        async: boolean;
        url: string;
        query: string;
    }

    /** Get union of ObjectType' keys that extend TargetType */
    type KeysOfType<ObjectType, TargetType> = {
        [Key in keyof ObjectType]: ObjectType[Key] extends TargetType ? Key : never;
    }[keyof ObjectType];


    /** Omit those properties that extend ExcludeType */
    type OmitTypeKeys<ObjectType, ExcludeType> = Pick<
        ObjectType,
        Exclude<keyof ObjectType, KeysOfType<ObjectType, ExcludeType>>
    >;

    type StringConfigKeys = KeysOfType<Config, string>; // 'method' | 'url' | 'query'

    /**
     * From keyof Config: `'method' | 'async' | 'url' | 'query'`
     * exclude
     * KeysOfType<Config, string>: `'method' | 'url' | 'async'`
     * leaving `'async'`
     */
    type NonStringConfigKeys = Exclude<keyof Config, KeysOfType<Config, string>>;

    /** Get only properties that do not extend type string from type Config */
    type NonStringConfig = OmitTypeKeys<Config, string>;

    const nonString: NonStringConfig = { async: true };
    ```
    </details>

- [`Extract<T, U>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1441-L1444) - Extract from `T` those types that are assignable to `U`.
    <details>
    <summary>
        Example
        <a href="https://typescript-play.js.org/?target=6#code/JYOwLgpgTgZghgYwgAgCoQiZBvAUM5EOAWwgC5kBnMKUAcwG59k47zCBXYgI2iYF9cuUJFiIUAQQAmHADZhkEAB6QQUymgxY8BAA5QA9jAiVKwAyArVaIRswDuBqAGsAokt3RgmJBRBdeKAEhAHoAKjDkADFDYmRnCABPDSNkAHluACsIBFREzwlkKAhiAwA3FDhZWXikjTAACzgFOGLkfRNMBQt0rJy8zwAhZDCQ3DB8ySkpYDBzIlkAaTqAHgzshDABiAkAGl6NrcnBgD5kAF5kdwRZDikIFeYExNT1nKOC3aek177N7cGuBOTFw4UiywgumQFlkiWQjQMlBQzxSMAO722hUazRYbRABgUHSR4GhWDeuWOIzGE08yAAIsAYDA1n8Pjt9uS2acLjhmABtZZw0DIaQzOYWKqCygsw6YjmsgEnAC6FE5mIFSSVuH4ILBaCgcBAlBgTji6EwyBEBhFMnkVNwMA4IE282QdEM9gAqroABSQTAUc0gfYcXRSZrsBlMlbSORgfZBk4ASgosbtOiKEDAHCgZNZADo4KZgHQQH6tCGwxGk8FcO6DF7fcxsIQSOwAEQAWQg7f2rHYAEYABzIfhfAgt-RGExmCwUdsASRAMFuPmgveQjhc7k8tDXFAADKPcDXcEA">
            Playground
        </a>
    </summary>

    ```typescript
    interface Teen {
        name: string;
        age: number;
    }

    interface Adult extends Teen {
        profession: string;
        workExperience: number;
    }

    /** From keys of ObjecTypeA remove all keys that are present on ObjecTypeB */
    type AdditionalKeys<ObjectTypeA, ObjectTypeB> = Exclude<
        keyof ObjectTypeA,
        keyof ObjectTypeB
    >;

    /** Keep only those keys of ObjectTypeA that are not present on ObjecTypeB */
    type Diff<ObjectTypeA, ObjectTypeB> = {
        [Key in AdditionalKeys<ObjectTypeA, ObjectTypeB>]: ObjectTypeA[Key]
    };

    /** Transform Teen into Adult */
    function growUp(teen: Teen, update: Diff<Adult, Teen>): Adult {
        return Object.assign(teen, update);
    }

    growUp(
        { name: "Me", age: 18 },
        { profession: "Influencer", workExperience: 0 }
    );
    ```
    </details>

- [`NonNullable<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1446-L1449) - Exclude `null` and `undefined` from `T`.
    <details>
    <summary>
        Example
        <a href="https://typescript-play.js.org/?target=6#code/C4TwDgpgBACg9gJ2AOQK4FsBGEFQLxQDOwCAlgHYDmUAPlORtrnQwDasDcAUFwPQBU-WAEMkUOADMowqAGNWwwoSgATCBIqlgpOOSjAAFsOBRSy1IQgr9cKJlSlW1mZYQA3HFH68u8xcoBlHA8EACEHJ08Aby4oKDBUTFZSWXjEFEYcAEIALihkXTR2YSSIAB54JDQsHAA+blj4xOTUsHSACkMzPKD3HHDHNQQAGjSkPMqMmoQASh7g-oihqBi4uNIpdraxPAI2VhmVxrX9AzMAOm2ppnwoAA4ABifuE4BfKAhWSyOTuK7CS7pao3AhXF5rV48E4ICDAVAIPT-cGQyG+XTEIgLMJLTx7CAAdygvRCA0iCHaMwarhJOIQjUBSHaACJHk8mYdeLwxtdcVAAOSsh58+lXdr7Dlcq7A3n3J4PEUdADMcspUE53OluAIUGVTx46oAKuAIAFZGQwCYAKIIBCILjUxaDHAMnla+iodjcIA">
            Playground
        </a>
    </summary>
    Works with <code>strictNullChecks</code> set to <code>true</code>. (Read more <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html">here</a>)

    ```typescript
    type PortNumber = string | number | null;

    /** Part of a class definition that is used to build a server */
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
        .port('8000')   // portNumber = '8000'
        .port(null)     // portNumber =  8000
        .port(3000);    // portNumber =  3000

    // TypeScript Error
    serverBuilder.portNumber = null;
    ```
    </details>

- [`Parameters<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1451-L1454) - Obtain the parameters of a function type in a tuple.
    <details>
    <summary>
        Example
        <a href="https://typescript-play.js.org/?target=6#code/PTAEHMBsHsCMENIBUAWBLAzqeA3ebJ5ZIBTUAMwCdoBbUAZgDoAWAKBFBQBcuAHDAFwgAJiRzFo4DIxpoAxtQzRyXRnNrAuAT14kMCtLy7B4AO1PQArqblpT4ALTbd+yoa4P6D5sADEzkgc5FBI5AGs7R3JoSgcoOEQudAxWdVMMLggYBGRk0ABeUAB3O2FoIoBuVnYAKhrQACFSims5LjRoU1AAA3JTbtAuaEGQ0DSuEgAPTOUshMhQOAArUMya4FZyVvbO0FhSpGgAcWzEAB4AMS6pidNhLAAKRmf4SikBbFMtAG0AXQBKAoAPk+WiBD1YoAopg+VwANJDQM9GK93qAAAqveA0EgTSgYS6mIGsf4fB6A-IggBKuMslFMSB0JEJIIA3ojKLT6dDGPs7g94jlUJg4UiXm8MP8qgBfarAOqgADCIXCoDQ5DGnQm0048CwvGoODQomEPTCJC03UYoHWm22HS6wVCYQAkuR0dReABRSaYLgYB5JTAfZarUXmrQfDJueykvbQaCkMygdlQzlcOldCNqrpBjAyuUKmkZ+lYbpcSiWEgDdVzHKLWArNq6ssAcnIuOCrYGBuguko2htGzSGTGKtd5AunZQPr9WEKfOEhxO8weTvCbo9fdnGQwooARB2uMF91LquuJ1PjzPfbvyRVQBwK1Wc6AaNBR7MkmRYNQihgSHxVggA">
            Playground
        </a>
    </summary>

    ```typescript
    /** Bind function `fn` to the context of global object */
    function bindToGlobal<Fn extends (...args: any[]) => any>(
      fn: Fn,
      ...args: Parameters<Fn>
    ): () => ReturnType<Fn> {
      return fn.bind(globalThis, ...args);
    }

    /** Check if context has provided `key`. */
    function checkIfPropExists(this: object, key: string): boolean {
        return key in this;
    }

    /** Returns `true` if global object has `'fetch'` property */
    const checkIfFetchExists = bindToGlobal(checkIfPropExists, 'fetch');

    checkIfFetchExists(); // true in most of the browsers
    ```
    </details>

- [`ConstructorParameters<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1456-L1459) - Obtain the parameters of a constructor function type in a tuple.
    <details>
    <summary>
        Example
        <a href="https://typescript-play.js.org/?target=6#code/MYGwhgzhAECCBOAXAlqApgWQPYBM0mgG8AoaaYLAO0TWoC5oJF5lKBzAblOhURDQZMW7LtwqUhAV2CIs8ABTia9Rs1ZsAND2R8Bq4WwCURbmUQALZBAB0S2omgBeclWWIuZM5Zu9+T7boe0AC+xKHE4kzQAA7wWAAeAJ4AEmCUOPzw-iRkkczSiPKm0AAqYPBsaIgMiInRaFgAZnBIqPzYeCAaxeVsEAwAwlRSMnIACuVgALZVaPAQADy19U0tKOgd+AB83Z7QlGgA7mUVVQxpidzGOZ6RWPzWIFhs8gAGAJKUOshgIMgAXupoAASQgIdbtXD4ayUaZoYLWV6GIJkeBVSTwSj7I6lXpVeTWQm9CDI7ihYKiAD0lNKdTQAGVgCxog4AKLwOLwBis+L1GRoHDQADaQnUWlF7AAulo2FgHCK1FLiLEEik0hk5rZhvkZPJwW1MFCusKAORDCQ6xCE6wm6VrA2bECk4hoXlyBx5e3ofwHQ7QMZxJJ61obI1aFVJVLpTLO31e-jyABEJTpjOZDgAzNYACzWACs1sTWkTABk0OUsSn6mnkCzoAA5LCHACEidJ1OgAHVkCACE82AwPl8UL8AUD9aHOojiEA">
            Playground
        </a>
    </summary>

    ```typescript
    class ArticleModel {
        content: string;
        title: string;

        constructor(content: string, title: string) {
            this.content = content;
            this.title = title;
        }
    }

    const proxyHandler = {
        construct(
            Target: typeof ArticleModel,
            args: ConstructorParameters<typeof ArticleModel>,
            newTarget: any
        ) {
            console.log(`Initializing ${ArticleModel.name}.`);
            return new Target(...args);
        }
    };

    // TypeScript Error: Expected [string, string], got [string]
    proxyHandler.construct(ArticleModel, ['Construct...'], ArticleModel);

    export const Article = new Proxy(ArticleModel, proxyHandler);

    new Article('TypeScript 3.4.5...', 'Learn TypeScript Now!');
    // Will log: `Initializing ArticleModel.`
    ```
    </details>

- [`ReturnType<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1461-L1464) – Obtain the return type of a function type.
    <details>
    <summary>
        Example
        <a href="https://typescript-play.js.org/?target=6#code/GYVwdgxgLglg9mABAWwIYAcCSUCmAnAHgChFEBRAGx2QBoTEAxcCRHAD1zABMBnRAChxVkALnLCAlIgC8APkSowATzqkASjiisOObnw1QQeMABUl6HASaRZRWfxi48Y7PlQAjKgUrVZNRBCoFBTuqBAA1mLWEBJiBgDaALqIAN70EAg8WmjoFlxxmkkyiEkA3ET0wHB4AhlgWazCiHDAiI74UmmkpDl5AHToIDwAFvyBwaERgpIS5aQAvhWkeJpGSL04XOWLRHUNPJoA8u4AVjjQYgDKmgRZeDBgAOby0ohgOADuiNdQ-LO7mWyGGOZwuiAAshgCGAQMh3Ph-HcHs9iu8vpD0H9ykQcq48PwDlAQecoP5+AA3MRIp5SOSIcl9B5cdiHYD8ABEDDgcHZElmiAA9AK3rD4XgkhVcU5+DlidAyfFwjgVPSgokxPEYXCEYhqY9ErT5F1ECtDMZEEqlIgAKSIABMMmkrwADIgAPyqiiIMTsw5cLjs7b8oW6qD3J4SoA">
            Playground
        </a>
    </summary>

    ```typescript
    /** Provide every element of iterable `iter` into the `callback` function and store results in an array. */
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

	mapIter(setObject, (v: string) => v.indexOf('Foo')); // number[]

    mapIter(mapObject, ([key, val]: [number, string]) => {
        return key % 2 === 0 ? val : 'Odd';
    }); // string[]
    ```
    </details>

- [`InstanceType<T>`](https://github.com/Microsoft/TypeScript/blob/2961bc3fc0ea1117d4e53bc8e97fa76119bc33e3/src/lib/es5.d.ts#L1466-L1469) – Obtain the instance type of a constructor function type.
    <details>
    <summary>
        Example
        <a href="https://typescript-play.js.org/?target=6#code/MYGwhgzhAECSAmICmBlJAnAbgS2E6A3gFDTTwD2AcuQC4AW2AdgOYAUAlAFzSbnbyEAvkWFFQkGJSQB3GMVI1sNZNwg10TZgG4S0YOUY0kh1es07d+xmvQBXYDXLpWi5UlMaWAGj0GjJ6BtNdkJdBQYIADpXZGgAXmgYpB1ScOwoq38aeN9DYxoU6GFRKzVoJjUwRjwAYXJbPPRuAFkwAAcAHgAxBodsAx9GWwBbACMMAD4cxhloVraOCyYjdAAzMDxoOut1e0d0UNIZ6WhWSPOwdGYIbiqATwBtAF0uaHudUQB6ACpv6ABpJBINqJdAbADW0Do5BOw3u5R2VTwMHIq2gAANtjZ0bkbHsnFCwJh8ONjHp0EgwEZ4JFoN9PkRVr1FAZoMwkDRYIjqkgOrosepoEgAB7+eAwAV2BxOLy6ACCVxgIrFEoMeOl6AACpcwMMORgIB1JRMiBNWKVdhruJKfOdIpdrtwFddXlzKjyACp3Nq842HaDIbL6BrZBIVGhIpB1EMYSLsmjmtWW-YhAA+qegAAYLKQLQj3ZsEsdccmnGcLor2Dn8xGedHGpEIBzEzspfsfMHDNAANTQACMVaIljV5GQkRA5DYmIpVKQAgAJARO9le33BDXIyi0YuLW2nJFGLqkOvxFB0YPdBSaLZ0IwNzyPkO8-xkGgsLh8Al427a3hWAhXwwHA8EHT5PmgAB1bAQBAANJ24adKWpft72RaBUTgRBUCAj89HAM8xCTaBjggABRQx0DuHJv25P9dCkWRZVIAAiBjoFImpmjlFBgA0NpsjadByDacgIDAEAIAAQmYpjoGYgAZSBsmGPw6DtZiiFA8CoJguDmAQmoZ2QvtUKQLdoAYmBTwgdEiCAA">
            Playground
        </a>
    </summary>

    ```typescript
    class IdleService {
        doNothing (): void {}
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
        new(...args: any[]): any;
    }

    /** Keep track how many instances of `Constr` constructor have been created. */
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
    // Will log: `Created 1 instances of IdleService class`
    const newsEntry = getInstance(News, 'New ECMAScript proposals!', 'Last month...');
    // Will log: `Created 1 instances of News class`
    ```
    </details>


You can find some examples in the [TypeScript docs](https://www.typescriptlang.org/docs/handbook/advanced-types.html#predefined-conditional-types).


## Maintainers

- [Sindre Sorhus](https://github.com/sindresorhus)
- [Jarek Radosz](https://github.com/CvX)
- [Dimitri Benin](https://github.com/BendingBender)


## License

(MIT OR CC0-1.0)
