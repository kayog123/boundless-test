# Boundless Test — Ride Booking App

A ride booking application built with Next.js that allows users to book one-way or hourly transportation, search for pick-up and drop-off locations (including airports), and view travel distance and estimated time.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **UI:** React 19, Tailwind CSS 4, Shadcn UI, Radix UI
- **Forms:** React Hook Form + Zod validation
- **Location Search:** Mapbox Searchbox API
- **Distance/Travel Time:** Mapbox Directions API
- **Date Handling:** date-fns, react-day-picker
- **Other:** react-select, react-international-phone, Lucide icons

## Getting Started

### Prerequisites

- Node.js 18+
- A Mapbox API token

### Setup

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root:

```
MAPBOX_API_TOKEN=your_mapbox_token_here
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Test

### Booking Flow

1. **Select reservation type** — Choose "One-way" or "Hourly".
2. **Set pick-up date and time** — Past dates and times are disabled.
3. **Choose pick-up location** — Toggle between "Location" or "Airport", then search (e.g. "123 Main Street" or "JFK").
4. **Choose drop-off location** — Same as pick-up. Use driveable locations to see travel distance (e.g. Houston to Dallas, not cross-ocean routes).
5. **Enter contact information** — Phone number auto-matches against existing customers. Use `+1234567890` to test the customer match feature.
6. **Submit** — The form POSTs to `/api/booking`, then redirects to the confirmation page.

### Confirmation Page

After submitting, the confirmation page displays:

- Reservation type
- Pick-up location (full address), date, and time
- Drop-off location (full address)
- Travel distance and estimated time (if a driving route exists)
- Contact information and passenger count

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mapbox-suggest` | Search locations/airports via Mapbox |
| GET | `/api/mapbox-distance` | Calculate driving distance and time between two locations |
| POST | `/api/booking` | Submit a booking (mock endpoint) |

### Test Data

The file `data/dummy.json` contains sample customer records for phone number matching. When a matching phone number is entered, the customer's name and email are auto-filled.
