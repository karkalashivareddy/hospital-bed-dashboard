import React from 'react';

function statusClass(status) {
  switch (status) {
    case 'available': return 'status-available';
    case 'occupied': return 'status-occupied';
    case 'cleaning': return 'status-cleaning';
    default: return 'status-unknown';
  }
}

export default function BedCard({ bed }) {
  return (
    <div className={`bed-card ${statusClass(bed.status)}`}>
      <div className="bed-header">
        <h3>{bed.id}</h3>
        <span className="bed-type">{bed.type}</span>
      </div>
      <div className="bed-body">
        <p><strong>Status:</strong> {bed.status}</p>
        {bed.patient && (
          <p className="patient">Patient: {bed.patient.name} ({bed.patient.age})</p>
        )}
        <div className="bed-meta">
          <small>Ward: {bed.ward}</small>
          <small>Last updated: {bed.updatedAt ?? '—'}</small>
        </div>
      </div>
    </div>
  );
}
