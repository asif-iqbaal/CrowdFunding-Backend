import {Donation} from '../Models/Donation.js';
import { Campaign } from '../Models/Campaign.js';

export const donateToCampaign = async (req, res) => {
    try {
      const { campaignId, amount } = req.body;
      const campaign = await Campaign.findById(campaignId);
  
      if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

      const donationAmount = Number(amount);
      if (isNaN(donationAmount) || donationAmount <= 0) {
        return res.status(400).json({ error: 'Invalid donation amount' });
      }

      if (campaign.donators && campaign.donators.includes(req._id)) {
        return res.status(403).json({ error: 'User has already donated to this campaign' });
      }

      if(campaign.currentAmount < campaign.targetAmount && donationAmount < campaign.targetAmount){
        campaign.currentAmount += donationAmount;
      }

      campaign.donators.push(req._id);
      
      await campaign.save();
  
      const donation = new Donation({
        campaign: campaignId,
        User: req._id,
        amount,
      });
  
      await donation.save();
      res.status(200).json({ message: 'Donation successful', donation });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

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