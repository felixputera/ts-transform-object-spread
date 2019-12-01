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

Why? Because TypeScript knows shapes of `Object`s, and they _should_ be re-written where possible since `Object.assign` and spread operator are slower than explicit property assignment ([benchmark](https://jsperf.com/object-cloning-benchmark)).

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

## Bug or Incorrect transformation

If you do discover any bug or incorrect transformation, please don't hesitate to open an issue / PR [here](https://github.com/felixputera/ts-transform-object-spread). 
