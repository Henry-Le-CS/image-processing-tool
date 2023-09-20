import { TrafficConditionEnum } from '@/enums';

export interface IImageMetadata {
  name: string;
  id: string;
}

export interface ITrafficData {
  condition?: TrafficConditionEnum;
  density?: number;
  velocity?: number;
}

export interface IImageData {
  fileName: string;
  fileId: string;
  url: string;
  isModified?: boolean;
  trafficCondition?: ITrafficData;
}
