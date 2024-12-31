import { expectNotAssignable, expectType } from "tsd";
import { Ordinal } from "../source/ordinal";

// Basic numbers
expectType<"1st">("1st" as Ordinal<1>);
expectType<"2nd">("2nd" as Ordinal<2>);
expectType<"3rd">("3rd" as Ordinal<3>);
expectType<"4th">("4th" as Ordinal<4>);
expectType<"5th">("5th" as Ordinal<5>);

// Teen numbers (special cases)
expectType<"11th">("11th" as Ordinal<11>);
expectType<"12th">("12th" as Ordinal<12>);
expectType<"13th">("13th" as Ordinal<13>);
expectType<"14th">("14th" as Ordinal<14>);

// Larger numbers
expectType<"21st">("21st" as Ordinal<21>);
expectType<"22nd">("22nd" as Ordinal<22>);
expectType<"23rd">("23rd" as Ordinal<23>);
expectType<"24th">("24th" as Ordinal<24>);

// Larger numbers ending in 11, 12, 13
expectType<"111th">("111th" as Ordinal<111>);
expectType<"112th">("112th" as Ordinal<112>);
expectType<"113th">("113th" as Ordinal<113>);

// Large numbers
expectType<"101st">("101st" as Ordinal<101>);
expectType<"102nd">("102nd" as Ordinal<102>);
expectType<"103rd">("103rd" as Ordinal<103>);
expectType<"1001st">("1001st" as Ordinal<1001>);
expectType<"1002nd">("1002nd" as Ordinal<1002>);

// Numbers ending in 0
expectType<"10th">("10th" as Ordinal<10>);
expectType<"20th">("20th" as Ordinal<20>);
expectType<"100th">("100th" as Ordinal<100>);
expectType<"1000th">("1000th" as Ordinal<1000>);

// Very large numbers
expectType<"9999th">("9999th" as Ordinal<9999>);
expectType<"10001st">("10001st" as Ordinal<10001>);
expectType<"10002nd">("10002nd" as Ordinal<10002>);
expectType<"10003rd">("10003rd" as Ordinal<10003>);

// Larger numbers ending in teens
expectType<"211th">("211th" as Ordinal<211>);
expectType<"1012th">("1012th" as Ordinal<1012>);
expectType<"10013th">("10013th" as Ordinal<10013>);
expectType<"100014th">("100014th" as Ordinal<100014>);

// Numbers with multiple zeros
expectType<"1000000th">("1000000th" as Ordinal<1000000>);
expectType<"100001st">("100001st" as Ordinal<100001>);
expectType<"1000002nd">("1000002nd" as Ordinal<1000002>);

// Numbers ending in 21, 31, 41, etc.
expectType<"121st">("121st" as Ordinal<121>);
expectType<"131st">("131st" as Ordinal<131>);
expectType<"1041st">("1041st" as Ordinal<1041>);
expectType<"10031st">("10031st" as Ordinal<10031>);

// Numbers ending in 22, 32, 42, etc.
expectType<"122nd">("122nd" as Ordinal<122>);
expectType<"1032nd">("1032nd" as Ordinal<1032>);
expectType<"10042nd">("10042nd" as Ordinal<10042>);

// Numbers ending in 23, 33, 43, etc.
expectType<"123rd">("123rd" as Ordinal<123>);
expectType<"1033rd">("1033rd" as Ordinal<1033>);
expectType<"10043rd">("10043rd" as Ordinal<10043>);

// Very specific edge cases
expectType<"999999th">("999999th" as Ordinal<999999>);
expectType<"1000001st">("1000001st" as Ordinal<1000001>);
expectType<"1111111th">("1111111th" as Ordinal<1111111>);

// Consecutive ascending/descending patterns
expectType<"12345th">("12345th" as Ordinal<12345>);
expectType<"54321st">("54321st" as Ordinal<54321>);
expectType<"98762nd">("98762nd" as Ordinal<98762>);
expectType<"23433rd">("23433rd" as Ordinal<23433>);

// Repeating digit patterns
expectType<"11111th">("11111th" as Ordinal<11111>);
expectType<"22222nd">("22222nd" as Ordinal<22222>);
expectType<"33333rd">("33333rd" as Ordinal<33333>);
expectType<"44444th">("44444th" as Ordinal<44444>);

// Alternating patterns
expectType<"12121st">("12121st" as Ordinal<12121>);
expectType<"23232nd">("23232nd" as Ordinal<23232>);
expectType<"34343rd">("34343rd" as Ordinal<34343>);

// Numbers with internal teens
expectType<"21113th">("21113th" as Ordinal<21113>);
expectType<"31112th">("31112th" as Ordinal<31112>);
expectType<"41111th">("41111th" as Ordinal<41111>);

// Palindromic numbers
expectType<"12321st">("12321st" as Ordinal<12321>);
expectType<"45654th">("45654th" as Ordinal<45654>);
expectType<"89998th">("89998th" as Ordinal<89998>);

// Numbers with repeated digit groups
expectType<"121121st">("121121st" as Ordinal<121121>);
expectType<"232232nd">("232232nd" as Ordinal<232232>);
expectType<"343343rd">("343343rd" as Ordinal<343343>);

// Maximum likely integers
expectType<"2147483647th">("2147483647th" as Ordinal<2147483647>); // Max 32-bit int
expectType<"9007199254740991st">(
	"9007199254740991st" as Ordinal<9007199254740991>,
); // Max safe integer in JS

// Zero case
expectType<"0th">("0th" as Ordinal<0>);

// Invalid inputs
expectNotAssignable<Ordinal<-1>>("-1st");
expectNotAssignable<Ordinal<1.5>>("1.5th");

// Negative numbers (already testing -1, but could add more)
expectNotAssignable<Ordinal<-10>>("-10th");
expectNotAssignable<Ordinal<-100>>("-100th");

// Decimal numbers
expectNotAssignable<Ordinal<0.5>>("0.5th");
expectNotAssignable<Ordinal<2.75>>("2.75th");

// Edge cases around maximum safe integer
expectType<"9007199254740990th">(
	"9007199254740990th" as Ordinal<9007199254740990>,
);
expectNotAssignable<Ordinal<9007199254740992>>("9007199254740992th"); // Beyond MAX_SAFE_INTEGER
