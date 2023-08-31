import { JDependency } from "jazzapp";
import { IExpenseWithCategory, IExpenseWithNoteAndCategory, INoteGenerator } from "../models/expense.model";
import { singleton } from "tsyringe";

@singleton()
export class BasicNoteGenerator extends JDependency implements INoteGenerator {
    constructor() {
        super();
    }
    generateNote(expense: IExpenseWithCategory): IExpenseWithNoteAndCategory {
        return {
            ...expense,
            note: 'note from actual logic',
            notePosition: 'pre'
        }
    }
}