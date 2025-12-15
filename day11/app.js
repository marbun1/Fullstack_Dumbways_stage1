  const express = require("express");
  const path = require("path");
  const multer = require("multer");
  const app = express();
  const port = 3000;

  //membaca data
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  //membuat folder statis
  app.use("/assets", express.static(path.join(__dirname, "src", "assets")));

  //template hbs
  app.set("view engine", "hbs");
  app.set("views", path.join(__dirname, "src", "views"));

  let projects = [];
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "src/assets/images");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });
  const upload = multer({ storage: storage });

  app.get("/home", (req, res) => {
    res.render("home", { projects });
  });

  app.get("/my-project", (req, res) => {
    res.render("my-project", { projects });
  });

  //menangani inputan form
  app.post("/add-project", upload.single("image"), (req, res) => {
    console.log("FILE UPLOADED:", req.file); 
    const { projectName, startDate, endDate, description, tech } = req.body;
    const newProject = {
      id: projects.length + 1,
      projectName,
      startDate,
      endDate,
      description,
      tech: Array.isArray(tech) ? tech : [tech],
      image: req.file ? "/assets/images/" + req.file.filename : null,
    };

    projects.push(newProject);
    res.redirect("/my-project");
  });


  app.get("/project/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const project = projects.find((p) => p.id === id);

    if (!project) {
      return res.send("Project tidak ditemukan");
    }
    res.render("detail-project", { project });
  });

  app.delete("/project/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = projects.findIndex((p) => p.id === id);       
    if (index === -1) {
      return res.status(404).json({ message: "Project tidak ditemukan" });
    }
    projects.splice(index, 1);
    console.log(`Project dengan id ${id} berhasil dihapus`); 
    res.json({ message: "Project berhasil dihapus" });
  });

  app.get("/contact", (req, res) => {
    res.render("contact", { projects });
  });
  let contacts=[];
  app.post("/contact", (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    contacts.push({
      id: contacts.length + 1,
      name,
      email,
      phone,
      subject,
      message,
    });
    console.log("Contact submitted:", contacts);
    res.send("pesanmu udah di submit");
  });

  app.listen(port, () =>
    console.log(`Server berjalan di http://localhost:${port}`)
  );