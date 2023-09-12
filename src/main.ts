import express from "express";
import morgan from "morgan";
import "express-async-errors";
import { gameRouter } from "./presentation/gameRouter";
import { turnRouter } from "./presentation/turnRouter";

const PORT = 3000;

const app = express();

app.use(morgan("dev"));
app.use(express.static("public", { extensions: ["html"] }));
app.use(express.json());

app.use(gameRouter);
app.use(turnRouter);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
