import mongoose,{Schema} from "mongoose";

const DonationSchema = new Schema({

    campaign:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    User:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
    amount:{
        type:Number,
        require:true
    },
    date:{
        type:Date,
        default: Date.now()
    }
});

export const Donation = mongoose.model('Donation',DonationSchema);