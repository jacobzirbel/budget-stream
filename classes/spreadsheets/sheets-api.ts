import { google, sheets_v4 } from 'googleapis';
import { JDependency } from 'jazzapp';
import { singleton } from 'tsyringe';
import { GoogleAuthenticator } from './google-authenticator';

@singleton()
export class SheetsApi extends JDependency {
  constructor(private googleAuth: GoogleAuthenticator) {
    super();
  }

  getService(): sheets_v4.Sheets {
    const auth = this.googleAuth.getAuth();
    const service = google.sheets({ version: 'v4', auth });
    return service;
  }
}