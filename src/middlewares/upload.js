import multer from 'multer';
import path from 'path'

// storage config 
const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null, "public/uploads/");
    },
    filename:(req,file,cb) => {
        const uniqueName = Date.now()+"-"+Math.round(Math.random()*1e9)
        cb(null,uniqueName+path.extname(file.originalname));
    },
});

// file filter 
const fileFilter = (req,file,cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

     if (allowedTypes.includes(file.mimetype)) {
        cb(null,true);
     }else{
        cb(new Error("Only images are allowed"),false)
     }
};

const upload = multer({storage,fileFilter})
export default upload;