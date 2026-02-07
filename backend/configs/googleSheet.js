import  {google} from "googleapis";
import fs from 'fs'


// scopes
const SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

// Auth 
const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(fs.readFileSync("credentials.json", "utf8")),
    scopes: SCOPES
})

const sheets = google.sheets({version: "v4", auth})

const SPREADSHEET_NAME = "Packages-flights-hotels"

// Explicit worksheet mapping (Safe)
const WORKSHEETS = {
    flight: "flights",
    hotel: "hotels",
    package: "packages",
    invalid: "others"
}

const COLUMN_MAP = {
  flight: FLIGHT_COLUMNS,
  hotel: HOTEL_COLUMNS,
  package: PACKAGE_COLUMNS,
  invalid: OTHERS_COLUMNS
};

/*
   GET SPREADSHEET ID
========================= */
async function getSpreadsheetId() {
  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.list({
    q: `name='${SPREADSHEET_NAME}' and mimeType='application/vnd.google-apps.spreadsheet'`,
    fields: "files(id, name)",
    spaces: "drive"
  });

  if (!res.data.files.length) {
    throw new Error("Spreadsheet not found");
  }

  return res.data.files[0].id;
}

export async function saveRecord(record){
    const wsName = WORKSHEETS(record.record_type)
    if(!wsName) throw new Error(`Unknown record_type: ${record.record_type}`)

    const spreadsheetId = await getSpreadsheetId()

    // convert model => plain object (same as pydantic model_dump)
    const data = {...record}

    const columns = COLUMN_MAP[record.record_type]

    // BUILD ROW IN EXACT COUMN ORDER
    const row = columns.map(col => data[col] ?? "")

    console.log("print from sheet.js:", row);

    await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${wsName}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row]
    }
  });
    
}
