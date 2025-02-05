const tableBody = document.querySelector("#data-table tbody");
const storageKey = "tableData";

function loadTable() {
const savedData = JSON.parse(localStorage.getItem(storageKey)) || [];
savedData.forEach(row => addRow(row.date, row.time, row.distance));
}

function addRow(date = "", time = "", distance = "") {
const row = document.createElement("tr");

row.innerHTML = `
<td><input type="date" value="${date}"></td>
<td><input type="text" placeholder="мм:сс" value="${time}" oninput="formatTime(this)"></td>
<td><input type="number" min="0" step="0.01" value="${distance}" oninput="updateHighlighting()"></td>
`;

tableBody.appendChild(row);
updateHighlighting();
saveTable();
}

function removeLastRow() {
if (tableBody.lastChild) {
tableBody.removeChild(tableBody.lastChild);
updateHighlighting();
saveTable();
}
}

function saveTable() {
const rows = tableBody.querySelectorAll("tr");
const data = Array.from(rows).map(row => {
const inputs = row.querySelectorAll("input");
return { date: inputs[0].value, time: inputs[1].value, distance: inputs[2].value };
});
localStorage.setItem(storageKey, JSON.stringify(data));
}

function updateHighlighting() {
const rows = tableBody.querySelectorAll("tr");
let prevDistance = null;

rows.forEach(row => {
const distanceInput = row.querySelector("td:nth-child(3) input");
const distance = parseFloat(distanceInput.value) || 0;

row.classList.toggle("warning", prevDistance !== null && distance < prevDistance);
prevDistance = distance;
});

saveTable();
}

function formatTime(input) {
let value = input.value.replace(/\D/g, ""); // Удаляем все нецифровые символы

if (value.length > 4) {
value = value.slice(0, 4); // Ограничиваем до 4 цифр
}

if (value.length >= 3) {
input.value = value.slice(0, value.length - 2) + ":" + value.slice(-2);
} else {
input.value = value;
}

saveTable();
}

tableBody.addEventListener("input", updateHighlighting);
window.addEventListener("load", loadTable);