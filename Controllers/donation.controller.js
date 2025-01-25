import {Donation} from '../Models/Donation.js';
import { Campaign } from '../Models/Campaign.js';
import Razorpay from 'razorpay'
import crypto from 'crypto';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});
// _________________________DONATE TO A CAMPAIGN BY ID_______________________________
export const donateToCampaign = async (req, res) => {
    try {
      const { _id, amount } = req.body;
      const campaign = await Campaign.findById(_id);
      const key_id = process.env.RAZORPAY_API_KEY;
      if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

      const donationAmount = Number(amount);
      if (isNaN(donationAmount) || donationAmount <= 0) {
        return res.status(400).json({ error: 'Invalid donation amount' });
      }
      // if (campaign.donators && campaign.donators.includes(req._id)) {
      //   return res.status(403).json({ error: 'User has already donated to this campaign' });
      // }
      const order = await razorpayInstance.orders.create({
        amount: donationAmount * 100, 
        currency: 'INR',
        receipt: `donation_${_id}`,
        payment_capture: 1,
      });
      if (!order) return res.status(500).json({ error: 'Error creating Razorpay order' });

      if (campaign.currentFunding < campaign.fundingGoal) {
        campaign.currentFunding += donationAmount;
      }
    
      campaign.donators.push(req._id);
      
      await campaign.save();
  
      const donation = new Donation({
        campaign: _id,
        User: req._id,
        amount,
        razorpayOrderId: order.id,
      });
  
      await donation.save();
      res.status(200).json({
         message: 'Donation successful',
         donation,
         orderId:order.id,
         currency:'INR',
         key:key_id,
        });
    } catch (error) {
      res.status(500).json({ error: error.message || 'Server error' });
    }
  };
// ______________________verify razor  pay token _____________________________________
export const verification = async function(req,res){
  const { orderId, paymentId, signature } = req.body;
  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    // Compare the generated signature with the one received from Razorpay
    if (generatedSignature === signature) {
      res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during payment verification' });
  }
}
// ________________________GET ALL DONATION_____________________________
 export const GetDonations = async (req,res) => {
 try {
  const donation = await Donation.find();
  res.status(200).json({
    donation
  })
 } catch (error) {
  res.status(500).json({
    error:`server ${error}`
})
 }
}
