const express = require("express");
const { google } = require("googleapis");
const keys = require("./keys.json");

//initialize express
const app = express();
app.use(express.urlencoded({ extended: true }));

//set up template engine to render html files
app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);

// index route
app.get("/", (request, response) => {
  response.render("index");
});

app.post("/", async (request, response) => {
  const { gay, username, duration } = request.body;
  const auth = new google.auth.GoogleAuth({
    keyFile: "keys.json", //the key file
    //url to spreadsheets API
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  //Auth client Object
  const authClientObject = await auth.getClient();

  //Google sheets instance
  const googleSheetsInstance = google.sheets({
    version: "v4",
    auth: authClientObject,
  });

  // spreadsheet id
  const spreadsheetId = "1a0QhJqXoTKwe_93qqZX7zW7mQyJQMPqEpnfbRUvDV28";

  // Get metadata about spreadsheet
  const sheetInfo = await googleSheetsInstance.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  //Read from the spreadsheet
  const readData = await googleSheetsInstance.spreadsheets.values.get({
    auth, //auth object
    spreadsheetId, // spreadsheet id
    range: `API_Test!A:A`, //range of cells to read from.
  });

  //write data into the google sheets
  await googleSheetsInstance.spreadsheets.values.append({
    auth, //auth object
    spreadsheetId, //spreadsheet id
    range: `API_Test!A:C`, //sheet name and range of cells
    valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
    resource: {
      values: [[gay, username, duration]],
    },
  });

  response.send("<center><h1>Request submitted!</h1></center>");
});

const PORT = process.env.PORT || 3000;

//start server
const server = app.listen(PORT, () => {
  console.log(`Server started on port localhost:${PORT}`);
});
