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

Many of the types here should have been built-in.

Either add this package as a dependency or copy-paste the needed types. No credit required.

PR welcome for additional commonly needed types and docs improvements.


## Install

```
$ npm install type-fest
```


## Usage

```ts
import {Omit} from 'type-fest';

type Foo = {
	unicorn: string;
	rainbow: boolean;
};

type FooWithoutRainbow = Omit<Foo, 'rainbow'>;
//=> {unicorn: string}
```


## API

See the [types file](index.d.ts).


## License

(MIT OR CC0-1.0)
