import express from 'express';
import { DeleteAccount, githubAuth, githubAuthCallback, googleAuth, googleAuthCallback, login, sendVerifyEmail, signup, verifyMail} from '../Controllers/auth.js';
import Google from "passport-google-oauth20";
import {User} from '../Models/User.js'
import userMiddleware from '../MiddleWare/user.middleware.js';
import { Campaign } from '../Models/Campaign.js';
import bcrypt from 'bcryptjs'

const router = express.Router();
const GoogleStrategy = Google.Strategy;

router.post('/signup',signup);

router.post('/login',login);

router.post('/deleteuser',DeleteAccount);

router.get('/auth/google',googleAuth);

router.get('/auth/google/callback',googleAuthCallback);

router.get('/auth/github',githubAuth);

router.get('/auth/github/callback',githubAuthCallback);

router.post('/sendverificationmail',sendVerifyEmail);

router.get('/verifymail',verifyMail);

router.get('/user',userMiddleware,async(req,res) =>{
    const username = req.username;
    console.log(username);
    try {
        const response = await User.findOne({username}).select('-password');

        res.status(200).json({
            response,
            msg:"user Fetched successfully"
       } )
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
})

router.get('/userCampaigns',userMiddleware,async(req,res) => {
    const username = req.username;
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const userCampaigns = await Campaign.find({
            _id: {
                "$in": user.mycampaign
            }
        });

        res.json({ userCampaigns });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
});

router.post('/updatepassword', userMiddleware, async (req, res) => {
    const username = req.username; 
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the password in the database
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ msg: "Password updated successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: "Server error" });
    }
});

// passport.use(
//     new GoogleStrategy({
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: "http://localhost:3000/auth/google/callback",
//     },
//     async (accessToken, refreshToken, profile, done) => {
//         try {
//             const isUser = await User.findOne({ googleId: profile.id });

//             if (isUser) {
//                 console.log("User exists, logging in:", isUser);
//                 return done(null, isUser);
//             }

//             const user = new User({
//                 username: profile.displayName,
//                 email: profile.emails[0].value,
//                 googleId: profile.id,
//             });
//             await user.save();
//             return done(null, user);
//         } catch (error) {
//             done(error, false);
//         }
//     })
// );

// // passport.serializeUser((user, done) => {
// //     done(null, user.id);
// // });

// passport.serializeUser(function(user, done) {
//     process.nextTick(function() {
//     done(null,user.id);
//   });
// });

// passport.deserializeUser(async (id, done) => {
//     try {
//         const user = await User.findOne({id}).select("-password"); // Using async/await
//         if (!user) {
//             return done(new Error("User not found"), null);
//         }
//         console.log("User deserialized:", user);
//         done(null, user); // Pass user object to the next middleware
//     } catch (error) {
//         console.error("Error during deserialization:", error);
//         done(error, null); // Handle errors properly
//     }
// });

// router.get('/auth/google',passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/auth/google/callback', passport.authenticate("google", {
//     failureRedirect: `/`,
//     successRedirect:'/'
//   }),
//   function (req, res) {
//     return res.status(200).json({ message: "Successfully signup" });
//   });

export default router;