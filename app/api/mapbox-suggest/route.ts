import { NextRequest, NextResponse } from 'next/server';

const MAPBOX_TOKEN = process.env.MAPBOX_API_TOKEN || "";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q');
  const sessionToken = req.nextUrl.searchParams.get('session_token') ?? '';
  const locationType = req.nextUrl.searchParams.get('location_type');

  if (!MAPBOX_TOKEN) {
    return NextResponse.json({ suggestions: [], error: 'Mapbox token is not configured.' }, { status: 500 });
  }

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  const isAirport = locationType === 'airport';

  const params = new URLSearchParams({
    q:             query,
    session_token: sessionToken,
    access_token:  MAPBOX_TOKEN,
    types:         isAirport ? 'poi' : 'place,address',
    limit:         '5',
    country:       'US',
    ...(isAirport && { poi_category: 'airport' }),
  });

  const res = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/suggest?${params}`
  );

  const data = await res.json();
  const suggestions = data.suggestions ?? [];

  if (!isAirport) {
    return NextResponse.json({ suggestions });
  }

  const enriched = await Promise.all(
    suggestions.map(async (suggestion: any) => {
      try {
        const retrieveParams = new URLSearchParams({
          session_token: sessionToken,
          access_token:  MAPBOX_TOKEN,
        });
        const retrieveRes = await fetch(
          `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion.mapbox_id}?${retrieveParams}`
        );
        const retrieveData = await retrieveRes.json();
        const feature = retrieveData.features?.[0];
        const iata = feature?.properties?.metadata?.iata_code

          ?? feature?.properties?.metadata?.icao_code
          ?? '';
        return { ...suggestion, iata };
      } catch {
        return { ...suggestion, iata: '' };
      }
    })
  );

  return NextResponse.json({ suggestions: enriched });
}
