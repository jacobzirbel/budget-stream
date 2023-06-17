import { JDependency, JPrompter } from "jazzapp";
import { IInputService } from "../interfaces/input-service.model";
import { singleton } from "tsyringe";

@singleton()
export class ConsoleInput implements JDependency, IInputService {
  constructor(private prompter: JPrompter) {

  }
  
  async test() {
    console.log("ConsoleInput.test()");
    let b = await this.prompter.ask("hello");
    console.log("input: " + b);
  }

  destroy?: (() => void) | undefined;
}