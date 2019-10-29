import storage from "node-persist";

import {
  Accessory,
  AccessoryEventTypes,
  Bridge,
  Categories,
  uuid,
  VoidCallback,
  PublishInfo,
} from "hap-nodejs";

export default async (
  accessories: Accessory[],
  bridgeConfig: { name: string; publishInfo?: PublishInfo } = {
    name: "Node Bridge",
  }
) => {
  const { name, publishInfo } = bridgeConfig;

  console.log("HAP-NodeJS starting...");

  // Initialize our storage system
  storage.initSync();

  // Start by creating our Bridge which will host all loaded Accessories
  const bridge = new Bridge(name, uuid.generate(name));

  // Listen for bridge identification event
  bridge.on(
    AccessoryEventTypes.IDENTIFY,
    (paired: boolean, callback: VoidCallback) => {
      console.log("%s identify", name);
      callback(); // success
    }
  );

  // Add them all to the bridge
  accessories.forEach((accessory: Accessory) => {
    bridge.addBridgedAccessory(accessory);
  });

  // Publish the Bridge on the local network.
  const config = {
    username: "CC:22:3D:E3:CE:F6",
    port: 51826,
    pincode: "031-45-154",
    category: Categories.BRIDGE,
    ...(publishInfo || {}),
  };

  bridge.publish(config);

  console.log("Bridge %s is listening on port %s", name, config.port);
  console.log("Bridge Homekit PIN: %s", config.pincode);

  var signals = { SIGINT: 2, SIGTERM: 15 } as Record<string, number>;
  Object.keys(signals).forEach((signal: any) => {
    process.on(signal, function() {
      bridge.unpublish();
      setTimeout(function() {
        process.exit(128 + signals[signal]);
      }, 1000);
    });
  });
};
