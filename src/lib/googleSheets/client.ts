import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

let docInstance: GoogleSpreadsheet | null = null;

export async function getGoogleSheet() {
  if (docInstance) {
    return docInstance;
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  // Handle literal "\n" which might be placed in .env
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!email || !key || !sheetId) {
    throw new Error('Google Sheets credentials are not fully configured in environment variables.');
  }

  const serviceAccountAuth = new JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
  
  await doc.loadInfo(); 
  docInstance = doc;

  return doc;
}
