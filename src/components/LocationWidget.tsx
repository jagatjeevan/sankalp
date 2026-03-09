'use client';

import { useState } from 'react';

export function LocationWidget() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        setLocationError(error.message || 'Unable to get your location');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
      },
    );
  };

  return (
    <main className="mx-auto px-6 max-w-6xl">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Your location</h3>
        <p className="text-sm text-slate-600">
          Grab your current location and preview it on a map.
        </p>

        <div className="mt-4 space-y-4">
          {location ? (
            <div className="space-y-4">
              <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-slate-200">
                <iframe
                  title="Location map"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${(
                    location.lng - 0.01
                  ).toFixed(6)}%2C${(location.lat - 0.01).toFixed(6)}%2C${(
                    location.lng + 0.01
                  ).toFixed(
                    6,
                  )}%2C${(location.lat + 0.01).toFixed(6)}&layer=mapnik&marker=${location.lat.toFixed(
                    6,
                  )}%2C${location.lng.toFixed(6)}`}
                  className="h-full w-full"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-700">
                  <div>
                    <span className="font-semibold">Latitude:</span> {location.lat.toFixed(6)}
                  </div>
                  <div>
                    <span className="font-semibold">Longitude:</span> {location.lng.toFixed(6)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setLocation(null);
                    setLocationError(null);
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={requestLocation}
                disabled={isLocating}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLocating ? 'Locating…' : 'Get current location'}
              </button>

              {locationError ? <p className="text-sm text-red-600">{locationError}</p> : null}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
