
export interface SearchLocationProps {
    placeholder?: string;
    className?: string;
    locationType?: "airport" | "location";
    value?: LocationItem | null;
    onChange?: (option: LocationItem | null) => void;
    name?: string;
    onBlur?: () => void;
}
export interface LocationOption {
  value: string;
  label: string;
  type: SearchLocationProps["locationType"];
  structured: {
    main_text: string;
    secondary_text: string;
  };
}
export type LocationItem = { label: string; value: string; description?: string }

interface MapboxContextEntry {
  id: string;
  name: string;
}

interface MapboxContextCountry extends MapboxContextEntry {
  country_code: string;
  country_code_alpha_3: string;
}

interface MapboxContextRegion extends MapboxContextEntry {
  region_code: string;
  region_code_full?: string;
}

interface MapboxContext {
  country?:      MapboxContextCountry;
  region?:       MapboxContextRegion;
  district?:     MapboxContextEntry;
  place?:        MapboxContextEntry;
  locality?:     MapboxContextEntry;
  neighborhood?: MapboxContextEntry;
  address?:      MapboxContextEntry;
  street?:       MapboxContextEntry;
  postcode?:     MapboxContextEntry;
}

interface MapboxEta {
  value: number;
}
export interface MapboxSuggestion {
  name: string;
  mapbox_id: string;
  feature_type: 'poi' | 'address' | 'place' | 'city' | 'locality'| 'neighborhood' | 'street' | 'region' | 'postcode'| 'district' | 'country' | 'category';
  place_formatted: string;
  language: string;
  context: MapboxContext;

  name_preferred?: string;
  full_address?: string;
  maki?: string;
  poi_category?: string[];
  poi_category_ids?: string[];
  brand?: string[];
  brand_id?: string[];
  distance?: number;
  eta?: MapboxEta | null;
  address?: string;
  external_ids?: {
    foursquare?: string;
    safegraph?:  string;
    [key: string]: string | undefined;
  };
}

export interface MapboxSuggestResponse {
  suggestions: MapboxSuggestion[];
  attribution: string;
  url?:        string; 
}

export interface MapboxDirectionsResponse {
  distance_m: number;
  duration_s: number;
  distance_km: number;
  duration_min: number;
}

export type MapboxProfile = 'driving' | 'walking' | 'cycling';
export interface MapboxDirectionsRequest {
  origin: { lng: number; lat: number };
  destination: { lng: number; lat: number };
  profile?: MapboxProfile;
}