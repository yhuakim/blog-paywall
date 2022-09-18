// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// Import the functions you need from the SDKs you need
import { app } from 'firebase-admin';
import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import serviceAccount from "../../sunlit-charge-279900-2156e4782e9d.json";
// import { collection, addDoc, updateDoc, getDoc } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

export default async function handler(req, res) {
  const {visitorId, visitedPost} = req.body
  console.log(visitedPost, visitorId);

  if(app.length == 0 && !app.length) {
    initializeApp({
      credential: cert(serviceAccount)
    });
  }
  
  const db = getFirestore();

try {
  const visitorRef = db.collection('visitors').doc(`${visitorId}`)
  const visitorRes = visitorRef.set({
    visitedPost: FieldValue.arrayUnion(`${visitedPost}`)
  })
  res.status(200).json( {id: visitorRes.id}) 
  console.log("Document written with ID: ", visitorRes.id);
} catch (e) {
  console.error("Error adding document: ", e);
}}
