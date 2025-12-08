const params = new URLSearchParams(window.location.search);
const projectId = parseInt(params.get("id"));
let projects = JSON.parse(localStorage.getItem("projects")) || [];
const p = projects.find(item => item.id === projectId);

if (!p) {
  alert("Project tidak ditemukan!");
  window.location.href = "myProject.html";
}

document.getElementById("projectName").value = p.name;
document.getElementById("startDate").value = p.start;
document.getElementById("endDate").value = p.end;
document.getElementById("description").value = p.desc;
document.getElementById("node").checked = p.tech.node;
document.getElementById("react").checked = p.tech.react;
document.getElementById("next").checked = p.tech.next;
document.getElementById("ts").checked = p.tech.ts;


document.getElementById("projectForm").addEventListener("submit", function(e) {
  e.preventDefault();

  p.name = document.getElementById("projectName").value;
  p.start = document.getElementById("startDate").value;
  p.end = document.getElementById("endDate").value;
  p.desc = document.getElementById("description").value;
  p.tech = {
    node: document.getElementById("node").checked,
    react: document.getElementById("react").checked,
    next: document.getElementById("next").checked,
    ts: document.getElementById("ts").checked
  };

  localStorage.setItem("projects", JSON.stringify(projects));
  alert("Project berhasil diupdate!");
  window.location.href = "myProject.html";
});

