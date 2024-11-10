import mongoose,{Schema} from 'mongoose';

const UserSchema = new Schema(
    {
        username:{
            type:String,
            unique:true,
            required:true
        },
        email:{
            type:String,
            required: true
        },
        password:{
            type:String,
            minlength: [8, 'Password must be at least 8 characters long'],
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true 
        },
        mycampaign:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Campaign"
        }]
    },
    {
        timestamps:true
    }
);

export const User = mongoose.model("User",UserSchema);