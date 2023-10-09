import express from "express";
import { JoinRoomUseCase } from "../application/usecase/joinRoomUsecase";
import { RoomMySQLRepository } from "../infrastructure/repository/room/roomMySQLRepository";
import { CreateRoomUseCase } from "../application/usecase/createRoomUsecase";

export const roomRouter = express.Router();

// FIXME: これはDIコンテナでやるべき
const joinRoomUseCase = new JoinRoomUseCase(new RoomMySQLRepository());
const createRoomUseCase = new CreateRoomUseCase(new RoomMySQLRepository());

interface JoinRoomResponseBody {
  roomId: number;
  roomName: string;
  yourDisc: number;
  isReady: boolean;
}

interface CreateRoomResponseBody {
  roomId: number;
}

roomRouter.post("/api/rooms", async (req, res) => {
  const output = await createRoomUseCase.execute();

  const responseBody: CreateRoomResponseBody = {
    roomId: output.roomId,
  };

  res.status(201).json(responseBody);
});

roomRouter.post("/api/rooms/:roomId/join", async (req, res) => {
  const output = await joinRoomUseCase.execute();

  const responseBody: JoinRoomResponseBody = {
    roomId: output.roomId,
    roomName: output.roomName,
    yourDisc: output.yourDisc,
    isReady: output.isReady,
  };

  res.status(201).json(responseBody);
});
