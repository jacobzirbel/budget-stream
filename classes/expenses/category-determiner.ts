import { JDependency } from "jazzapp";
import { CategoryOption } from "../../header-enums";
import { ExpenseContext, IRawExpense } from "../../models/expense.model";
import { singleton } from "tsyringe";

@singleton()
export class CategoryDeterminer extends JDependency {
  constructor() {
    super();
  }

  determineCategory(context: ExpenseContext): CategoryOption | null {
    return CategoryOption.Misc;
  };
}