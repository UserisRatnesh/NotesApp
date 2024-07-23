import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';


const router = express.Router();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    async function (accessToken, refreshToken, profile, done) {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profileImage: profile.photos[0].value
        }
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (user) {
                done(null, user);
            }
            else {
                user = await User.create(newUser);
                done(null, user);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
));

// Google login route
router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',
        successRedirect: "/dashboard"
    })
);

// Route is something goes wrong
router.get("/login-failure", (req, res) => {
    res.send("S omething went wrong...");
});

// Destroy user session
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error);
            res.send("Erroe logging out.");
        }
        else {
            res.redirect("/");
        }
    })
})


//Persist the user data after successful authentication
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Retrieve user data from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).exec();
        done(null, user);
    } catch (err) {
        done(err, null);
    }
})


export default router;