import {expectType} from 'tsd';
import type {SplitDottedPath} from '../source/set-property';

// Test SplitDottedPath
expectType<SplitDottedPath<''>>(['']);
expectType<SplitDottedPath<' '>>([' ']);
expectType<SplitDottedPath<'  '>>(['  ']);
expectType<SplitDottedPath<'root'>>(['root']);
expectType<SplitDottedPath<'root.child'>>(['root', 'child']);
expectType<SplitDottedPath<'root.child[0]'>>(['root', 'child', 0]);
expectType<SplitDottedPath<'root.child.0'>>(['root', 'child', '0']);
expectType<SplitDottedPath<'root.child\\.0'>>(['root', 'child.0']);
expectType<SplitDottedPath<'root.child[0].child'>>(['root', 'child', 0, 'child']);
expectType<SplitDottedPath<'root.child.0.child'>>(['root', 'child', '0', 'child']);
expectType<SplitDottedPath<'root.child\\.0.child'>>(['root', 'child.0', 'child']);

expectType<SplitDottedPath<'0'>>(['0']);
expectType<SplitDottedPath<'[0]'>>([0]);
expectType<SplitDottedPath<'[0][42]'>>([0, 42]);
expectType<SplitDottedPath<'[0][42].child.0'>>([0, 42, 'child', '0']);
expectType<SplitDottedPath<'items[0][1].2[3].4.5'>>(['items', 0, 1, '2', 3, '4', '5']);
