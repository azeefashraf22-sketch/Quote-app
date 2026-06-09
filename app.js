import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDW2N0_vb42dT0LTjmMkL9xvl02Q3G3uqw",
  authDomain: "e-commerce-cap-store.firebaseapp.com",
  projectId: "e-commerce-cap-store",
  storageBucket: "e-commerce-cap-store.firebasestorage.app",
  messagingSenderId: "966489936166",
  appId: "1:966489936166:web:1741fc06d815b8304af1e7",
  measurementId: "G-821BV5YZ47"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("db =>", db);
console.log("app =>", app);


var addbtn = document.getElementById("addBtn");
var quoteList = document.getElementById("quoteList");
addbtn.addEventListener("click", addQuote);

var quoteInput = document.getElementById("quoteInput");
const quoteCollection = collection(db, "quotes",);
async function addQuote() {
  await addDoc(quoteCollection, {
    quote: quoteInput.value,
    time: serverTimestamp(),
  });
  getQuote();
};

async function getQuote() {
  quoteList.innerHTML = ""
  const querySnapshot = await getDocs(quoteCollection);
  querySnapshot.forEach((doc) => {
    console.log("id=>", doc.id, " => ", doc.data().quote);
    const li = document.createElement("li");
    li.textContent = doc.data().quote + " ";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", function () {
      editQuote(doc.id, doc.data().quote);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteQuote(doc.id);
    });
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    quoteList.appendChild(li);
  });
}
getQuote();

async function editQuote(id, oldQuote) {
  const newQuote = await prompt("enter new quote", oldQuote);
  await updateDoc(doc(db, "quotes", id), {
    quote: newQuote,
  });
}

// deleteQuote function
async function deleteQuote(id) {
  await deleteDoc(doc(db, "quotes", id))
  getQuote()
}