# ts-transform-object-spread

[![npm version](https://badge.fury.io/js/ts-transform-object-spread.svg)](https://badge.fury.io/js/ts-transform-object-spread)
[![ci status](https://github.com/felixputera/ts-transform-object-spread/workflows/Test/badge.svg)](https://github.com/felixputera/ts-transform-object-spread/actions?query=workflow%3ATest)

TypeScript transform that compiles object spread operation inside object literals into explicit property assignment.

For example

```js
const address = {
  street: "123 Sunset Drive"
};

const extendedAddress = {
  ...street,
  zipCode: 12345
};
```

This will be compiled to

```js
const address = {
  street: "123 Sunset Drive"
};

const extendedAddress = {
  street: address.street,
  zipCode: 12345
};
```

## Motivation

The spread operation and `Object.assign` (which is emitted by TS when you're targetting `ES2015`) is way slower than explicit property assignment (benchmark [here](https://jsperf.com/object-cloning-benchmark)).

If you're using latest Chrome (tested on Chrome 78), you should see that spread operation is more than **50x** faster than `Object.assign` (V8 article on that [here](https://v8.dev/blog/spread-elements)). Subsequently, explicit property assignments is more than **25x** faster than spread operation.

What's important here is the awareness of the cost of runtime object property reflection. Even if you didn't end up using this transformer, at least please write explicit object property assignments on the hot paths on your code.

This transformer was written so that we can enjoy best of both worlds, the conciseness of spread operation & the performane of explicit property assignment.

## Usage

Unfortunately, the TypeScript compiler (`tsc`) doesn't support custom transformers as of now (https://github.com/Microsoft/TypeScript/issues/14419) and as such, additional third party tool(s) must be used to achieve this functionality.

### `ttypescript` or `ts-patch`

[`ttypescript`](https://github.com/cevek/ttypescript) and [`ts-patch`](https://github.com/nonara/ts-patch) offers us a way to specify custom transformers in `tsconfig.json` (more details can be read from the respective READMEs).

```json
{
  "compilerOptions": {
    ...,
    "plugins": [
        ...,
        { "transform": "ts-transform-object-spread" }
    ]
  }
}
```

## Warning

If you don't have complete typing for your object(s), then this transformer will give you a _wrong_ result.

For example

```typescript
interface Shape {
  a: string;
  b: string;
  // c: string // actually the input has this field, but we never write it
}

function clone(input: Shape): Shape {
  return { ...input };
}

clone({ a: "a", b: "b", c: "c" }); // TS will throw an error here
clone(JSON.parse('{"a":"a","b":"b","c":"c"}')); // TS compiles this
```

On the example given above, TS will throw an error on the `clone(...)` call because it knows the shape of the input and it mismatched with the function argument interface.

However, on `clone(JSON.parse(...))` call, TS will compile it and this the behaviour of the transformed code (returns `{ a: "a", b: "b" }`) will be different than the untransformed one (returns `{ a: "a", b: "b", c: "c" }`).

## Bug or Incorrect transformation

If you do discover any bug or incorrect transformation, please don't hesitate to open an issue / PR [here](https://github.com/felixputera/ts-transform-object-spread).
