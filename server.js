if (process.argv.length != 3) {
  process.stdout.write(`Usage ${process.argv[1]} portNumber`);
  process.exit(1);
}

const express = require("express"); /* Accessing express module */
const bodyParser = require("body-parser"); /* To handle post parameters */
const path = require("path");
const { ApplicationDB } = require("./database/applicationDB");
const { render } = require("express/lib/response");
const applicationRouter  = require("./routes/api/v1/application")
const app = express(); /* app is a request handler function */
process.stdin.setEncoding("utf8");
const portNumber = Number(process.argv[2]);

/* For views */
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

/* Initializes request.body with post information */
app.use(bodyParser.urlencoded({ extended: false }));

/* applicationDB */
const applicationDB = new ApplicationDB();

/* Routes */
app.use("/api/v1", applicationRouter)

app.get("/", (request, response) => {
  (async () => {
    await applicationDB.listDatabases();
  })(); 
  response.render("index");
});

app.get("/sample", (request, response) => {
  values = {
    homeUrl: `<a href="http://localhost:${portNumber}/">HOME</a>`,
    firstName: 'Nikola',
    lastName: 'Tesla',
    api: `http://localhost:${portNumber}`
  };

  response.render("sample", values);
});

app.get("/data", (req, res) => {
  res.json({firstName: "Nikola", lastName: "Tesla"})
})

app.get("/apply", (req, res) => {
  res.render("apply");
});

app.post("/submitApplication", async (req, res) => {
  const { name, email, gpa, background } = req.body;

  const application = {
      name: name,
      email: email,
      gpa: parseFloat(gpa),
      background: background
  };

  try {
      await applicationDB.insertApplication(application);
      res.render("processApplication", { applicant: application });
  } catch (error) {
      console.error("Error submitting application:", error);
      res.status(500).send("Error submitting application");
  }
});

app.get("/reviewApplication", (req, res) => {
  res.render("reviewApplication");
});

app.post("/processReviewApplication", async (req, res) => {
  const { email } = req.body;

  try {
      const applicant = await applicationDB.lookUpApplication(email);

      if (!applicant) {
          res.render("processReviewApplication", {
              applicant: {
                  name: "NONE",
                  email: "NONE",
                  gpa: "NONE",
                  background: "NONE"
              }
          });
      } else {
          res.render("processReviewApplication", { applicant });
      }
  } catch (error) {
      console.error("Error processing review application:", error);
      res.status(500).send("Error processing review application");
  }
});

app.get("/adminGPA", (req, res) => {
  res.render("adminGPA");
});

app.post("/processAdminGPA", async (req, res) => {
  const { gpa } = req.body;

  try {
      const applicants = await applicationDB.lookUpGPA(parseFloat(gpa));

      if (applicants.length === 0) {
          res.render("processAdminGPA", {
              applicants: [],
              gpa: gpa
          });
      } else {
          res.render("processAdminGPA", { applicants });
      }
  } catch (error) {
      console.error("Error processing admin GPA request:", error);
      res.status(500).send("Error processing admin GPA request");
  }
});

app.get("/adminRemove", (req, res) => {
  res.render("adminRemove");
});

app.post("/processAdminRemove", async (req, res) => {
  try {
      const deletedCount = await applicationDB.deleteAllApplications();

      res.render("processAdminRemove", { deletedCount });
  } catch (error) {
      console.error("Error removing all applications:", error);
      res.status(500).send("Error removing all applications");
  }
});

app.listen(portNumber);
console.log(`Web server started and running at http://localhost:${portNumber}`);
commandLineInterpreter();

function commandLineInterpreter() {
  let stopServerMessage = 'Type \"stop\" to shutdown the server: ';
  process.stdout.write(stopServerMessage);
  process.stdin.on("readable", function () {
    let dataInput = process.stdin.read();
    if (dataInput !== null) {
      let command = dataInput.trim();
      if (command === "stop") {
        process.stdout.write("Shutting down the server\n");
        process.exit(0);
      } else {
        process.stdout.write(`Invalid command: ${command}\n`);
        process.stdout.write(stopServerMessage);
        process.stdin.resume();
      }
    }
  });
}
