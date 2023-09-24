import { DomainError } from "../../error/DomainError";

export class NotEmptyPoint extends DomainError {
  constructor(message: string) {
    super("NotEmptyPoint", message);
  }
}
