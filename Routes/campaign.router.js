import express from 'express'
import { GetCampaign, CreateCampaign } from "../Controllers/campaign.controller.js";
import userMiddleware from '../MiddleWare/user.middleware.js';
import multer from 'multer';

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './uploads/');
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + '-' + file.originalname);
//     },
//   });
  
//   const upload = multer({ storage: storage });
  
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/create', userMiddleware, upload.single("image"), CreateCampaign);




router.get('/campaigns',GetCampaign);

export default router;