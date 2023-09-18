import { TrafficConditionEnum } from '@/enums';

export interface IImageMetadata {
  name: string;
  id: string;
}

export interface ITrafficData {
  condition: TrafficConditionEnum;
  density: number;
  velocity: number;
}

export interface IImageData {
  metadata: IImageMetadata;
  isModified: boolean;
  traffic: ITrafficData;
}
