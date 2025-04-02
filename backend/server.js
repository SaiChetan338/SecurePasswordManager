const express = require("express");
const cors = require("cors");
const { Web3Storage, getFilesFromPath } = require("web3.storage");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const web3Storage = new Web3Storage({ token: process.env.WEB3_STORAGE_KEY });

// Upload encrypted password to IPFS
app.post("/upload", async (req, res) => {
    try {
        const { encryptedPassword } = req.body;
        if (!encryptedPassword) return res.status(400).json({ error: "No data provided" });

        const file = new File([encryptedPassword], "password.txt", { type: "text/plain" });
        const cid = await web3Storage.put([file]);

        res.json({ cid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve encrypted password from IPFS
app.get("/retrieve/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const url = `https://${cid}.ipfs.w3s.link/password.txt`;
        res.json({ url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log("Backend running on port 5000"));
