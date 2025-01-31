import Note from "../models/Notes.js";
import mongoose from "mongoose";

export async function dashboard(req, res) {
  let perPage = 12;
  const page = parseInt(req.query.page, 10) || 1;

  const locals = {
    title: "Dashboard",
    description: "A Free note taking App",
  };

  try {
    const notes = await Note.aggregate([
      {
        $sort: {
          updatedAt: -1
        },
      },
      {
        $match: { user: new mongoose.Types.ObjectId(req.user.id) },
      },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      },
    ])
      .skip(perPage * (page - 1))
      .limit(perPage);

    const count = await Note.countDocuments({
      user: new mongoose.Types.ObjectId(req.user.id),
    });
    res.render("dashboard/index.ejs", {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
  }
}
/*
GET
view specific note
*/

export async function dashboardViewNote(req, res) {
  try {
    const note = await Note.findById({ _id: req.params.id })
      .where({ user: req.user.id })
      .lean();
    res.render("dashboard/view-notes", {
      noteId: req.params.id,
      note,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
}

/*
POST
update a specific note
*/
export async function dashboardUpdateNote(req, res) {
  try {
    await Note.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now()
      },
    ).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
}


/*
DELETE
To delete the specific note
*/

export async function dashboardDeleteNote(req, res) {
  try {
    await Note.findByIdAndDelete({ _id: req.params.id }).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
}


/*
GET
Add note page render
*/
export async function dashboardAddNote(req, res) {
  res.render("dashboard/add",
    {
      layout: "../views/layouts/dashboard"
    }
  );
}

/*
POST
Add notes
*/

export async function dashboardAddNoteSubmit(req, res) {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
}
/*
GET
Search
*/
export async function dashboardSearch(req, res) {
  try {
    res.render("dashboard/search", {
      searchResults: "",
      layout: "../views/layouts/dashboard"
    })
  }
  catch (error) {
    console.log(error);
  }
}

/*
POST
Search
*/

export async function dashboardSearchSubmit(req, res) {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, 'i') } },

        { body: { $regex: new RegExp(searchNoSpecialChars, 'i') } },
      ]
    }).where({ user: req.user.id });
    res.render("dashboard/search", {
      searchResults,
      layout: "../views/layouts/dashboard"
    })
  }
  catch (error) {
    console.log(error);
  }
}