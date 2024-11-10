import express from 'express';
import { donateToCampaign, GetDonations } from '../Controllers/donation.controller.js';
import userMiddleware from '../MiddleWare/user.middleware.js';

const router = express.Router();

router.post('/donation',userMiddleware,donateToCampaign);
router.get('/getdonation',GetDonations);

export default router;