function deleteProject(id) {
  if (!confirm("hapus ga nih?")) return;

  fetch(`/project/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      window.location.reload();
    })
    .catch((err) => console.error(err));
}
