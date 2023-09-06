import { sheets_v4 } from 'googleapis';
import { BASE_INIT_ARGS, JDependency, JUtilities } from 'jazzapp';
import { singleton } from 'tsyringe';
import { MONEY_SPREADSHEET, TEST_SPREADSHEET } from '../../config';
import { SheetsApi } from './sheets-api';
import { ISpreadsheetInstruction } from '../../models/expense.model';

interface ExtraOptions {
  offsetY?: number;
  offsetX?: number;
  numberColumns?: number;
}

interface ExtraOptionsGuaranteed {
  offsetY: number;
  offsetX: number;
  numberColumns: number;
}

@singleton()
export class SpreadsheetService extends JDependency {
  private sheetId: string;
  private service: sheets_v4.Sheets;

  constructor(private sheetsApi: SheetsApi, private utils: JUtilities) {
    super();
    this.sheetId = this.utils.getSecret(TEST_SPREADSHEET);
    this.service = this.sheetsApi.getService();
  }

  async init(args: BASE_INIT_ARGS): Promise<this> {
    if (!args.isTesting) {
      this.sheetId = this.utils.getSecret(MONEY_SPREADSHEET);
    }
    return this;
  }

  async addDataToColumnByHeader(instruction: ISpreadsheetInstruction) {
    const { sheetName, header, data, offsetY, offsetX, allowOverwrite } = instruction;
    const otherOptions = { offsetY, offsetX, numberColumns: data.length };
    const columnData = await this.getColumnDataByHeader(sheetName, header, otherOptions);
    const columnRange = await this.getColumnRangeAddressByHeader(sheetName, header, otherOptions);

    let rangeToUpdate = '';
    if (!allowOverwrite) {
      const firstEmptyRowIdx = columnData.findIndex(x => x.every(y => !y));
      const rowNum = firstEmptyRowIdx === -1 ? columnData.length : firstEmptyRowIdx;
      const headerRowNum = columnRange.split('!')[1].match(/\d+/);

      if (!headerRowNum || !headerRowNum[0]) {
        throw new Error('addDataToColumnByHeader: Header row not found!');
      }

      rangeToUpdate = columnRange.replace(/(![A-Za-z]+)\d+(:[A-Za-z]+)/, `$1${+headerRowNum + +rowNum}$2`);
    }

    console.log(rangeToUpdate || columnRange);

    await this.service.spreadsheets.values.update({
      spreadsheetId: this.sheetId,
      range: rangeToUpdate || columnRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [data] }
    });
  }

  private async getFullSheetData(sheetName: string): Promise<string[][]> {
    const sheet = await this.service.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: sheetName,
    });

    if (!sheet.data.values) {
      throw new Error('getSheetData: No data found in spreadsheet!');
    }

    return sheet.data.values;
  }

  private async getColumnDataByHeader(sheetName: string, header: string, otherOptions: ExtraOptions): Promise<string[][]> {
    const { numberColumns } = this.parseOtherOptions(otherOptions);
    const sheet = await this.service.spreadsheets.values.get({
      spreadsheetId: this.sheetId,
      range: await this.getColumnRangeAddressByHeader(sheetName, header, otherOptions),
    });

    if (!sheet.data.values) {
      sheet.data.values = [];
    }

    if (sheet.data.values.some(x => x.length > numberColumns)) {
      throw new Error(`getColumnData: More than ${numberColumns} column found!`);
    }

    return sheet.data.values;
  }

  private async getColumnRangeAddressByHeader(sheetName: string, header: string, otherOptions: ExtraOptions): Promise<string> {
    const { offsetY, offsetX, numberColumns } = this.parseOtherOptions(otherOptions);
    const data = await this.getFullSheetData(sheetName);
    const headerRow = data.findIndex(row => row.includes(header));

    if (headerRow === -1) {
      throw new Error(`getColumnRangeByHeader: Header ${header} not found in sheet ${sheetName}`);
    }

    const headerCol = data[headerRow].findIndex(col => col === header);
    const headerAddress = this.getCellAddress(headerCol + offsetX, headerRow + offsetY + 1, sheetName);
    const columnLetter = this.getColumnLetter(headerCol + offsetX + numberColumns - 1);
    const r = `${headerAddress}:${columnLetter}`;
    return r;
  }

  private getCellAddress(colIndex: number, rowIndex: number, sheetName = ''): string {
    return `${sheetName ? sheetName + '!' : ''}${this.getColumnLetter(colIndex)}${this.getRowNumber(rowIndex)}`;
  }

  private getColumnLetter(colIndex: number): string {
    return String.fromCharCode('A'.charCodeAt(0) + colIndex);
  }

  private getRowNumber(rowIndex: number): string {
    return (rowIndex + 1).toString();
  }

  private parseOtherOptions(otherOptions: ExtraOptions): ExtraOptionsGuaranteed {
    return {
      offsetY: otherOptions.offsetY ?? 0,
      offsetX: otherOptions.offsetX ?? 0,
      numberColumns: otherOptions.numberColumns ?? 1,
    };
  }
}