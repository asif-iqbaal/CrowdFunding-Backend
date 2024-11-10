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
    currentAmount:{
        type: Number,
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
    donators:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    createdAt:{
        type:Date,
        default:Date.now()
    }

});

export const Campaign = mongoose.model('Campaign',CampaignSchema);