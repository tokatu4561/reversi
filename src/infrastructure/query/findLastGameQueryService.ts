import {
  FindLastGameQueryData,
  FindLastGameQueryInterface,
} from "../../application/query/findLastGamesQueryService";
import { connectDB } from "../connection";
import mysql from "mysql2/promise";

export class FindLastGameQueryService implements FindLastGameQueryInterface {
  async query(limit: number): Promise<FindLastGameQueryData[]> {
    const con = await connectDB();

    const selectQueryStr = `
        SELECT
            g.id,
            sum(case when m.disc = 1 then 1 else 0 end) as dark_count,
            sum(case when m.disc = 2 then 1 else 0 end) as light_count,
            gr.winner_disc,
            g.started_at,
            gr.end_at
        FROM
            game g
        LEFT JOIN
            game_result gr
        ON
            g.id = gr.game_id
        LEFT JOIN
            turn t
        ON
            g.id = t.game_id
        Left JOIN
            move m
        ON
            t.id = m.turn_id
        GROUP BY
            g.id
        ORDER BY
            g.id DESC
        LIMIT
            ?
        `;

    const selectQueryResult = await con.execute<mysql.RowDataPacket[]>(
      selectQueryStr,
      [limit.toString()]
    );

    const records = selectQueryResult[0];

    return records.map((record) => {
      return new FindLastGameQueryData(
        record["id"],
        record["dark_count"],
        record["light_count"],
        record["winner_disc"],
        record["started_at"],
        record["end_at"]
      );
    });
  }
}
