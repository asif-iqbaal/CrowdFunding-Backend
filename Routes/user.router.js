import express from 'express';
import { DeleteAccount, login, signup} from '../Controllers/auth.js';
import passport from "passport";
import Google from "passport-google-oauth20";
import {User} from '../Models/User.js'

const router = express.Router();
const GoogleStrategy = Google.Strategy;

router.post('/signup',signup);
router.post('/login',login);
router.post('/deleteuser',DeleteAccount);

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            if (profile) {

                const isUser = await User.findOne({
                    username: profile.displayName
                });
                
                console.log(isUser)

                if(isUser) throw new Error("User already exist");
                

                const user = new User({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                });
                await user.save();
                return done(null, user);
            } 
        } catch (error) {
            done(error,false);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});

router.get('/auth/google',passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate("google", {
    failureRedirect: `/`,
    successRedirect: `/`,
  }),
  function (req, res) {
    return res.status(200).json({ message: "Successfully signup" });
  });

export default router;