import { JDependency } from "jazzapp";
import { CategoryOption } from "../header-enums";
import { ICategoryDeterminer, IRawExpense } from "../models/expense.model";
import { singleton } from "tsyringe";

@singleton()
export class BasicCategoryDeterminer extends JDependency implements ICategoryDeterminer {
    constructor() {
        super();
    }

    determineCategory(expenseData: IRawExpense) {
        return {
            ...expenseData,
            category: CategoryOption.Car,
        }
    };
}