import { DomainError } from "../../error/DomainError";

export class CanNotPlaceDisc extends DomainError {
  constructor(message: string) {
    super("CanNotPlaceDisc", message);
  }
}
