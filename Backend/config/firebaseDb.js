const { initializeApp } =require("firebase/app")
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyCy3Tp6ZegD70kmEUVCqwusCBE_6Kfl59k",
  authDomain: "todoapp-8abd6.firebaseapp.com",
  projectId: "todoapp-8abd6",
  storageBucket: "todoapp-8abd6.appspot.com",
  messagingSenderId: "692523824871",
  appId: "1:692523824871:web:5cea1745d322c5f8681442",
  measurementId: "G-YTWWE9N18S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Reference and utility methods for the  database collection
const DatabaseInteractionFunctions = (collectionName) => {
  const ref = collection(db, collectionName);

  return {
    ref,

    // Add a new document to the collection
    add: async (data) => {
      try {
        const docRef = await addDoc(ref, data);
        console.log(`Document added to ${collectionName} with ID: `, docRef.id);
        return docRef;
      } catch (error) {
        console.error(`Error adding document to ${collectionName}: `, error);
        throw error;
      }
    },

    // Get all documents from the collection
    getAll: async () => {
      try {
        const querySnapshot = await getDocs(ref);
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return docs;
      } catch (error) {
        console.error(`Error fetching documents from ${collectionName}: `, error);
        throw error;
      }
    },

    // Get a specific document by ID
    getById: async (id) => {
      try {
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() };
        } else {
          console.error(`No such document in ${collectionName}`);
          return null;
        }
      } catch (error) {
        console.error(`Error fetching document from ${collectionName}: `, error);
        throw error;
      }
    },

    // Update a document by ID
    update: async (id, data) => {
      try {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, data);
        console.log(`Document in ${collectionName} updated`);
        return true;
      } catch (error) {
        console.error(`Error updating document in ${collectionName}: `, error);
        throw error;
      }
    },

    // Delete a document by ID
    delete: async (id) => {
      try {
        const docRef = doc(db, collectionName, id);
        await deleteDoc(docRef);
        console.log(`Document in ${collectionName} deleted`);
        return true;
      } catch (error) {
        console.error(`Error deleting document from ${collectionName}: `, error);
        throw error;
      }
    },
  };
};

module.exports=DatabaseInteractionFunctions;

