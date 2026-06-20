import React from 'react';

export default function Filters({ query, onQueryChange, status, onStatusChange }) {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search by bed id, ward, patient..."
        value={query}
        onChange={e => onQueryChange(e.target.value)}
      />
      <select value={status} onChange={e => onStatusChange(e.target.value)}>
        <option value="">All statuses</option>
        <option value="available">Available</option>
        <option value="occupied">Occupied</option>
        <option value="cleaning">Cleaning</option>
      </select>
    </div>
  );
}
