export const Disc = {
  Empty: 0,
  Dark: 1,
  Light: 2,
} as const;

export type Disc = (typeof Disc)[keyof typeof Disc];

export const toDisc = (value: number): Disc => {
  switch (value) {
    case Disc.Empty:
      return Disc.Empty;
    case Disc.Dark:
      return Disc.Dark;
    case Disc.Light:
      return Disc.Light;
    default:
      throw new Error("Invalid value");
  }
};
