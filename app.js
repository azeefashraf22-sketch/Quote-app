import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore,
  doc,
  serverTimestamp,
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
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

const quoteInput = document.getElementById("quoteInput");
const addbtn = document.getElementById("addBtn");
const quoteList = document.getElementById("quoteList");

const quoteCollection = collection(db, "quotes");
const q = query(quoteCollection, orderBy("time", "desc"));

//  1. Real-time Listener
onSnapshot(q, (snapshot) => {
  quoteList.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const id = docSnap.id;
    const data = docSnap.data();

    const li = document.createElement("li");
    li.innerHTML = `
            <span>${data.quote}</span>
            <div class="actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

    // Buttons ke Events
    li.querySelector(".edit-btn").onclick = () => editQuote(id, data.quote);
    li.querySelector(".delete-btn").onclick = () => deleteQuote(id);

    quoteList.appendChild(li);
  });
});

//  2. Add Quote 
addbtn.onclick = async () => {
  if (quoteInput.value.trim() === "") return;
  await addDoc(quoteCollection, {
    quote: quoteInput.value,
    time: serverTimestamp(),
  });
  quoteInput.value = "";
};

//  3. Edit Quote 
async function editQuote(id, oldQuote) {
  const newQuote = prompt("Enter new quote:", oldQuote);
  if (newQuote && newQuote !== oldQuote) {
    const docRef = doc(db, "quotes", id);
    await updateDoc(docRef, { quote: newQuote });
  }
}

//  4. Delete Quote 
async function deleteQuote(id) {
  if (confirm("Are you sure?")) {
    await deleteDoc(doc(db, "quotes", id));
  }
}