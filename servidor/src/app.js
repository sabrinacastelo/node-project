import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";


const app = express();
app.use(cors());
app.use(express.static('uploads'));

const uploadDirectory = "uploads/";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed."));
        }
    },
});

app.get("/images", (req, res, next) => {
    fs.readdir(uploadDirectory, function (err, files) {
        if (err) {
            return next(err);
        }
        const images = files.filter(
            (file) =>
                file.endsWith(".jpg") || file.endsWith(".jpeg") || file.endsWith(".png")
        );
        res.json(images);
    });
});

app.post("/upload", upload.single("file"), (req, res, next) => {
    if (req.file) {
        res.send("File uploaded successfully");
    } else {
        next(new Error("Failed to upload file."));
    }
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "An error occurred" });
});


export default app;