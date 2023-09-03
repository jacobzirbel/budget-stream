import { CategoryOption, MoneyOption, Sheet } from '../header-enums';

export type ExpenseContext = string;

export interface IRawExpense {
    amount: number;
    context: ExpenseContext;
    source: MoneyOption;
}

export interface ExpensePart {
    amount: number;
    category: CategoryOption;
}

export interface ExpensePartWithNote extends ExpensePart {
    note?: string;
    notePosition?: 'pre' | 'post';
}

export interface ExpenseReadyForUpload extends IRawExpense {
    expenseParts: ExpensePartWithNote[]
}


export interface IExpenseWithCategory extends IRawExpense {
    category: CategoryOption;
}

export interface IExpenseWithNote extends IRawExpense {
    note: string;
    notePosition: 'pre' | 'post';
}

export type IExpenseWithNoteAndCategory = IExpenseWithCategory & IExpenseWithNote;

export type IProcessedExpense = IExpenseWithCategory & IExpenseWithNote;

export interface IExpenseGenerator {
    forEachExpense(callback: (expense: IRawExpense) => Promise<void>): Promise<void>
}


export interface ISpreadsheetInstruction {
    sheetName: Sheet;
    header: CategoryOption | MoneyOption;
    data: (string | number)[];
    offsetX?: number | undefined;
    offsetY?: number | undefined;
}