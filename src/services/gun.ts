import Gun from "gun";
import "gun/sea";
import "gun/axe";
// import "gun/lib/radisk";
// import "gun/lib/radix";
// import "gun/lib/store";
// import "gun/lib/rindexed";
// Initialize GunDB
// const gun = Gun({
//   peers: ['http://localhost:8765/gun'] // Địa chỉ peer node của bạn
// });

export const db = Gun({
  radisk: true, // Enable Radisk
  localStorage: false, // Disable localStorage to avoid conflicts
  peers: ["http://localhost:8765/gun", "http://localhost:3000/gun"],
});

export const user = db.user().recall({ sessionStorage: true });

export const sea = Gun.SEA;