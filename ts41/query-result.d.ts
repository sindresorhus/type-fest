import {TakeLast} from '..';
import {Split} from './split';
import {Trim} from './trim';

/**
Matches element types returned from a query.

Use cases:
- anywhere you'd use `querySelector` or `querySelectorAll`.
- used on other element-selecting functions that are working based on CSS selectors.

If you'd like to see this integrated into TypeScript, please upvote [this issue](https://github.com/microsoft/TypeScript/issues/29037).

@example
declare function querySelector<T extends string>(query: T): QueryResult<T>;

const anchor = querySelector('div.banner > a.call-to-action') //-> HTMLAnchorElement
const div = querySelector('input, div') //-> HTMLInputElement | HTMLDivElement
const svg = querySelector('circle[cx="150"]') //-> SVGCircleElement
const button = querySelector('button#buy-now') //-> HTMLButtonElement
const paragraph = querySelector('section p:first-of-type'); //-> HTMLParagraphElement
*/
export type QueryResult<T extends string> = MatchEachElement<GetElementNames<T>>;

/** Internal helper for `QueryResult`. Strips a given modifier from a string. */
type StripModifier<V extends string, M extends string> = V extends `${infer L}${M}${infer A}` ? L : V;

/** Internal helper for `QueryResult`. Strips CSS modifiers from a string. */
type StripModifiers<V extends string> = StripModifier<StripModifier<StripModifier<StripModifier<V, '.'>, '#'>, '['>, ':'>;

/** Internal helper for `QueryResult`. Takes the last element after the given token. */
type TakeLastAfterToken<V extends string, T extends string> = StripModifiers<TakeLast<Split<Trim<V>, T>>>;

/** Internal helper for `QueryResult`. Extracts the last element from a CSS selector string. */
type GetLastElementName<V extends string> = TakeLastAfterToken<TakeLastAfterToken<V, ' '>, '>'>;

/** Internal helper for `QueryResult`. Returns an array of element names with stripped modifiers. */
type GetEachElementName<V, L extends string[] = []> =
    V extends []
        ? L
        : V extends [string]
            ? [...L, GetLastElementName<V[0]>]
            : V extends [string, ...infer R]
                ? GetEachElementName<R, [...L, GetLastElementName<V[0]>]>
                : [];

/** Internal helper for `QueryResult`. Returns an array of element names with stripped modifiers from a comma-seperated string. */
type GetElementNames<V extends string> = GetEachElementName<Split<V, ','>>;

/** Internal helper for `QueryResult`. Returns a HTML element using a CSS selector. */
type ElementByName<V extends string> =
    V extends keyof HTMLElementTagNameMap
        ? HTMLElementTagNameMap[V]
        : V extends keyof SVGElementTagNameMap
            ? SVGElementTagNameMap[V]
            : Element;

/** Internal helper for `QueryResult`. Returns an HTML element array based on CSS selector names. */
type MatchEachElement<V, L extends Element | null = null> =
    V extends []
        ? L
        : V extends [string]
            ? L | ElementByName<V[0]>
            : V extends [string, ...infer R]
                ? MatchEachElement<R, L | ElementByName<V[0]>>
                : L;
