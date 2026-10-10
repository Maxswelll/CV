const studentForm = document.getElementById("studentForm");
const studentTable = document
  .getElementById("studentTable")
  .getElementsByTagName("tbody")[0];

let editIndex = -1;

studentForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const id = document.getElementById("studentId").value;
  const name = document.getElementById("studentName").value;
  const age = document.getElementById("studentAge").value;
  const gender = document.getElementById("studentGender").value;

  if (editIndex === -1) {
    addStudent(id, name, age, gender);
  } else {
    updateStudent(id, name, age, gender);
  }

  studentForm.reset();
});

// Add Student
function addStudent(id, name, age, gender) {
  const newRow = studentTable.insertRow();

  newRow.innerHTML = `
    <td>${id}</td>
    <td>${name}</td>
    <td>${age}</td>
    <td>${gender}</td>
    <td>
      <button onclick="editStudent(this)">
        <i class="fas fa-edit"></i>
      </button>
      <button onclick="removeStudent(this)">
        <i class="fas fa-trash"></i>
      </button>
    </td>
  `;
}

// Edit Student
function editStudent(button) {
  const row = button.parentElement.parentElement;

  document.getElementById("studentId").value = row.cells[0].textContent;
  document.getElementById("studentName").value = row.cells[1].textContent;
  document.getElementById("studentAge").value = row.cells[2].textContent;
  document.getElementById("studentGender").value = row.cells[3].textContent;

  editIndex = row.rowIndex - 1; // Store row index relative to tbody

  document.getElementById("addStudent").textContent = "Update Student";
}

// Update Student
function updateStudent(id, name, age, gender) {
  const row = studentTable.rows[editIndex];

  row.cells[0].textContent = id;
  row.cells[1].textContent = name;
  row.cells[2].textContent = age;
  row.cells[3].textContent = gender;

  editIndex = -1;

  document.getElementById("addStudent").textContent = "Add Student";
}

// Remove Student
function removeStudent(button) {
  const row = button.parentElement.parentElement;
  studentTable.deleteRow(row.rowIndex - 1);
}
