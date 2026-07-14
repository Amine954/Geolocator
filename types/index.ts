export interface GeolocateResult {
  country: string;
  city_or_region: string;
  monument?: string;
  location_type: 'monument' | 'city' | 'region';
  confidence: 'faible' | 'moyen' | 'élevé';
  visual_clues: string[];
}

export interface GeolocateRequest {
  imageBase64: string;
  mediaType: string;
}

export interface GeolocateResponse {
  result?: GeolocateResult;
  error?: string;
}
