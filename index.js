const express = require("express");
const { google } = require("googleapis");
const keys = require("./keys.json");

//initialize express
const app = express();

app.use(express.json());

app.post("/tourists", async (request, response) => {
  const {
    contacts,
    expertise,
    preference,
    age_city,
    problems,
    eval,
    features,
  } = request.body;

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
    range: `TouristResponses!A:A`, //range of cells to read from.
  });

  //write data into the google sheets
  const appendedValues = await googleSheetsInstance.spreadsheets.values.append({
    auth, //auth object
    spreadsheetId, //spreadsheet id
    range: `TouristResponses!A:L`, //sheet name and range of cells
    valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
    resource: {
      values: [[    
        contacts,
        expertise,
        preference,
        age_city,
        problems,
        ...eval,
        features,]],
    },
  });

  response.send(appendedValues);
});

app.post("/guides", async (request, response) => {
  const { contacts, age_city, problems, features } = request.body;

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
    range: `GuideResponses!A:A`, //range of cells to read from.
  });

  //write data into the google sheets
  const appendedValues = await googleSheetsInstance.spreadsheets.values.append({
    auth, //auth object
    spreadsheetId, //spreadsheet id
    range: `GuideResponses!A:D`, //sheet name and range of cells
    valueInputOption: "USER_ENTERED", // The information will be passed according to what the usere passes in as date, number or text
    resource: {
      values: [[contacts, age_city, problems, features]],
    },
  });

  response.send(appendedValues);
});

const PORT = process.env.PORT || 3000;

//start server
app.listen(PORT, () => {
  console.log(`Server started on port localhost:${PORT}`);
});
