import { singleton } from "tsyringe";
import { NoteGenerator } from "./note-generator";
import { CategoryDeterminer } from "./category-determiner";
import { JDependency } from "jazzapp";
import { IProcessedExpense, IRawExpense } from "../../models/expense.model";

@singleton()
export class ExpenseProcessor extends JDependency {
    constructor(
        private noteGenerator: NoteGenerator,
        private categoryDeterminer: CategoryDeterminer,
    ) {
        super();
    }

    processExpense(rawExpense: IRawExpense): IProcessedExpense[] {
        // process the data
        const expenseWithCategory = this.categoryDeterminer.determineCategory(rawExpense);
        const expenseWithNoteAndCategory = this.noteGenerator.generateNote(expenseWithCategory);
        const processedExpense = expenseWithNoteAndCategory;

        return [processedExpense];
    }
}