import { JDependency, JPrompter } from "jazzapp";
import { IInputService } from "../interfaces/input-service.model";
import { singleton } from "tsyringe";

@singleton()
export class ConsoleInput extends JDependency implements IInputService {
  constructor(private prompter: JPrompter) {
    super();
  }
  
  async test() {
    console.log("ConsoleInput.test()");
  }

  destroy?: (() => void) | undefined;
}