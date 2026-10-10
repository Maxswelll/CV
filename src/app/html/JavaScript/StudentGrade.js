const students = [
  { name: "Sokheng", subject: "Math", grade: "A" },
  { name: "Bora", subject: "Science", grade: "B" },
  { name: "Chanthy", subject: "English", grade: "A" },
  { name: "Dana", subject: "History", grade: "C" },
];

function renderTable() {
  const tableBody = document.getElementById("table-body");

  tableBody.innerHTML = students
    .map(
      (student) => `
      <tr>
        <td>${student.name}</td>
        <td>${student.subject}</td>
        <td>${student.grade}</td>
      </tr>
    `
    )
    .join("");
}

renderTable();
