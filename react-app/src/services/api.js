// Replace the URL with your real endpoint or local JSON file.
const API_ENDPOINT = '/beds.json'; // When running inside react-app, place beds.json in react-app/public or adapt path

export async function fetchBeds() {
  try {
    const res = await fetch(API_ENDPOINT);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.beds ?? data;
  } catch (err) {
    console.warn('fetchBeds fallback to mock', err);
    return [
      { id: 'B-101', ward: 'A1', status: 'available', type: 'Standard', updatedAt: '2026-06-20' },
      { id: 'B-102', ward: 'A1', status: 'occupied', type: 'ICU', patient: { name: 'John Doe', age: 62 }, updatedAt: '2026-06-20' },
      { id: 'B-103', ward: 'B2', status: 'cleaning', type: 'Standard', updatedAt: '2026-06-20' },
    ];
  }
}
