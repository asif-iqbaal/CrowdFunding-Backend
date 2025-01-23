import mongoose,{Schema} from 'mongoose';

const UserSchema = new Schema(
    {
        username:{
            type:String,
            required:true
        },
        email:{
            type:String,
            unique:true
        },
        role:{
            type:String,
            required:true,
            enum:['admin','user'],
            default:'user'
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
        githubId: {
            type: String,
            unique: true,
            sparse: true 
        },
        isVerify:{
            type:Boolean,
            default:false,
            required:true
        }
        ,
        mycampaign:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Campaign"
        }]
    },
    {
        timestamps:true
    }
);

UserSchema.pre('save', function (next) {
    if (this.googleId || this.githubId) {
      this.isVerify = true;
    }
    next();
  });
  
export const User = mongoose.model("User",UserSchema);