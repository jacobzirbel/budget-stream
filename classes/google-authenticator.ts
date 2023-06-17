import { JDependency } from "jazzapp";

export class GoogleAuthenticator implements JDependency {
  test() {
    console.log("GoogleAuthenticator.test()");
  }

  destroy?: (() => void) | undefined;
}