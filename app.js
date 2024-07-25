import 'dotenv/config';

import express from "express";
import expressLayouts from "express-ejs-layouts";
import connectDB from './server/config/db.js';
import session from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import methodOverride from "method-override";

const app = express();
const port = 3000;
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: { maxAge: new Date(Date.now() + 3600000) }
}));

app.use(passport.initialize());
app.use(passport.session("_method"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride());

// Connect to database
connectDB();

// static files
app.use(express.static("public"));

// Layouts
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


// Routes

const indexRouter = await import('./server/routes/index.js');
app.use("/", indexRouter.default);

const dashboardRouter = await import('./server/routes/dashboard.js');
app.use("/", dashboardRouter.default);

const authRouter = await import('./server/routes/auth.js');
app.use("/", authRouter.default);


// Handle 404
app.get("*", (req, res) => {
    res.render("404.ejs");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})




