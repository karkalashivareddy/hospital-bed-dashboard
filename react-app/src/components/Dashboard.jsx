import React, { useEffect, useState } from 'react';
import BedCard from './BedCard';
import Filters from './Filters';
import { fetchBeds } from '../services/api';

export default function Dashboard() {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchBeds();
        if (!cancelled) setBeds(data);
      } catch (err) {
        console.error('Failed to load beds', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = beds.filter(b => {
    if (status && b.status !== status) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (b.id && b.id.toLowerCase().includes(q)) ||
      (b.ward && b.ward.toLowerCase().includes(q)) ||
      (b.patient && b.patient.name && b.patient.name.toLowerCase().includes(q))
    );
  });

  return (
    <section className="dashboard">
      <Filters
        query={query}
        onQueryChange={setQuery}
        status={status}
        onStatusChange={setStatus}
      />
      {loading ? <p>Loading beds…</p> : (
        <div className="grid">
          {filtered.map(bed => <BedCard key={bed.id} bed={bed} />)}
          {filtered.length === 0 && <p>No beds match the filter.</p>}
        </div>
      )}
    </section>
  );
}
