import Note from "../models/Notes.js";
import Notes from "../models/Notes.js";
import mongoose from "mongoose";




export async function dashboard(req, res) {

    let perPage = 12;
    let page = req.query.page || 1;

    const locals = {
        title: "Dashboard",
        description: 'A Free note taking App'
    }

    try {

        const notes = await Note.aggregate([
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $match: { user: new mongoose.Types.ObjectId(req.user.id) }
            },
            {
                $project: {
                    title: { $substr: ["$title", 0, 30] },
                    body: { $substr: ["$body", 0, 100] },
                },
            }
        ])
            .skip(perPage * page - perPage)
            .limit(perPage)

        const count = await Note.countDocuments({ user: new mongoose.Types.ObjectId(req.user.id) });
        res.render("dashboard/index.ejs", {
            userName: req.user.firstName,
            locals,
            notes,
            layout: "../views/layouts/dashboard",
            current: page,
            pages: Math.ceil(count / perPage)
        });




    } catch (error) {
        console.log(error);
    }

}