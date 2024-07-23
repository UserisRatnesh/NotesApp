
/*
GET
home
*/

export async function homepage(req, res) {

    const locals = {
        title: "Notes",
        description: 'A Free note taking App'
    }
    res.render("index.ejs", {
        locals,
        layout: "../views/layouts/front-page"
    });

}

/*
GET
about
*/

export async function about(req, res) {

    const locals = {
        title: "About Notes",
        description: 'A Free note taking App'
    }
    res.render("about.ejs", locals);

}
