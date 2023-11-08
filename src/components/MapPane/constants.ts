import { Library } from '@googlemaps/js-api-loader';
import { ICameraData } from './type';

export const DEFAULT_RADIUS = 1000;

export const CAMERA_LIST_ENDPOINT =
  'https://us-central1-image-labelling-web.cloudfunctions.net/app/api/camera/list?pageSize=200&currentPage=3';

export const DEFAULT_LOCATION_LATLNG = {
  lat: 10.77231740416534,
  lng: 106.65797689722078,
};

export const libraries = ['places' as Library, 'geometry' as Library];

export const DEFAULT_CAMERA: ICameraData = {
  address: 'Hai Bà Trưng - Lý Chính Thắng',
  lat: 10.791464,
  cameraId: '5deb576d1dc17d7c5515acff',
  lng: 106.687554,
};
