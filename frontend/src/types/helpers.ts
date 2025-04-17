/**
 * Creates a type that excludes `null` and `undefined` from the original type.
 * This utility ensures a value is defined (not null or undefined).
 *
 * @example
 * // Type: string
 * type DefinedString = Defined<string | null | undefined>;
 *
 * // Type: number | string
 * type DefinedUnion = Defined<number | string | null>;
 *
 * // Type: { name: string }
 * type DefinedObject = Defined<{ name: string } | null>;
 *
 * @template T - The type to remove null and undefined from
 */
export type Defined<T> = Exclude<T, null | undefined>;

/**
 * Creates a union type of all possible paths through a nested object structure using dot notation.
 *
 * @example
 * type User = {
 *   name: string;
 *   address: {
 *     street: string;
 *     city: string;
 *   };
 *   hobbies: string[];
 * };
 *
 * // Results in: "name" | "address" | "address.street" | "address.city" | "hobbies"
 * type UserPaths = NestedKeyOf<User>;
 *
 * @template ObjectType - The object type to extract paths from
 */
export type NestedKeyOf<ObjectType extends object> = {
    // Iterate through each key in the object that is a string or number
    [Key in keyof ObjectType & (string | number)]:
        // Check if the value at this key is an object
        ObjectType[Key] extends object
        // If it's an object, create a union of:
        // 1. The current key itself
        // 2. The current key followed by a dot and all nested keys
        ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
        // If it's not an object, just use the key itself
        : `${Key}`
}[keyof ObjectType & (string | number)]; // Index into the mapped type to get a union of all values