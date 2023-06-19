import { JDependency } from "jazzapp";
import { google } from "googleapis";
import { singleton } from "tsyringe";
import { JWT } from "google-auth-library";

@singleton()
export class GoogleAuthenticator extends JDependency {
  private client: JWT;

  constructor() {
    super();
    this.startUp();
  }

  private startUp() {
    const keyPath = "../themoney-4567-4a7e835e50dd.json";
    const keys = require(keyPath);
    this.client = new google.auth.JWT(
      keys.client_email,
      undefined,
      keys.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
    );
  }

  getAuth() {
    return this.client;
  }

  destroy?: (() => void) | undefined;
}