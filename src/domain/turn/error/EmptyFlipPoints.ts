import { DomainError } from "../../error/DomainError";

export class EmptyFlipPoints extends DomainError {
  constructor(message: string) {
    super("EmptyFlipPoints", message);
  }
}
