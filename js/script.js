window.onload = () => {
    display();
    populateDropdown();
    initializeEventListeners();
};

function initializeEventListeners() {
    document.getElementById('btnRegister').addEventListener("click", () => {
        let id = document.getElementById('id').value;
        let name = document.getElementById('name').value;
        let program = document.getElementById('program').value;
        addStudent(id, name, program);
        document.getElementById('myform').reset();
    });

    document.getElementById('btnUpdate').addEventListener("click", updateStudent);
    document.getElementById('btnDelete').addEventListener("click", deleteStudent);
}

// Function to populate dropdown with student ids
async function populateDropdown() {
    let response = await fetch("http://localhost:5000/students");
    let json;
    if (response.ok) {
        json = await response.json();
        let dropdown = document.getElementById('studentDropdown');
        dropdown.innerHTML = ""; // Clear existing options
        for (let student of json) {
            let option = document.createElement('option');
            option.value = student.id;
            option.text = student.id;
            dropdown.appendChild(option);
        }
    } else {
        alert("Error fetching student ids: " + response.status);
    }
}

// Function to update student info
async function updateStudent() {
    let idToUpdate = document.getElementById('studentDropdown').value;
    let name = document.getElementById('name').value;
    let program = document.getElementById('program').value;

    let obj = { name, program };
    let setting = {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: { "Content-Type": 'application/json' }
    };

    let response = await fetch(`http://localhost:5000/students/${idToUpdate}`, setting);
    if (response.ok) {
        alert("Student information updated successfully.");
        await display();
        populateDropdown();
    } else {
        alert("Error updating student information: " + response.status);
    }
}

// Function to delete a student
async function deleteStudent() {
    let idToDelete = document.getElementById('studentDropdown').value;

    let setting = {
        method: "DELETE",
        headers: { "Content-Type": 'application/json' }
    };

    let response = await fetch(`http://localhost:5000/students/${idToDelete}`, setting);
    if (response.ok) {
        alert("Student deleted successfully.");
        await display();
        populateDropdown();
    } else {
        alert("Error deleting student: " + response.status);
    }
}

async function display() {
    let response = await fetch("http://localhost:5000/students");
    let json;
    if (response.ok) {
        json = await response.json();
        for (let e of json) {
            addRowToTable(e.id, e.name, e.program);
        }
    } else {
        alert("Error fetching student data: " + response.status);
    }
}

function addRowToTable(id, name, program) {
    let row = document.createElement('tr');
    row.setAttribute("id", id);
    for (let e of arguments) {
        let cell = document.createElement('td');
        cell.appendChild(document.createTextNode(e));
        row.appendChild(cell);
    }
    document.getElementById('tbodyStudentList').appendChild(row);
}

async function addStudent(id, name, program) {
    let obj = { id, name, program };
    let setting = {
        method: "POST",
        body: JSON.stringify(obj),
        headers: { "Content-Type": 'application/json' }
    };
    let response = await fetch("http://localhost:5000/students", setting);
    if (response.ok) {
        addRowToTable(id, name, program);
    } else {
        alert("Error adding student: " + response.status);
    }
}
