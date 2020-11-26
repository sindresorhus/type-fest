import {expectType} from 'tsd';
import {QueryResult} from '../ts41';

declare function querySelector<T extends string>(query: T): QueryResult<T>;

expectType<HTMLAnchorElement>(querySelector('div.banner > a.call-to-action'));
expectType<HTMLInputElement | HTMLDivElement>(querySelector('input, div'));
expectType<SVGCircleElement>(querySelector('circle[cx="150"]'));
expectType<HTMLButtonElement>(querySelector('button#buy-now'));
expectType<HTMLParagraphElement>(querySelector('section p:first-of-type'));
