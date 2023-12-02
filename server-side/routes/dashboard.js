import express from "express";
import multer from "multer";

import { testRoute } from "../controllers/dashboard.js";
import { verifyToken } from "../middleware/auth.js";
import { excelUpload } from "../controllers/dashboard.js"

const router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploaded_files/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
      // cb(null, file.fieldname + "-" + Date.now());
    },
  });

const excel_upload_multer = multer({ storage: storage });

router.get("/test", verifyToken, testRoute);
router.post("/upload", excel_upload_multer.single("excel_file"), excelUpload);

export default router;
