import * as admin from "firebase-admin";
import path from "path";
import { FastifyReply, FastifyRequest } from "fastify";
import fs from "fs";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
const serviceAccountPath = path.join(__dirname, "../../firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});
// }

const firebaseConfig = {
  apiKey: "AIzaSyBWu0lfiKRkDz-jqYaz7Shaev_XHPmzohE",
  authDomain: "fuelbuddytask.firebaseapp.com",
  projectId: "fuelbuddytask",
  storageBucket: "fuelbuddytask.firebasestorage.app",
  messagingSenderId: "628115594674",
  appId: "1:628115594674:web:31eaadf0ebdc2f1c9d58ab",
  measurementId: "G-K1XWWVVRDQ",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const adminAuth = admin.auth();
export async function verifyToken(req: any, reply: FastifyReply) {
  const authHeader = req.headers.authorization;
  const token = req.headers.authorization?.split(" ")[1];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    reply.status(401).send({ message: "Unauthorized: Missing token" });
    return;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    console.log("Firebase Auth Success:", decodedToken);
    req.user = decodedToken; // Attach user info to request
  } catch (error) {
    console.error("Firebase Auth Error:", error);
    reply.status(401).send({ message: "Unauthorized: Invalid token" });
  }
}
