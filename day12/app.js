require("dotenv").config();
const express = require("express");
const path = require("path");
const multer = require("multer");
const { Pool } = require("pg");

const app = express();
const port = 4000;


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});


app.locals.pool = pool;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "src", "assets")));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src", "views"));

const authRouter = require("./src/assets/js/authentication");
app.use(authRouter);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/assets/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });


app.get("/home", async (req, res) => {
  const result = await pool.query("SELECT * FROM my_project ORDER BY id DESC");
  res.render("home", { projects: result.rows });
});

app.get("/my-project", async (req, res) => {
  const result = await pool.query("SELECT * FROM my_project ORDER BY id DESC");
  res.render("my-project", { projects: result.rows });
});

app.post("/add-project", upload.single("image"), async (req, res) => {
  const { projectName, startDate, endDate, description, tech } = req.body;

  const imagePath = req.file ? "/assets/images/" + req.file.filename : null;

  await pool.query(
    `INSERT INTO my_project
     (project_name, start_date, end_date, description, tech, image)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      projectName,
      startDate,
      endDate,
      description,
      Array.isArray(tech) ? tech : [tech],
      imagePath,
    ]
  );

  res.redirect("/my-project");
});

app.get("/project/:id", async (req, res) => {
  const { id } = req.params;

  const result = await pool.query("SELECT * FROM my_project WHERE id = $1", [
    id,
  ]);

  if (result.rows.length === 0) {
    return res.send("Project tidak ditemukan");
  }

  res.render("detail-project", { project: result.rows[0] });
});


app.delete("/project/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM my_project WHERE id = $1", [id]);
  res.json({ message: "Project berhasil dihapus" });
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/test-db", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});


app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
