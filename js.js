


console.log("Firebase conectado");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
getFirestore,
collection,
addDoc,
deleteDoc,
doc,
updateDoc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

/* CONFIG FIREBASE */
const firebaseConfig = {
  apiKey: "AIzaSyD_oVYa7u98-j48AdJBUNKqImIptlafCfM",
  authDomain: "transporte-escolar-56fd0.firebaseapp.com",
  projectId: "transporte-escolar-56fd0",
  storageBucket: "transporte-escolar-56fd0.firebasestorage.app",
  messagingSenderId: "361343110638",
  appId: "1:361343110638:web:b729f0408f93519127d2ff",
  measurementId: "G-T3LFBWLB27"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* REFERENCIAS */
const studentsRef = collection(db, "students");
const expensesRef = collection(db, "expenses");

const monthsList = [
"Jan","Fev","Mar","Abr","Mai","Jun",
"Jul","Ago","Set","Out","Nov","Dez"
];

let students = [];
let expenses = [];

/* ========================= */
/* REALTIME (ATUALIZA AUTOMATICO) */
/* ========================= */

onSnapshot(studentsRef, (snapshot) => {
students = snapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}));
renderStudents();
});

onSnapshot(expensesRef, (snapshot) => {
expenses = snapshot.docs.map(doc => ({
id: doc.id,
...doc.data()
}));
renderExpenses();
});

/* ========================= */
/* RENDER */
/* ========================= */

function renderStudents() {

const table = document.getElementById("studentTable");
table.innerHTML = "";

const search =
document.getElementById("search").value.toLowerCase();

students.forEach((s, index) => {

const text =
`${s.nome} ${s.pais} ${s.idade} ${s.bairro}`.toLowerCase();

if (!text.includes(search)) return;

const monthsHtml =
monthsList.map((m, i) => `

<label>
<input
type="checkbox"
${s.meses[i] ? "checked" : ""}
onchange="toggleMonth('${s.id}', ${i})"
>
${m}
</label>

`).join("");

const row = document.createElement("tr");

row.innerHTML = `
<td>${s.nome}</td>
<td>${s.pais}</td>
<td>${s.idade}</td>
<td>${s.bairro}</td>
<td>R$ ${s.valor}</td>

<td class="months">${monthsHtml}</td>

<td>
<span class="delete-btn" style="background: orange"
onclick="editStudent('${s.id}')">✏️</span>
</td>

<td>
<span class="delete-btn"
onclick="deleteStudent('${s.id}')">🗑</span>
</td>
`;

table.appendChild(row);

});

updateTotals();
}

function renderExpenses() {

const table = document.getElementById("expenseTable");
table.innerHTML = "";

expenses.forEach((e) => {

const row = document.createElement("tr");

row.innerHTML = `
<td>${e.desc}</td>
<td>R$ ${e.valor}</td>
<td>
<span class="delete-btn"
onclick="deleteExpense('${e.id}')">🗑</span>
</td>
`;

table.appendChild(row);

});

updateTotals();
}

/* ========================= */
/* TOTAL */
/* ========================= */

function updateTotals() {

let totalStudents =
students.reduce((sum, s) => sum + Number(s.valor), 0);

let totalExpenses =
expenses.reduce((sum, e) => sum + Number(e.valor), 0);

let saldo = totalStudents - totalExpenses;

document.getElementById("totalAlunos").innerText =
"Total recebido: R$ " + totalStudents.toFixed(2);

document.getElementById("totalDespesas").innerText =
"Despesas: R$ " + totalExpenses.toFixed(2);

document.getElementById("saldoFinal").innerText =
saldo >= 0
? "Lucro: R$ " + saldo.toFixed(2)
: "Prejuízo: R$ " + saldo.toFixed(2);
}

/* ========================= */
/* CRUD STUDENTS */
/* ========================= */

window.deleteStudent = async (id) => {
if (confirm("Excluir aluno?")) {
await deleteDoc(doc(db, "students", id));
}
};

window.toggleMonth = async (id, monthIndex) => {

const aluno = students.find(s => s.id === id);

aluno.meses[monthIndex] = !aluno.meses[monthIndex];

await updateDoc(doc(db, "students", id), {
meses: aluno.meses
});
};

window.editStudent = async (id) => {

const aluno = students.find(s => s.id === id);

let nome = prompt("Nome:", aluno.nome);
if (!nome) return;

await updateDoc(doc(db, "students", id), {
nome
});
};

/* ========================= */
/* CRUD EXPENSES */
/* ========================= */

window.deleteExpense = async (id) => {
if (confirm("Excluir despesa?")) {
await deleteDoc(doc(db, "expenses", id));
}
};

/* ========================= */
/* FORM */
/* ========================= */

document.getElementById("studentForm")
.addEventListener("submit", async function(e){

e.preventDefault();

await addDoc(studentsRef, {
nome: nome.value,
pais: pais.value,
idade: idade.value,
bairro: bairro.value,
valor: valor.value,
meses: new Array(12).fill(false)
});

this.reset();
});

document.getElementById("expenseForm")
.addEventListener("submit", async function(e){

e.preventDefault();

await addDoc(expensesRef, {
desc: descDespesa.value,
valor: valorDespesa.value
});

this.reset();
});

/* PESQUISA */
document.getElementById("search")
.addEventListener("input", renderStudents);