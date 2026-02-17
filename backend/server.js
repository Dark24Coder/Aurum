require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./server/config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({ message: "API OK 🚀", time: result.rows[0] });
    } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});
