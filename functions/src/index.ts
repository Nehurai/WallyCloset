import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// Example: Hello World
export const helloWorld = functions.https.onRequest((req, res) => {
  res.send("Hello from WallyCloset Cloud Functions! 👗🚀");
});
