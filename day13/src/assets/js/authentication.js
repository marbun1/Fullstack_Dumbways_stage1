const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

// ==========================
// GET LOGIN PAGE
// ==========================
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

// ==========================
// GET REGISTER PAGE
// ==========================
router.get("/register", (req, res) => {
  res.render("daftar_akun");
});

// ==========================
// POST REGISTER (DAFTAR)
// ==========================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const pool = req.app.locals.pool;

    // cek email sudah ada
    const checkUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (checkUser.rows.length > 0) {
      return res.send("Email sudah terdaftar");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)`,
      [name, email, hashedPassword]
    );

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    res.send("Register gagal");
  }
});

// ==========================
// POST LOGIN (AUTH)
// ==========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = req.app.locals.pool;

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.send("Email tidak terdaftar");
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Password salah");
    }

    // login sukses
    res.redirect("/home");
  } catch (error) {
    console.error(error);
    res.send("Login gagal");
  }
});

module.exports = router;
