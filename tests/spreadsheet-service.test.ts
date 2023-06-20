import { get } from 'http';
import { SpreadsheetService } from '../classes/spreadsheet-service';

describe('SpreadsheetService', () => {
  let spreadsheetService: any;
  let apiService: {
    getService: () => {
      spreadsheets: {
        values: {
          get: (arg0: { spreadsheetId: string; range: string; }) => Promise<any>;
          update: (arg0: { spreadsheetId: string; range: string; valueInputOption: string; requestBody: { values: string[][]; }; }) => Promise<any>;
        };
      };
    };
  };
  let mockUtils: any;
  let table: any;

  beforeEach(() => {
    table = JSON.parse(JSON.stringify(TABLE));
    apiService = {
      getService: () => getService(table)
    };

    mockUtils = {
      getSecret: () => ''
    };

    spreadsheetService = new SpreadsheetService(apiService as any, mockUtils);
  });

  test('should startup', () => {
    expect(spreadsheetService).toBeTruthy();
  });

  test('should get sheet data', async () => {
    const data = await spreadsheetService.getSheetData('Test');

    expect(data).toEqual([
      ['', 'nothing', '', 'random'],
      ['1', '2', '3', '4'],
      ['', 'Header1', 'Header2', 'Header3'],
      ['', '1', '2', '3'],
      ['', '11', '', '33'],
      ['', '111', '222', '333'],
      [],
      [],
      ['', '1111', '2222', '3333'],
      [],
    ]);
  });

  test('should update column', async () => {
    await spreadsheetService.addDataToColumnByHeader('Test', 'Header2', 'UPDATED');
    expect(table[4][2]).toEqual('UPDATED');
  });

  test('should update column with offset 1', async () => {
    await spreadsheetService.addDataToColumnByHeader('Test', 'Header2', 'UPDATED', 1);
    expect(table[4][2]).toEqual('UPDATED');
  });

  test.only('should update column with offset 2', async () => {
    await spreadsheetService.addDataToColumnByHeader('Test', 'Header2', 'UPDATED', 3);
    expect(table[6][2]).toEqual('UPDATED');
  });
});

const TABLE: [string | null, string | null, string | null, string | null][] = [
  [null, 'nothing', null, 'random'],
  ['1', '2', '3', '4'],
  [null, 'Header1', 'Header2', 'Header3'],
  [null, '1', '2', '3'],
  [null, '11', null, '33'],
  [null, '111', '222', '333'],
  [null, null, null, null],
  [null, null, null, null],
  [null, '1111', '2222', '3333'],
  [null, null, null, null],
];

function getService(table: string[][]) {
  return {
    spreadsheets: {
      values: {
        get: async (args: { spreadsheetId: string; range: string; }) => {
          return {
            data: {
              values: parseRange(args.range, table)
            }
          };
        },
        update: async (args: { spreadsheetId: string; range: string; valueInputOption: string; requestBody: { values: string[][]; }; }) => {
          const range = args.range;
          const values = args.requestBody.values;
          const startCoords = parseAddress(range.slice(range.indexOf('!') + 1).split(':')[0]);
          const endCoords = parseAddress(range.slice(range.indexOf('!') + 1).split(':')[1]);

          const startCol = startCoords[0] ?? 0;
          const startRow = startCoords[1] ?? 0;
          const endCol = endCoords[0] ?? 1000;
          const endRow = endCoords[1] ?? 1000;

          for (let i = startRow; i <= endRow; i++) {
            for (let j = startCol; j <= endCol; j++) {
              if (!values[i - startRow] || [null, undefined].includes(values[i - startRow][j - startCol] as any)) {
                continue;
              }
              table[i][j] = values[i - startRow][j - startCol];
            }
          }
        }
      }
    }
  };
}

function parseRange(range: string, table: string[][]): string[][] {
  if (!range) {
    throw new Error('Range is empty');
  }
  const [start, end] = range.slice(range.indexOf('!') + 1).split(':');
  const startCoords = parseAddress(start);
  const endCoords = parseAddress(end);

  const startCol = startCoords[0] ?? 0;
  const startRow = startCoords[1] ?? 0;
  const endCol = endCoords[0] ?? 1000;
  const endRow = endCoords[1] ?? 1000;

  const rows = TABLE.slice(+startRow, +endRow + 1);
  const ret: string[][] = [];

  for (const row of rows) {
    if (!row.some(x => !!x)) {
      const emptyArr: string[] = [];
      ret.push(emptyArr);
    } else {
      ret.push(row.slice(+startCol, +endCol + 1).map(x => x === null ? '' : x));
    }
  }

  return ret;
}

function parseAddress(address: string) {
  const colLetter = address?.replace(/[0-9]/g, '');
  const col = 'ABCDEFG'.indexOf(colLetter);
  const row = +address?.replace(/[a-zA-Z]/g, '') - 1;


  return [
    hasNoValue(col) ? undefined : col,
    hasNoValue(row) ? undefined : row
  ];
}

function hasNoValue(n: any) {
  return n === undefined || n === null || n === '' || n === -1 || isNaN(n);
}

describe('TestHelpers', () => {
  let table: any;
  beforeEach(() => {
    table = JSON.parse(JSON.stringify(TABLE));
  });

  test('should parse address', () => {
    const testCases = [
      { address: 'A1', expected: [0, 0] },
      { address: 'B2', expected: [1, 1] },
      { address: 'C3', expected: [2, 2] },
    ];

    testCases.forEach(testCase => {
      expect(parseAddress(testCase.address)).toEqual(testCase.expected);
    });
  });

  test('should parse range', () => {
    const testCases = [
      { range: 'MySheet!A1:B1', expected: [['', 'nothing']] },
      { range: 'MySheet!A1:B2', expected: [['', 'nothing'], ['1', '2']] },
      { range: 'MySheet!B2:D4', expected: [['2', '3', '4'], ['Header1', 'Header2', 'Header3'], ['1', '2', '3']] },
    ];

    testCases.forEach(testCase => {
      const data = parseRange(testCase.range, table);
      expect(data).toEqual(testCase.expected);
    });
  });

  test('should return full table for sheet', () => {
    const fullSheet = 'SheetName';
    const data = parseRange(fullSheet, table);

    expect(data).toEqual([
      ['', 'nothing', '', 'random'],
      ['1', '2', '3', '4'],
      ['', 'Header1', 'Header2', 'Header3'],
      ['', '1', '2', '3'],
      ['', '11', '', '33'],
      ['', '111', '222', '333'],
      [],
      [],
      ['', '1111', '2222', '3333'],
      [],
    ]);
  });
});
