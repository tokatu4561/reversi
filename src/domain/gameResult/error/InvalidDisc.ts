import { DomainError } from "../../error/DomainError";

export class InvalidDisc extends DomainError {
  constructor(message: string) {
    super("InvalidDisc", message);
  }
}
