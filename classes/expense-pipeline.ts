import { ICategoryDeterminer, INoteGenerator, IRawExpense } from "../models/expense.model";
import { SpreadsheetInstructionBuilder } from "./spreadsheets/spreadsheet-instruction-builder";
import { SpreadsheetService } from "./spreadsheets/spreadsheet-service";

export class ExpensePipeline {
    constructor(
        private noteGenerator: INoteGenerator,
        private categoryDeterminer: ICategoryDeterminer,
        private spreadsheetInstructionBuilder: SpreadsheetInstructionBuilder,
        private spreadsheetService: SpreadsheetService,
    ) { }

    run(rawExpense: IRawExpense) {
        // process the data
        const expenseWithCategory = this.categoryDeterminer.determineCategory(rawExpense);
        const expenseWithNoteAndCategory = this.noteGenerator.generateNote(expenseWithCategory);
        const processedExpense = expenseWithNoteAndCategory;

        // build the instructions
        const instruction = this.spreadsheetInstructionBuilder.buildInstruction(processedExpense);

        // send the instructions to the spreadsheet service
        const { sheetName, header, data, extraOffset } = instruction;
        this.spreadsheetService.addDataToColumnByHeader(sheetName, header, data, extraOffset);
    }
}