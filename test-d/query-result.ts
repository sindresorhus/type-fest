import {expectType} from 'tsd';
import {QueryResult} from '../ts41';

declare function querySelector<T extends string>(query: T): QueryResult<T>;

expectType<HTMLAnchorElement>(querySelector('div.banner > a.call-to-action'));
expectType<HTMLInputElement | HTMLDivElement>(querySelector('input, div'));
expectType<SVGCircleElement>(querySelector('circle[cx="150"]'));
expectType<HTMLButtonElement>(querySelector('button#buy-now'));
expectType<HTMLParagraphElement>(querySelector('section p:first-of-type'));
expectType<HTMLDivElement>(querySelector('.menu #leftSide aside div.menu #leftSide aside div'));
expectType<HTMLButtonElement | HTMLButtonElement | HTMLParagraphElement>(querySelector('button#buy-now, input.input, section>p'));
expectType<HTMLVideoElement>(querySelector('.main video#trailer'));
expectType<HTMLTableRowElement>(querySelector('table.main tr'));
expectType<HTMLStyleElement>(querySelector('html style'));
expectType<HTMLSourceElement>(querySelector('.main source'));
expectType<HTMLScriptElement>(querySelector('head script[src="script-source"]'));
expectType<Element>(querySelector('.class'));
