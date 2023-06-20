import { sheets_v4 } from "googleapis";
import { JDependency, JUtilities } from "jazzapp";
import { singleton } from "tsyringe";
import { MONEY_SPREADSHEET, TEST_SPREADSHEET } from '../config';
import { SheetsApi } from "./sheets-api";

@singleton()
export class SpreadsheetService extends JDependency {
  private sheetId: string;
  private service: sheets_v4.Sheets;

  constructor(private sheetsApi: SheetsApi, private utils: JUtilities) {
    super();
    this.sheetId = this.utils.getSecret(TEST_SPREADSHEET);
    this.service = this.sheetsApi.getService();
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

  async getColumnData(sheetName: string, header: string, extraOffset = 0): Promise<string[][]> {
    const sheet = await this.service.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: await this.getColumnRangeByHeader(sheetName, header, extraOffset),
    });

    if (!sheet.data.values) {
      sheet.data.values = [];
    }

    if (sheet.data.values.some(x => x.length > 1)) {
      throw new Error('getColumnData: More than one column found!');
    }
    return sheet.data.values.map(x => x[0] ?? null);
  }

  async addDataToColumnByHeader(sheetName: string, header: string, newData: string | number, extraOffset = 0) {
    const columnData = await this.getColumnData(sheetName, header, extraOffset);
    const columnRange = await this.getColumnRangeByHeader(sheetName, header, extraOffset);
    const firstEmptyRowIdx = columnData.findIndex(x => !x);
    const rowNum = firstEmptyRowIdx === -1 ? columnData.length : firstEmptyRowIdx;
    const headerRowStr = columnRange.split('!')[1].match(/\d+/);
  
    if (!headerRowStr) {
      throw new Error('addDataToColumnByHeader: Header row not found!');
    }

    const headerRowNum = headerRowStr[0].match(/\d+/)![0];

    const rangeToUpdate = columnRange.replace(/(![A-Za-z]+)\d+(:[A-Za-z]+)/, `$1${+headerRowNum + +rowNum}$2`);
  
    await this.service.spreadsheets.values.update({
      spreadsheetId: this.sheetId,
      range: rangeToUpdate,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[newData]] }
    });
  }

  private async getColumnRangeByHeader(sheetName: string, header: string, extraOffset = 0): Promise<string> {
    const data = await this.getSheetData(sheetName);
    const headerRow = data.findIndex(row => row.includes(header));

    if (headerRow === -1) {
      throw new Error(`getColumnRangeByHeader: Header ${header} not found in sheet ${sheetName}`);
    }

    const headerCol = data[headerRow].findIndex(col => col === header);
    const headerAddress = this.getCellAddress(headerCol, headerRow + extraOffset, sheetName);
    const columnLetter = this.getColumnLetter(headerCol);
    return `${headerAddress}:${columnLetter}`;
  }

  private getCellAddress(colIndex: number, rowIndex: number, sheetName: string = ''): string {
    return `${sheetName ? sheetName + '!' : ''}${this.getColumnLetter(colIndex)}${this.getRowNumber(rowIndex)}`;
  }

  private getColumnLetter(colIndex: number): string {
    return String.fromCharCode('A'.charCodeAt(0) + colIndex);
  }

  private getRowNumber(rowIndex: number): string {
    return (rowIndex + 1).toString();
  }

  destroy?: (() => void) | undefined;
}