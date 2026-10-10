const form = document.getElementById("lecturerForm");
const tableBody = document.getElementById("tableBody");

let lecturers = [];

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const gender = document.getElementById("gender").value;
  const birth = document.getElementById("birth").value;
  const phone = document.getElementById("phone").value;
  const rate = document.getElementById("rate").value;
  const editIndex = document.getElementById("editIndex").value;

  const lecturer = { name, gender, birth, phone, rate };

  if (editIndex === "") {
    lecturers.push(lecturer);
  } else {
    lecturers[editIndex] = lecturer;
    document.getElementById("editIndex").value = "";
    document.querySelector(".btn-main").textContent = "Add Lecturer";
  }

  form.reset();
  displayLecturers();
});

function displayLecturers() {
  tableBody.innerHTML = "";

  lecturers.forEach((lec, index) => {
    const row = `
            <tr>
                <td>${lec.name}</td>
                <td>${lec.gender}</td>
                <td>${lec.birth}</td>
                <td>${lec.phone}</td>
                <td>${lec.rate}</td>
                <td>
                    <button class="btn-action btn-edit" onclick="editLecturer(${index})">Edit</button>
                    <button class="btn-action btn-delete" onclick="deleteLecturer(${index})">Delete</button>
                </td>
            </tr>
        `;
    tableBody.innerHTML += row;
  });
}

function editLecturer(index) {
  const lec = lecturers[index];

  document.getElementById("name").value = lec.name;
  document.getElementById("gender").value = lec.gender;
  document.getElementById("birth").value = lec.birth;
  document.getElementById("phone").value = lec.phone;
  document.getElementById("rate").value = lec.rate;
  document.getElementById("editIndex").value = index;

  document.querySelector(".btn-main").textContent = "Update Lecturer";
}

function deleteLecturer(index) {
  lecturers.splice(index, 1);
  displayLecturers();
}
