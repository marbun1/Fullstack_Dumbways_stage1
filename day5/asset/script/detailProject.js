const params = new URLSearchParams(window.location.search);
const projectId = parseInt(params.get("id"));
const projects = JSON.parse(localStorage.getItem("projects")) || [];
const p = projects.find(item => item.id === projectId);

function getDuration(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  let months = (e.getFullYear() - s.getFullYear()) * 12 + e.getMonth() - s.getMonth();
  months = Math.max(0, months);

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  let result = "";
  if (years > 0) result += `${years} year${years > 1 ? "s" : ""} `;
  if (remainingMonths > 0) result += `${remainingMonths} month${remainingMonths > 1 ? "s" : ""}`;
  return result || "0 month";
}

if (!p) {
  document.body.innerHTML = "<h2 class='text-center mt-5'>Project not found!</h2>";
} else {
  document.getElementById("projectTitle").innerText = p.name;
  document.getElementById("duration").innerText = getDuration(p.start, p.end);

  if (p.imageUrl) {
    document.getElementById("projectImage").innerHTML = `<img src="${p.imageUrl}">`;
  }

  document.getElementById("desc").innerText = p.desc;

  const techElement = document.getElementById("tech");
  techElement.innerHTML = "";

  const techStack = [
    p.tech.node && "NodeJS",
    p.tech.react && "ReactJS",
    p.tech.next && "NextJS",
    p.tech.ts && "TypeScript"
  ].filter(Boolean);

  if (techStack.length === 0) {
    techElement.innerText = "No tech selected";
  } else {
    techStack.forEach(t => {
      techElement.innerHTML += `<span class="tech-badge">${t}</span>`;
    });
  }
}
