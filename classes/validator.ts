import { JDependency } from 'jazzapp';

export class Validator extends JDependency {
  test() {
    console.log('Validator.test()');
  }

  destroy?: (() => void) | undefined;
}