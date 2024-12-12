import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import {Strategy as GithubStrategy} from 'passport-github2';
import {User} from '../Models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// SIGN UP 
export const  signup = async(req,res,next) => {
    const {username,email,password,confirmPassword} = req.body;
    if(password === confirmPassword){
    try {
    let user = await User.findOne({email});
    if(user){
        res.status(400).json({
            error:"user with this email is already exists"
        })
    }

     user = new User({
        username,
        email,
        password
    })

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password,salt);

   await user.save();

   const payload = {
        user :{
            username:user.username,
            id: user._id
        }
   }
   const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'});
   return res.status(200).json({
    token
   });
    } catch (error) {
        next(error);
    }
}
}

// LOGIN 
export const login = async (req,res,next) => {
    const {email,password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({
                error:"email is not available in our database"
            })
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            res.status(400).json({
                error:"passoword is incorrect"
            })
        }
        const payload ={
            user:{
                username:user.username,
                id:user._id
            }
        }

        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'1h'});
         res
        .cookie(
            "token",
            token,
            {
                expires: new Date(Date.now() + (3600000)),
                httpOnly: true,
                secure:true,
                sameSite:"none"
            }
    )
    return res.json({
        token,
        msg:"loggedin succesfull"
    })
    } catch (error) {
       next(error)
    }
}

// DELETE ACCOUNT
export const DeleteAccount = async(req,res) => {
    const {id} = req.body;
    console.log(id);
    const deleteUser = await User.findByIdAndDelete(id);

    if(!deleteUser){
        res.status(400).json({
            msg:"unable to delete the user try again"
        })
    }
    res.status(200).json({
        deleteUser,
        msg:"user removed from our database"
    })
}

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                user = new User({
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                });
                await user.save();
            }

            console.log((user));
            done(null, user);
        } catch (error) {
            done(error);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});

// Google Authentication Middleware
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Google Authentication Callback Middleware
export const googleAuthCallback = (req, res, next) => {
    passport.authenticate('google', { failureRedirect: '/login' }, (err, user) => {
        if (err || !user) {
            return res.redirect(`http://localhost:5173`);
        }

        const token = jwt.sign({ user: { id: user._id,username:user.username } }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.redirect(`http://localhost:5173?token=${token}`);
    })(req, res, next);
};

//_______________________________GITHUB AUTHENTICATION ________________________
passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
            user = new User({
                username: profile.displayName,
                githubId: profile.id,
            });
            await user.save();
        }

        console.log((user));
        done(null, user);
    } catch (error) {
        done(error);
    }
}
));

export const githubAuth =  passport.authenticate('github', { scope: [ 'user'  ] });

export const githubAuthCallback = (req, res, next) => {
        passport.authenticate('github', { failureRedirect: '/login' }, (err, user) => {
            if (err || !user) {
                return res.redirect(`http://localhost:5173`);
            }
    
            const token = jwt.sign({ user: { id: user._id,username:user.username } }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.redirect(`http://localhost:5173?token=${token}`);
        })(req, res, next);
    };