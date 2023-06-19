import { BASE_INIT_ARGS, JDependency, JUtilities } from "jazzapp";
import { GoogleAuthenticator } from "./google-authenticator";
import { singleton } from "tsyringe";
import { google, sheets_v4 } from "googleapis";
import { CurrentHeaders, TEST_SPREADSHEET } from '../config';
import { JWT } from "google-auth-library";

@singleton()
export class SpreadsheetService extends JDependency {
  sheetId: string;
  private auth: JWT;
  private service: sheets_v4.Sheets;

  constructor(private googleAuth: GoogleAuthenticator, private utils: JUtilities) {
    super();
    this.sheetId = this.utils.getSecret(TEST_SPREADSHEET);
    this.auth = this.googleAuth.getAuth();
    this.service = google.sheets({ version: 'v4', auth: this.auth });
  }

  async getSheetData(sheetName: string): Promise<string[][]> {
    const sheet = await this.service.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: sheetName,
    });

    if (!sheet.data.values) {
      throw new Error('getSheetData: No data found in spreadsheet!');
    }

    return sheet.data.values;
  }

  async getColumnData(sheetName: string, header: string): Promise<string[][]> {
    const sheet = await this.service.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: await this.getColumnRangeByHeader(sheetName, header),
    });

    if (!sheet.data.values) {
      throw new Error('getColumnData: No data found in spreadsheet!');
    }

    if (sheet.data.values.some(x => x.length > 1)) {
      throw new Error('getColumnData: More than one column found!');
    }

    return sheet.data.values.flat();
  }

  private async getColumnRangeByHeader(sheetName: string, header: string): Promise<string> {
    const data = await this.getSheetData(sheetName);
    const headerRow = data.findIndex(row => row.includes(header));

    if (headerRow === -1) {
      throw new Error(`getColumnRangeByHeader: Header ${header} not found in sheet ${sheetName}`);
    }

    const headerCol = data[headerRow].findIndex(col => col === header);
    const headerAddress = this.getCellAddress(headerCol, headerRow, sheetName);
    const columnLetter = this.getColumnLetter(headerCol);
    return `${headerAddress}:${columnLetter}`;
  }

  getCellAddress(colIndex: number, rowIndex: number, sheetName: string = ''): string {
    return `${sheetName ? sheetName + '!' : ''}${this.getColumnLetter(colIndex)}${this.getRowNumber(rowIndex)}`;
  }

  getColumnLetter(colIndex: number): string {
    return String.fromCharCode('A'.charCodeAt(0) + colIndex);
  }

  getRowNumber(rowIndex: number): string {
    return (rowIndex + 1).toString();
  }

  destroy?: (() => void) | undefined;
}