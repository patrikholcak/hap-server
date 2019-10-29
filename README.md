# hap-server

Re-exports bridge and standalone mode from [HAP-NodeJS](https://github.com/KhaosT/HAP-NodeJS) for easier consumability by end users.

## Installation

`npm i hap-server`

## Bridge example

```ts
import { Bridge } from "hap-server";

import myAccessory from "./…";

accessories = [
  myAccessory,
  …
]

Bridge(accessories);
```

You can pass a 2nd argument to `Bridge` to customize the bridge settings.

```ts
Bridge(accessories, {
  publishInfo: {
    pincode: "031-45-154",
  },
});
```

## Standalone Example

In standalone mode, every accessory will be published on the network separately and each get a port assigned, starting with `51826`.

```ts
import { Standalone } from "hap-server";

import myAccessory from "./…";
import my2ndAccessory from "./…";

accessories = [
  myAccessory,
  my2ndAccessory,
  …
]

Standalone(accessories);
```
