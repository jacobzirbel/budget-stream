import { JDependency, JPrompter } from "jazzapp";
import { IInputService } from "../interfaces/input-service.model";
import { singleton } from "tsyringe";

@singleton()
export class ConsoleInput implements JDependency, IInputService {
  constructor(private prompter: JPrompter) {

  }
  
  async test() {
    console.log("ConsoleInput.test()");
  }

  destroy?: (() => void) | undefined;
}