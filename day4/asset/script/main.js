document.getElementById("projectForm").addEventListener("submit", function(e) {
    e.preventDefault(); // mencegah reload halaman

    const data = {
        projectName: document.getElementById("projectName").value,
        startDate: document.getElementById("startDate").value,
        endDate: document.getElementById("endDate").value,
        description: document.getElementById("description").value,
        node: document.getElementById("node").checked,
        react: document.getElementById("react").checked,
        next: document.getElementById("next").checked,
        ts: document.getElementById("ts").checked,
        image: document.getElementById("image").files[0]
    };

    console.log(data); 
    alert("Project submited succesfully!");
});
