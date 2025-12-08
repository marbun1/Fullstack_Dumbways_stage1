// Ambil project dari localStorage jika ada
let projects = JSON.parse(localStorage.getItem("projects")) || [];

// Render data saat halaman pertama kali dibuka
renderProjects();
document.getElementById("projectForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const newId = projects.length + 1;

  const newProject = {
    id: newId,
    name: document.getElementById("projectName").value,
    start: document.getElementById("startDate").value,
    end: document.getElementById("endDate").value,
    desc: document.getElementById("description").value,
    tech: {
      node: document.getElementById("node").checked,
      react: document.getElementById("react").checked,
      next: document.getElementById("next").checked,
      ts: document.getElementById("ts").checked
    },
    imageUrl: ""
  };

  const imageFile = document.getElementById("image").files[0];

  if (imageFile) {
    const reader = new FileReader();
    reader.onload = function() {
      newProject.imageUrl = reader.result;
      saveProject(newProject);
    };
    reader.readAsDataURL(imageFile);
  } else {
    saveProject(newProject);
  }
});

// Simpan project & render
function saveProject(project) {
  projects.push(project);
  localStorage.setItem("projects", JSON.stringify(projects));
  renderProjects();
  alert("Project berhasil ditambahkan!");
  document.getElementById("projectForm").reset();
}

function renderProjects() {
  const container = document.getElementById("projectList");
  container.innerHTML = "";

  projects.forEach(p => {
    const techStack = [
      p.tech.node ? "Node" : "",
      p.tech.react ? "React" : "",
      p.tech.next ? "Next" : "",
      p.tech.ts ? "TS" : ""
    ].filter(Boolean).join(", ") || "No Tech";

    container.innerHTML += `
      <div class="project card">
        ${p.imageUrl ? `<img src="${p.imageUrl}" alt="Project Image" style="width:100px;border-radius:8px;">` : ""}
        <div class="card-content">
          <h5 class="project-title" onclick="showDetail(${p.id})" style="cursor:pointer;">
            ${p.id}. ${p.name}
          </h5>
          <p><strong>${p.start}</strong> - <strong>${p.end}</strong></p>
          <p>${p.desc}</p>
          <p><strong>Tech:</strong> ${techStack}</p>

          <div class="mt-2">
            <button onclick="editProject(${p.id})">Edit</button>
            <button onclick="deleteProject(${p.id})">Hapus</button>
          </div>
        </div>
      </div>
    `;
  });
}

function deleteProject(id) {
  projects = projects.filter(p => p.id !== id);
  projects = projects.map((p, i) => ({ ...p, id: i + 1 }));
  localStorage.setItem("projects", JSON.stringify(projects));
  renderProjects();
}

function showDetail(id) {
  window.location.href = `detailProject.html?id=${id}`;
}

function editProject(id) {
  window.location.href = `edit.html?id=${id}`;
}
