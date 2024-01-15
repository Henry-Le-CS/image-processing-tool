export interface IMapPoint {
  lat: number;
  lng: number;
}

export interface IMapSegmentData {
  lat: number;
  lng: number;
  elat: number;
  elng: number;
}

export interface IRouteData {
  coords: IMapSegmentData[];
  distance: number;
  time: number;
  _id: string;
}
