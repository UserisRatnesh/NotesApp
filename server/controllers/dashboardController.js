import Note from "../models/Notes.js";
import Notes from "../models/Notes.js";
import mongoose from "mongoose";




export async function dashboard(req, res) {

    const locals = {
        title: "Dashboard",
        description: 'A Free note taking App'
    }

    try {
        const notes = await Note.find({});
        console.log(notes);
        res.render("dashboard/index.ejs", {
            userName: req.user.firstName,
            locals,
            notes,
            layout: "../views/layouts/dashboard"
        });
    } catch (error) {
        console.log(error);
    }

}