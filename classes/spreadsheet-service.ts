import { BASE_INIT_ARGS, JDependency, JUtilities } from "jazzapp";
import { GoogleAuthenticator } from "./google-authenticator";
import { singleton } from "tsyringe";
import { google } from "googleapis";
import { TEST_SPREADSHEET } from '../config';

@singleton()
export class SpreadsheetService extends JDependency {
  sheetId: string;

  constructor(private googleAuth: GoogleAuthenticator, private utils: JUtilities) {
    super();
    this.sheetId = this.utils.getSecret(TEST_SPREADSHEET);
  }

  async getSpreadsheet() {
    const auth = this.googleAuth.getAuth();
    const service = google.sheets({ version: 'v4', auth });

    const spreadsheet = await service.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: 'A1:B2',
    })
    console.log(`Spreadsheet Data: `, spreadsheet.data);
  }

  test() {
    console.log("SpreadsheetService.test()");
  }

  destroy?: (() => void) | undefined;
}