import storage from "node-persist";

import { Accessory } from "hap-nodejs";

// Our Accessories will each have their own HAP server; we will assign ports sequentially
let targetPort = 51826;

export default (accessories: Accessory[]) => {
  console.log("HAP-NodeJS starting...");

  // Initialize our storage system
  storage.initSync();

  // Publish them all separately (as opposed to BridgedCore which publishes them behind a single Bridge accessory)
  accessories.forEach(accessory => {
    // To push Accessories separately, we'll need a few extra properties
    // @ts-ignore
    if (!accessory.username)
      throw new Error(
        "Username not found on accessory '" +
          accessory.displayName +
          "'. Core.js requires all accessories to define a unique 'username' property."
      );

    // @ts-ignore
    if (!accessory.pincode)
      throw new Error(
        "Pincode not found on accessory '" +
          accessory.displayName +
          "'. Core.js requires all accessories to define a 'pincode' property."
      );

    // publish this Accessory on the local network
    accessory.publish({
      port: targetPort++,
      // @ts-ignore
      username: accessory.username,
      // @ts-ignore
      pincode: accessory.pincode,
    });
  });

  var signals = { SIGINT: 2, SIGTERM: 15 } as Record<string, number>;
  Object.keys(signals).forEach((signal: any) => {
    process.on(signal, () => {
      for (var i = 0; i < accessories.length; i++) {
        accessories[i].unpublish();
      }

      setTimeout(() => {
        process.exit(128 + signals[signal]);
      }, 1000);
    });
  });
};
