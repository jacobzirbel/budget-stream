import { JDependency, JPrompter } from "jazzapp";
import { CategoryOption } from "../../header-enums";
import { ExpenseContext, IRawExpense } from "../../models/expense.model";
import { singleton } from "tsyringe";

@singleton()
export class CategoryDeterminer extends JDependency {
  categories: string[] = [...Object.values(CategoryOption)];

  constructor(
    private prompter: JPrompter,
  ) {
    super();
  }

  async determineCategory(context: ExpenseContext): Promise<CategoryOption | null> {
    return this.getCategoryFromConsole();
  };

  async getCategoryFromConsole(): Promise<CategoryOption> {
    const selectedCategory = await this.prompter.multi(this.categories, 'Category?');
    this.categories = this.categories.filter(category => category !== selectedCategory);
    this.categories.unshift(selectedCategory);
    return selectedCategory as CategoryOption;
  }
}