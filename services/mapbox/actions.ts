import { MapboxDirectionsRequest, MapboxProfile } from '@/lib/type';
const SEARCH_BASE  = 'https://api.mapbox.com/search/searchbox/v1';
const DIRECTIONS_BASE = 'https://api.mapbox.com/directions/v5/mapbox';

async function retrievePlace(mapboxId: string, sessionToken: string): Promise<{ lng: number; lat: number }> {
  if (!process.env.MAPBOX_ACCESS_TOKEN) {
    throw new Error('MAPBOX_ACCESS_TOKEN is not defined');
  }
  const params = new URLSearchParams({
    session_token: sessionToken,
    access_token:  process.env.MAPBOX_ACCESS_TOKEN,
  });

  const res  = await fetch(`${SEARCH_BASE}/retrieve/${mapboxId}?${params}`);
  const data = await res.json();

  const feature = data.features?.[0];
  if (!feature) throw new Error('No feature returned');

  const [lng, lat] = feature.geometry.coordinates;

  return { lng, lat };
}


export async function getDistance(origin: MapboxDirectionsRequest['origin'], destination: MapboxDirectionsRequest['destination'], profile: MapboxProfile = 'driving') {
  const coords = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
  if (!process.env.MAPBOX_ACCESS_TOKEN) {
    throw new Error('MAPBOX_ACCESS_TOKEN is not defined');
  }
  const params = new URLSearchParams({
    access_token: process.env.MAPBOX_ACCESS_TOKEN,
    overview:     'false',
  });

  const res  = await fetch(`${DIRECTIONS_BASE}/${profile}/${coords}?${params}`);
  const data = await res.json();

  const route = data.routes?.[0];
  if (!route) throw new Error('No route found');

  return {
    distance_m:   route.distance,
    duration_s:   route.duration,
    distance_km:  parseFloat((route.distance / 1000).toFixed(2)),
    duration_min: parseFloat((route.duration  / 60).toFixed(1)),
  };
}

async function calculateDistance(originMapboxId: string, destinationMapboxId: string) { 

  const sessionToken =  crypto.randomUUID();

  const [origin, destination] = await Promise.all([
    retrievePlace(originMapboxId, sessionToken),
    retrievePlace(destinationMapboxId, sessionToken),
  ]);

  const result = await getDistance(origin, destination);

  return result;
}
