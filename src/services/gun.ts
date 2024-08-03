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
  peers: [
    "http://localhost:8765/gun",
    "https://fuzzy-puma-6.telebit.io/gun",
    "https://wrongly-viable-bird.ngrok-free.app/gun",
    "https://gundb-multiserver.glitch.me/openhouse",
    "https://wrongly-viable-bird.ngrok-free.app/gun",
  ],
});

export const user = db.user().recall({ sessionStorage: true });

export const sea = Gun.SEA;
