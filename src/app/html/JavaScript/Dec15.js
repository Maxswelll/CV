document.addEventListener("DOMContentLoaded", () => {
  // Navigation tabs
  const navBtns = document.querySelectorAll(".nav-btn");
  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".nav-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      showTab(btn.dataset.tab);
    });
  });

  function showTab(name) {
    document.querySelectorAll(".tab").forEach((t) => (t.hidden = true));
    const target = document.getElementById(name);
    if (target) target.hidden = false;
  }

  // default
  showTab("students");

  // Utilities
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // -------- SORT HELPERS
  function sortStudentsById() {
    DATA.students.sort((a, b) => Number(a.id) - Number(b.id));
  }

  function sortByName(arr) {
    arr.sort((a, b) => a.name.localeCompare(b.name));
  }
  // ----------------------------

  // Storage keys
  const KEYS = {
    students: "im_students",
    things: "im_things",
    places: "im_places",
    events: "im_events",
  };
  const DATA = { students: [], things: [], places: [], events: [] };

  // Load from localStorage
  for (let k in KEYS) {
    try {
      const raw = localStorage.getItem(KEYS[k]);
      DATA[k] = raw ? JSON.parse(raw) : [];
    } catch (e) {
      DATA[k] = [];
    }
  }

  // sort after load
  sortStudentsById();
  sortByName(DATA.things);
  sortByName(DATA.places);
  sortByName(DATA.events);

  // Save helper
  function save(k) {
    localStorage.setItem(KEYS[k], JSON.stringify(DATA[k]));
  }

  // ---------------- RENDER FUNCTIONS
  function renderStudents(filterText = "") {
    const tbody = document.getElementById("stu_tbody");
    tbody.innerHTML = "";
    DATA.students.forEach((s, i) => {
      if (filterText) {
        const c = `${s.id} ${s.name}`.toLowerCase();
        if (!c.includes(filterText.toLowerCase())) return;
      }
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(s.id)}</td>
        <td>${escapeHtml(s.name)}</td>
        <td>${escapeHtml(s.age)}</td>
        <td>${escapeHtml(s.email)}</td>
        <td>${escapeHtml(s.phone)}</td>
        <td>${escapeHtml(s.gender)}</td>
        <td>
          <button class="action-btn" data-i="${i}" data-act="edit"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="action-btn" data-i="${i}" data-act="del"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderThings() {
    const tbody = document.getElementById("thing_tbody");
    tbody.innerHTML = "";
    DATA.things.forEach((t, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(t.name)}</td>
        <td>${escapeHtml(t.brand)}</td>
        <td>${escapeHtml(t.serial)}</td>
        <td>${escapeHtml(t.price)}</td>
        <td>${escapeHtml(t.color)}</td>
        <td>${escapeHtml(t.type)}</td>
        <td>
          <button class="action-btn" data-i="${i}" data-act="edit"><i class="fa-solid fa-pen"></i></button>
          <button class="action-btn" data-i="${i}" data-act="del"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderPlaces() {
    const tbody = document.getElementById("place_tbody");
    tbody.innerHTML = "";
    DATA.places.forEach((p, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(p.name)}</td>
        <td>${escapeHtml(p.type)}</td>
        <td>${escapeHtml(p.address)}</td>
        <td>${escapeHtml(p.country)}</td>
        <td>${escapeHtml(p.rating)}</td>
        <td>${escapeHtml(p.hours)}</td>
        <td>
          <button class="action-btn" data-i="${i}" data-act="edit"><i class="fa-solid fa-pen"></i></button>
          <button class="action-btn" data-i="${i}" data-act="del"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderEvents() {
    const tbody = document.getElementById("ev_tbody");
    tbody.innerHTML = "";
    DATA.events.forEach((e, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(e.name)}</td>
        <td>${escapeHtml(e.date)}</td>
        <td>${escapeHtml(e.location)}</td>
        <td>${escapeHtml(e.people)}</td>
        <td>${escapeHtml(e.type)}</td>
        <td>${escapeHtml(e.desc)}</td>
        <td>
          <button class="action-btn" data-i="${i}" data-act="edit"><i class="fa-solid fa-pen"></i></button>
          <button class="action-btn" data-i="${i}" data-act="del"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function escapeHtml(s) {
    if (s === null || s === undefined) return "";
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  // initial render
  renderStudents();
  renderThings();
  renderPlaces();
  renderEvents();

  // ---------------- STUDENT FORM
  let stuEdit = -1;
  document.getElementById("studentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const obj = {
      id: document.getElementById("stu_id").value.trim(),
      name: document.getElementById("stu_name").value.trim(),
      age: document.getElementById("stu_age").value.trim(),
      email: document.getElementById("stu_email").value.trim(),
      phone: document.getElementById("stu_phone").value.trim(),
      gender: document.getElementById("stu_gender").value,
    };
    if (stuEdit === -1) {
      obj._uid = uid();
      DATA.students.push(obj);
    } else {
      DATA.students[stuEdit] = { ...obj, _uid: DATA.students[stuEdit]._uid };
      stuEdit = -1;
      document.getElementById("stu_submit").textContent = "Add Student";
    }
    sortStudentsById();
    save("students");
    renderStudents();
    e.target.reset();
  });

  document.getElementById("stu_search").addEventListener("input", (e) => {
    renderStudents(e.target.value);
  });

  document.getElementById("stu_tbody").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const i = Number(btn.dataset.i);
    const act = btn.dataset.act;
    if (act === "del") {
      if (confirm("Delete this student?")) {
        DATA.students.splice(i, 1);
        sortStudentsById();
        save("students");
        renderStudents();
      }
    } else if (act === "edit") {
      const s = DATA.students[i];
      document.getElementById("stu_id").value = s.id;
      document.getElementById("stu_name").value = s.name;
      document.getElementById("stu_age").value = s.age;
      document.getElementById("stu_email").value = s.email;
      document.getElementById("stu_phone").value = s.phone;
      document.getElementById("stu_gender").value = s.gender;
      stuEdit = i;
      document.getElementById("stu_submit").textContent = "Update Student";
      showTab("students");
    }
  });

  // ---------------- THING FORM
  let thingEdit = -1;
  document.getElementById("thingForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const o = {
      name: document.getElementById("thing_name").value.trim(),
      brand: document.getElementById("thing_brand").value.trim(),
      serial: document.getElementById("thing_serial").value.trim(),
      price: document.getElementById("thing_price").value.trim(),
      color: document.getElementById("thing_color").value.trim(),
      type: document.getElementById("thing_type").value,
    };
    if (thingEdit === -1) {
      o._uid = uid();
      DATA.things.push(o);
    } else {
      DATA.things[thingEdit] = { ...o, _uid: DATA.things[thingEdit]._uid };
      thingEdit = -1;
      document.getElementById("thing_submit").textContent = "Add Thing";
    }
    sortByName(DATA.things);
    save("things");
    renderThings();
    e.target.reset();
  });

  document.getElementById("thing_tbody").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const i = Number(btn.dataset.i);
    const act = btn.dataset.act;
    if (act === "del") {
      if (confirm("Delete this thing?")) {
        DATA.things.splice(i, 1);
        sortByName(DATA.things);
        save("things");
        renderThings();
      }
    }
    if (act === "edit") {
      const t = DATA.things[i];
      document.getElementById("thing_name").value = t.name;
      document.getElementById("thing_brand").value = t.brand;
      document.getElementById("thing_serial").value = t.serial;
      document.getElementById("thing_price").value = t.price;
      document.getElementById("thing_color").value = t.color;
      document.getElementById("thing_type").value = t.type;
      thingEdit = i;
      document.getElementById("thing_submit").textContent = "Update Thing";
      showTab("things");
    }
  });

  // ---------------- PLACE FORM
  let placeEdit = -1;
  document.getElementById("placeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const o = {
      name: document.getElementById("place_name").value.trim(),
      type: document.getElementById("place_type").value.trim(),
      address: document.getElementById("place_address").value.trim(),
      country: document.getElementById("place_country").value.trim(),
      rating: document.getElementById("place_rating").value.trim(),
      hours: document.getElementById("place_hours").value.trim(),
    };
    if (placeEdit === -1) {
      o._uid = uid();
      DATA.places.push(o);
    } else {
      DATA.places[placeEdit] = { ...o, _uid: DATA.places[placeEdit]._uid };
      placeEdit = -1;
      document.getElementById("place_submit").textContent = "Add Place";
    }
    sortByName(DATA.places);
    save("places");
    renderPlaces();
    e.target.reset();
  });

  document.getElementById("place_tbody").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const i = Number(btn.dataset.i);
    const act = btn.dataset.act;
    if (act === "del") {
      if (confirm("Delete this place?")) {
        DATA.places.splice(i, 1);
        sortByName(DATA.places);
        save("places");
        renderPlaces();
      }
    }
    if (act === "edit") {
      const p = DATA.places[i];
      document.getElementById("place_name").value = p.name;
      document.getElementById("place_type").value = p.type;
      document.getElementById("place_address").value = p.address;
      document.getElementById("place_country").value = p.country;
      document.getElementById("place_rating").value = p.rating;
      document.getElementById("place_hours").value = p.hours;
      placeEdit = i;
      document.getElementById("place_submit").textContent = "Update Place";
      showTab("places");
    }
  });

  // ---------------- EVENT FORM
  let evEdit = -1;
  document.getElementById("eventForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const o = {
      name: document.getElementById("ev_name").value.trim(),
      date: document.getElementById("ev_date").value,
      location: document.getElementById("ev_location").value.trim(),
      people: document.getElementById("ev_people").value.trim(),
      type: document.getElementById("ev_type").value,
      desc: document.getElementById("ev_desc").value.trim(),
    };
    if (evEdit === -1) {
      o._uid = uid();
      DATA.events.push(o);
    } else {
      DATA.events[evEdit] = { ...o, _uid: DATA.events[evEdit]._uid };
      evEdit = -1;
      document.getElementById("ev_submit").textContent = "Add Event";
    }
    sortByName(DATA.events);
    save("events");
    renderEvents();
    e.target.reset();
  });

  document.getElementById("ev_tbody").addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const i = Number(btn.dataset.i);
    const act = btn.dataset.act;
    if (act === "del") {
      if (confirm("Delete this event?")) {
        DATA.events.splice(i, 1);
        sortByName(DATA.events);
        save("events");
        renderEvents();
      }
    }
    if (act === "edit") {
      const ev = DATA.events[i];
      document.getElementById("ev_name").value = ev.name;
      document.getElementById("ev_date").value = ev.date;
      document.getElementById("ev_location").value = ev.location;
      document.getElementById("ev_people").value = ev.people;
      document.getElementById("ev_type").value = ev.type;
      document.getElementById("ev_desc").value = ev.desc;
      evEdit = i;
      document.getElementById("ev_submit").textContent = "Update Event";
      showTab("events");
    }
  });

  // ---------------- RESET BUTTONS (FIX)
  document.getElementById("stu_reset").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("studentForm").reset();
    stuEdit = -1;
    document.getElementById("stu_submit").textContent = "Add Student";
  });

  document.getElementById("thing_reset").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("thingForm").reset();
    thingEdit = -1;
    document.getElementById("thing_submit").textContent = "Add Thing";
  });

  document.getElementById("place_reset").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("placeForm").reset();
    placeEdit = -1;
    document.getElementById("place_submit").textContent = "Add Place";
  });

  document.getElementById("ev_reset").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("eventForm").reset();
    evEdit = -1;
    document.getElementById("ev_submit").textContent = "Add Event";
  });

  // clear all
  document.getElementById("clearAll").addEventListener("click", () => {
    if (!confirm("Clear all saved data?")) return;
    for (let k in KEYS) {
      localStorage.removeItem(KEYS[k]);
      DATA[k] = [];
    }
    renderStudents();
    renderThings();
    renderPlaces();
    renderEvents();
  });
});
