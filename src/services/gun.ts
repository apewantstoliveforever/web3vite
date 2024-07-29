import Gun from 'gun';
import 'gun/sea';
import 'gun/axe';

// Initialize GunDB
// const gun = Gun({
//   peers: ['http://localhost:8765/gun'] // Địa chỉ peer node của bạn
// });

export const db = Gun({
  // peers: ['http://gunjs.herokuapp.com/gun'] // Địa chỉ peer node của bạn
});

export const user = db.user().recall({ sessionStorage: true });
