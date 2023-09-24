import { AppError } from "./AppError";

export class NotFoundLatestGame extends AppError {
  constructor(message: string) {
    super("NotFoundLatestGame", message);
  }
}
