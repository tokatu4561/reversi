import { DomainError } from "../../error/DomainError";

export class NotFoundTurn extends DomainError {
  constructor(message: string) {
    super("NotFoundTurn", message);
  }
}
