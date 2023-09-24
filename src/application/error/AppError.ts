export class AppError extends Error {
  constructor(private _type: string, message: string) {
    super(message);
  }

  get type() {
    return this._type;
  }
}
