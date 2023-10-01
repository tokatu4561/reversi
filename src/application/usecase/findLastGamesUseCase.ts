import { FindLastGameQueryInterface } from "../query/findLastGamesQueryService";

export class FindLastGamesUseCase {
  constructor(private _findLastGamesQueryService: FindLastGameQueryInterface) {}

  async execute() {
    // 最新10件
    const limit = 10;
    return await this._findLastGamesQueryService.query(limit);
  }
}
