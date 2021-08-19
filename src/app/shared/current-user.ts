export class CurrentUser {
  constructor(
    public name: string,
    public localId: string,
    public email: string,
    public photoUrl: string,
    public isNewUser: boolean
  ) {}
}
