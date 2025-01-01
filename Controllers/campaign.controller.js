import { Campaign } from "../Models/Campaign.js";
import { User } from "../Models/User.js";
import cloudinary from 'cloudinary';
import multer from 'multer';

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
// CREATE CAMPAIGN
export const CreateCampaign = async (req, res) => {

  const { title, category, description, fundingGoal, duration } = req.body;
  const creator = req.username;

  // Check if the creator (username) is available
  if (!creator) {
    return res.status(500).json({ message: "Username is missing" });
  }

  try {
    let imageUrl = null;

    // If there is a file, upload it to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      // Set the image URL from Cloudinary result
      imageUrl = result.secure_url;
    }

    // Create the campaign without image if no image is uploaded
    const campaign = new Campaign({
      title,
      category,
      description,
      creator,
      fundingGoal,
      duration,
      image: imageUrl,  
    });

    await campaign.save();

    const user = await User.findOneAndUpdate(
      { username: creator },
      { $push: { mycampaign: campaign._id } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ campaign, message: "Campaign created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET ALL CAMPAIGNS
export const GetCampaign = async (req,res) => {
    try {
        const campaign = await Campaign.find();
        res.status(200).json({
            campaign
        })
    } catch (error) {
        res.status(500).json({
            error:`server ${error}`
        })
    }
}

// GET CAMPAIGN BY ID
export const GetCampaignById = async (req,res) => {
    try {
        const {id} = req.params;
        const campaign = await Campaign.findById(id);
        if(campaign){
             res.status(200).json({
                campaign
            })
        }else{
            res.status(400).json({
                msg:"something data issue"
            })
        }
    } catch (error) {
        res.status(500).json({
            error:`server ${error}`
        })
    }
}

export const ApprovedCampaign = async (req,res) => {
  const {id} = req.params;
  try {
    if(!id) return res.json({msg:"No Data Found"})
      const camp = await Campaign.findByIdAndUpdate(
        id,
        { approved: true, status: 'active' },
        { new: true } 
      );

  if(!camp) return res.json({msg:"Data is not updated"});
  res.status(201).json({
    msg:"Campaign was approved by ADMIN"
  });
  } catch (error) {
    res.status(500).json({
      error:`server error ${error}`
    })
  }
}

export const RejectCampaign = async (req,res) => {
  const {id} = req.params;
  try {
    if(!id) return res.json({msg:"No Data Found"})
      const camp = await Campaign.findByIdAndUpdate(
        id,
        { approved: false, status: 'inactive' },
        { new: true } 
      );

  if(!camp) return res.json({msg:"Data is not updated"});
  res.status(201).json({
    msg:"Campaign was approved by ADMIN"
  });
  } catch (error) {
    res.status(500).json({
      error:`server error ${error}`
    })
  }
}
