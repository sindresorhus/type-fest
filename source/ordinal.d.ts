/**
 * Convert a number literal type to its ordinal string representation.
 * 
 * @example
 * ```
 * type A = Ordinal<1>; // '1st'
 * type B = Ordinal<2>; // '2nd'
 * type C = Ordinal<3>; // '3rd'
 * type D = Ordinal<4>; // '4th'
 * type E = Ordinal<11>; // '11th'
 * type F = Ordinal<21>; // '21st'
 * ```
 * 
 * @category Template Literals
 */
export type Ordinal<N extends number> = `${N}${OrdinalSuffix<N>}`;

type OrdinalSuffix<N extends number> =
  `${N}` extends `${string}${'11' | '12' | '13'}`  // Check if number ends with 11, 12, or 13
    ? 'th'
    : `${N}` extends `${string}1`  // Check if number ends with 1
      ? 'st'
      : `${N}` extends `${string}2`  // Check if number ends with 2
        ? 'nd'
        : `${N}` extends `${string}3`  // Check if number ends with 3
          ? 'rd'
          : 'th';



