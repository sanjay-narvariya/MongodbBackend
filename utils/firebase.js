const firebaseAdmin = require('firebase-admin');

//converting base64 file to json file
const base64Decoded = Buffer.from(process.env.FIREBASE_SECRET_FILE, 'base64').toString('utf8');
const decodedJson = JSON.parse(base64Decoded);



const serviceAccount = decodedJson;

//firebase configuration
const firebaseConfig = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

console.log()

module.exports=firebaseConfig