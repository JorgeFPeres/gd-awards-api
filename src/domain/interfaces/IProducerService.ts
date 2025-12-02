export interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface AwardsIntervalResponse {
  min: ProducerInterval[];
  max: ProducerInterval[];
}

export interface IProducerService {
  getAwardsInterval(): Promise<AwardsIntervalResponse>;
}
