import {Donation} from '../Models/Donation.js';
import { Campaign } from '../Models/Campaign.js';

// DONATE TO A CAMPAIGN BY ID
export const donateToCampaign = async (req, res) => {
    try {
      const { _id, amount } = req.body;
      const campaign = await Campaign.findById(_id);
  
      if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

      const donationAmount = Number(amount);
      if (isNaN(donationAmount) || donationAmount <= 0) {
        return res.status(400).json({ error: 'Invalid donation amount' });
      }

      if (campaign.donators && campaign.donators.includes(req._id)) {
        return res.status(403).json({ error: 'User has already donated to this campaign' });
      }

      if (campaign.currentFunding < campaign.fundingGoal) {
        campaign.currentFunding += donationAmount;
      }
    
      campaign.donators.push(req._id);
      
      await campaign.save();
  
      const donation = new Donation({
        campaign: _id,
        User: req._id,
        amount,
      });
  
      await donation.save();
      res.status(200).json({ message: 'Donation successful', donation });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

// GET ALL DONATION
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