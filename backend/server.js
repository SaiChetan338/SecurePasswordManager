const express = require("express");
const cors = require("cors");
const lighthouse = require("@lighthouse-web3/sdk");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const LIGHTHOUSE_API_KEY = process.env.LIGHTHOUSE_API_KEY;

// Upload encrypted password to Lighthouse
app.post("/upload-password", async (req, res) => {
    try {
        const { encryptedPassword } = req.body;
        if (!encryptedPassword) return res.status(400).json({ error: "No data provided" });

        const file = new Blob([encryptedPassword], { type: "text/plain" });
        const response = await lighthouse.uploadText(file, LIGHTHOUSE_API_KEY);

        res.json({ cid: response.data.Hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload file to Lighthouse
app.post("/upload-file", async (req, res) => {
    try {
        const { fileData, fileName, fileType } = req.body;
        if (!fileData || !fileName || !fileType) return res.status(400).json({ error: "Invalid file data" });

        const fileBuffer = Buffer.from(fileData, "base64");
        const file = new File([fileBuffer], fileName, { type: fileType });

        const response = await lighthouse.uploadFile(file, LIGHTHOUSE_API_KEY);
        res.json({ cid: response.data.Hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrieve stored file or password
app.get("/retrieve/:cid", (req, res) => {
    const { cid } = req.params;
    const url = `https://gateway.lighthouse.storage/ipfs/${cid}`;
    res.json({ url });
});

app.listen(5000, () => console.log("Backend running on port 5000"));
