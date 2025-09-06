// // Multer is node.js middleware for handling multipart / form-data (file uploads)

// // import multer
// import multer from "multer";

// import path from "path";

// import fs from "fs";

// const uploadPath = path.join(process.cwd(), "uploads")

// // Configure storage with filename and location
// const storage = multer.diskStorage({



// // destination: (req, file, cb) =>{
// //         cb(null, "./uploads");
// //     },

// destination: (req, file, cb) => {
//   cb(null, "uploadPath");
// },

// filename: (req, file, cb)=>{

// cb(null, new Date().toISOString() + file.originalname);

// },
   
// });



// export const upload = multer({

//      storage: storage
    
//     });

import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the uploads folder exists
const uploadPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);  // Absolute path to 'uploads' folder
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, '-');  // Remove invalid characters
    cb(null, `${timestamp}-${file.originalname}`);
  }
});

export const upload = multer({ storage: storage });
