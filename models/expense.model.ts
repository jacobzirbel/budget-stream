import { CategoryOption, MoneyOption } from "../header-enums";

export interface IRawExpense {
    amount: number;
    context: string;
    source: MoneyOption;
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
    forEachExpense(callback: (expense: IRawExpense) => void): Promise<void>
}

export interface INoteGenerator {
    generateNote: (expense: IExpenseWithCategory) => IExpenseWithNoteAndCategory;
}

export interface ISpreadsheetInstruction {
    sheetName: string;
    header: CategoryOption | MoneyOption;
    data: (string | number)[];
    extraOffset: number;
}

export interface ICategoryDeterminer {
    determineCategory: (expenseData: IRawExpense) => IExpenseWithCategory;
}