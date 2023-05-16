/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoia2FuZXdhdHNvbiIsImEiOiJjbGhrNm5lNHMwcDZlM2dxcDZscnR6NWlyIn0.ctSH8VlO9P7Z7mLPcPdptA';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kanewatson/clhk75zzz01gq01r0hbkp2brg',
    scrollZoom: false,
    // zoom: 10,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location) => {
    // Create marker
    const el = document.createElement('div');
    el.classList.add('marker');

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 },
  });
};
