import { expectType } from "tsd";
import { Titleize } from "../index";

const titleFromCamel: Titleize<"fooBarIsGreat"> = "Foo Bar Is Great";
expectType<"Foo Bar Is Great">(titleFromCamel);

const titleFromKebab: Titleize<"bar-baz-is-ok"> = "Bar Baz Is Ok";
expectType<"Bar Baz Is Ok">(titleFromKebab);

const titleFromComplexKebab: Titleize<"foo-bar-abc-123"> = "Foo Bar Abc 123";
expectType<"Foo Bar Abc 123">(titleFromComplexKebab);

const titleFromSnake: Titleize<"foo_bar_abc"> = "Foo Bar Abc";
expectType<"Foo Bar Abc">(titleFromSnake);
