import mongoose,{Schema} from "mongoose";

const CampaignSchema = new Schema({
    title:{
        type:String,
        require:true
    },
    category:{
        type:String
    },
    description:{
        type:String,
        require:true
    },
    creator:{
        type: String,
        require:true
    },
    currentFunding:{
        type: Number,
        default:0
    },
    fundingGoal:{
        type: Number,
        require:true
    },
    duration:{
        type:Number,
        require:true
    },
    image:{
        type:String,
    },
    phone:{
        type:Number,
        required:true
    },
    donators:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    approved:{
        type:Boolean,
        required:true,
        default:false
    },
    status: {
     type: String,
     enum: ['active', 'inactive', 'pending'],
     default: 'pending' 
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }

});

// Virtual field for daysLeft
CampaignSchema.virtual('daysLeft').get(function () {
    const currentDate = new Date();
    const endDate = new Date(this.createdAt);
    endDate.setDate(endDate.getDate() + this.duration);
    
    const timeDiff = endDate - currentDate;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return daysLeft > 0 ? daysLeft : 0; // Ensure it doesn’t go below 0
});

// Ensure virtuals are included when converting to JSON
CampaignSchema.set('toJSON', { virtuals: true });
CampaignSchema.set('toObject', { virtuals: true });

export const Campaign = mongoose.model('Campaign',CampaignSchema);