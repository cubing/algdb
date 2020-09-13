const admin = require('firebase-admin');

export default {
  initialize() {
    admin.initializeApp();
  },

  db: admin.firestore(),

  admin: admin,
};