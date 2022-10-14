import {expectType} from 'tsd';
import type {ArrayOrRecordFromPath, SplitDottedPath} from '../source/set-property';

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

// Test RecordFromTuple
const value = 42;
type Value = typeof value;

expectType<ArrayOrRecordFromPath<[''], Value>>({'': value});
expectType<ArrayOrRecordFromPath<[' '], Value>>({' ': value});
expectType<ArrayOrRecordFromPath<['  '], Value>>({'  ': value});
expectType<ArrayOrRecordFromPath<['root'], Value>>({root: value});
expectType<ArrayOrRecordFromPath<['root', 'child'], Value>>({root: {child: value}});
expectType<ArrayOrRecordFromPath<['root', 'child', 0], Value>>({root: {child: [value]}});
expectType<ArrayOrRecordFromPath<['root', 'child', '0'], Value>>({root: {child: {0: value}}});
expectType<ArrayOrRecordFromPath<['root', 'child.0'], Value>>({root: {'child.0': value}});
expectType<ArrayOrRecordFromPath<['root', 'child', 0, 'child'], Value>>({root: {child: [{child: value}]}});
expectType<ArrayOrRecordFromPath<['root', 'child', '0', 'child'], Value>>({root: {child: {0: {child: value}}}});
expectType<ArrayOrRecordFromPath<['root', 'child.0', 'child'], Value>>({root: {'child.0': {child: value}}});

expectType<ArrayOrRecordFromPath<['0'], Value>>({0: value});
expectType<ArrayOrRecordFromPath<[0], Value>>([value]);
expectType<ArrayOrRecordFromPath<[0, 0], Value>>([[value]]);
expectType<ArrayOrRecordFromPath<[0, 1], Value>>([[undefined, value]]);
expectType<ArrayOrRecordFromPath<[0, 0, 'child', '0'], Value>>([[{child: {0: value}}]]);
expectType<ArrayOrRecordFromPath<[0, 1, 'child', '0'], Value>>([[undefined, {child: {0: value}}]]);
expectType<ArrayOrRecordFromPath<['items', 0, 1, '2', 3, '4', '5'], Value>>({items: [[undefined, {2: [undefined, {4: {5: value}}]}]]});
