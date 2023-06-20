import { JDependency } from 'jazzapp';

export class InputController extends JDependency {
  test() {
    console.log('InputController.test()');
  }

  destroy?: (() => void) | undefined;
}