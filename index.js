require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const db = require("./config/Database");
const router = require("./routes/router");
const { addMovies } = require("./controller/movies.controller");
// const moviesModel = require("./models/movies.model");

const app = express();
const PORT = process.env.DEV_PORT | 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(router);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./photos");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ limits: 1000000, storage: storage });

app.post("/movies", upload.single("photo"), addMovies);

try {
  if (db.authenticate()) {
    console.log("Database connected!");
  }

  // moviesModel.sync();
} catch (error) {
  console.log(error);
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
