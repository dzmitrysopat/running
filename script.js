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
        <td><button onclick="removeLastRow()" class="delBtn">x</button> </td>
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
    let value = input.value.replace(/\D/g, ""); // Удаляем нецифровые символы

    if (value.length > 4) {
        value = value.slice(0, 4); // Ограничиваем до 4 цифр
    }

    let minutes = 0;
    let seconds = 0;

    if (value.length > 2) {
        minutes = parseInt(value.slice(0, -2), 10);
        seconds = parseInt(value.slice(-2), 10);
    } else {
        seconds = parseInt(value, 10);
    }

    if (seconds >= 60) {
        minutes += Math.floor(seconds / 60);
        seconds = seconds % 60;
    }

    input.value = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    saveTable();
}

function saveToFile() {
    const data = JSON.parse(localStorage.getItem(storageKey)) || [];
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "training_data.json";
    a.click();
}

function loadFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = JSON.parse(e.target.result);
        tableBody.innerHTML = "";
        data.forEach(row => addRow(row.date, row.time, row.distance));
        saveTable();
    };
    reader.readAsText(file);
}

tableBody.addEventListener("input", updateHighlighting);
window.addEventListener("load", loadTable);