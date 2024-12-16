import express from 'express';
import { donateToCampaign, GetDonations, verification } from '../Controllers/donation.controller.js';
import userMiddleware from '../MiddleWare/user.middleware.js';


const router = express.Router();

router.post('/donation',userMiddleware,donateToCampaign);
router.get('/getdonation',GetDonations);
router.post('/verify-payment',verification);
export default router;