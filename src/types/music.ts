export interface Music {
  artist: string;
  title: string;
  metadata: {
    meanHue: number;
    moodValue: number;
  };
}
