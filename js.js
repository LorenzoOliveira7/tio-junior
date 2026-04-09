const monthsList = [
"Jan","Fev","Mar","Abr","Mai","Jun",
"Jul","Ago","Set","Out","Nov","Dez"
];

function getStudents() {
return JSON.parse(localStorage.getItem("students")) || [];
}

function saveStudents(students) {
localStorage.setItem("students", JSON.stringify(students));
}

function getExpenses() {
return JSON.parse(localStorage.getItem("expenses")) || [];
}

function saveExpenses(expenses) {
localStorage.setItem("expenses", JSON.stringify(expenses));
}

function renderStudents() {

const table =
document.getElementById("studentTable");

table.innerHTML = "";

const search =
document.getElementById("search").value.toLowerCase();

getStudents().forEach((s, index) => {

const text =
`${s.nome} ${s.pais} ${s.idade} ${s.bairro}`.toLowerCase();

if (!text.includes(search)) return;

const monthsHtml =
monthsList.map((m, i) => `

<label>
<input
type="checkbox"
${s.meses[i] ? "checked" : ""}
onchange="toggleMonth(${index}, ${i})"
>
${m}
</label>

`).join("");

const row =
document.createElement("tr");

row.innerHTML = `

<td>${s.nome}</td>
<td>${s.pais}</td>
<td>${s.idade}</td>
<td>${s.bairro}</td>
<td>R$ ${s.valor}</td>

<td class="months">
${monthsHtml}
</td>

<td>
<span
class="delete-btn"
style="background: orange"
onclick="editStudent(${index})"
>
✏️
</span>
</td>

<td>
<span
class="delete-btn"
onclick="deleteStudent(${index})"
>
🗑
</span>
</td>

`;

table.appendChild(row);

});

updateTotals();

}

function renderExpenses() {

const table =
document.getElementById("expenseTable");

table.innerHTML = "";

getExpenses().forEach((e, index) => {

const row =
document.createElement("tr");

row.innerHTML = `

<td>${e.desc}</td>
<td>R$ ${e.valor}</td>

<td>
<span
class="delete-btn"
onclick="deleteExpense(${index})"
>
🗑
</span>
</td>

`;

table.appendChild(row);

});

updateTotals();

}

function updateTotals() {

const students = getStudents();
const expenses = getExpenses();

let totalStudents =
students.reduce(
(sum, s) => sum + Number(s.valor),
0
);

let totalExpenses =
expenses.reduce(
(sum, e) => sum + Number(e.valor),
0
);

let saldo =
totalStudents - totalExpenses;

document.getElementById(
"totalAlunos"
).innerText =
"Total recebido dos alunos: R$ " +
totalStudents.toFixed(2);

document.getElementById(
"totalDespesas"
).innerText =
"Total de despesas: R$ " +
totalExpenses.toFixed(2);

if (saldo >= 0) {

document.getElementById(
"saldoFinal"
).innerText =
"Lucro do mês: R$ " +
saldo.toFixed(2);

} else {

document.getElementById(
"saldoFinal"
).innerText =
"Prejuízo do mês: R$ " +
saldo.toFixed(2);

}

}

function deleteStudent(index) {

if (confirm("Deseja realmente excluir este aluno?")) {

let students = getStudents();

students.splice(index, 1);

saveStudents(students);

renderStudents();

}

}

function deleteExpense(index) {

if (confirm("Deseja realmente excluir esta despesa?")) {

let expenses = getExpenses();

expenses.splice(index, 1);

saveExpenses(expenses);

renderExpenses();

}

}

function toggleMonth(studentIndex, monthIndex) {

let students = getStudents();

students[studentIndex].meses[monthIndex] =
!students[studentIndex].meses[monthIndex];

saveStudents(students);

}

/* NOVA FUNÇÃO EDITAR */

function editStudent(index) {

let students = getStudents();

let aluno = students[index];

let nomeNovo =
prompt("Nome do aluno:", aluno.nome);

if (nomeNovo === null) return;

let paisNovo =
prompt("Nome do pai/mãe:", aluno.pais);

if (paisNovo === null) return;

let idadeNova =
prompt("Idade:", aluno.idade);

if (idadeNova === null) return;

let bairroNovo =
prompt("Bairro:", aluno.bairro);

if (bairroNovo === null) return;

let valorNovo =
prompt("Valor mensal:", aluno.valor);

if (valorNovo === null) return;

students[index] = {

nome: nomeNovo,
pais: paisNovo,
idade: idadeNova,
bairro: bairroNovo,
valor: valorNovo,
meses: aluno.meses

};

saveStudents(students);

renderStudents();

}

/* CADASTRO ALUNO */

document
.getElementById("studentForm")
.addEventListener(
"submit",
function(e) {

e.preventDefault();

let students =
getStudents();

const novo = {

nome: nome.value,
pais: pais.value,
idade: idade.value,
bairro: bairro.value,
valor: valor.value,

meses:
new Array(12).fill(false)

};

students.push(novo);

saveStudents(students);

this.reset();

renderStudents();

}
);

/* CADASTRO DESPESA */

document
.getElementById("expenseForm")
.addEventListener(
"submit",
function(e) {

e.preventDefault();

let expenses =
getExpenses();

expenses.push({

desc:
descDespesa.value,

valor:
valorDespesa.value

});

saveExpenses(expenses);

this.reset();

renderExpenses();

}
);

/* PESQUISA */

document
.getElementById("search")
.addEventListener(
"input",
renderStudents
);

renderStudents();
renderExpenses();