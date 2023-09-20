import { TrafficConditionEnum } from '@/enums';

export interface IImageMetadata {
  name: string;
  id: string;
}

export interface ITrafficData {
  condition: TrafficConditionEnum | null;
  density: number | null;
  velocity: number | null;
}

export interface IImageData {
  metadata: IImageMetadata;
  isModified: boolean;
  url: string;
  traffic: ITrafficData;
}
