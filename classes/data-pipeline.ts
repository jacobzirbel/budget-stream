
// this class will not use dependency injection
// it will take interfaces for the various steps of the pipeline
// and use them to perform the work

import { ICategoryDeterminer, INoteGenerator, IRawExpense } from "../models/expense.model";
import { SpreadsheetInstructionBuilder } from "./spreadsheet-instruction-builder";
import { SpreadsheetService } from "./spreadsheet-service";

export class DataPipeline {
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