const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get all beds with patient info
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id,
        b.bedNumber,
        b.ward,
        b.status,
        b.patientId,
        b.doctorId,
        b.admittedDate,
        p.name as patientName,
        d.name as doctor
      FROM beds b
      LEFT JOIN patients p ON b.patientId = p.id
      LEFT JOIN doctors d ON b.doctorId = d.id
      ORDER BY b.ward, b.bedNumber
    `;
    
    const [beds] = await db.query(query);
    res.json(beds);
  } catch (error) {
    console.error('Error fetching beds:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single bed
router.get('/:bedId', async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id,
        b.bedNumber,
        b.ward,
        b.status,
        b.patientId,
        b.doctorId,
        b.admittedDate,
        p.name as patientName,
        d.name as doctor
      FROM beds b
      LEFT JOIN patients p ON b.patientId = p.id
      LEFT JOIN doctors d ON b.doctorId = d.id
      WHERE b.id = ?
    `;
    
    const [beds] = await db.query(query, [req.params.bedId]);
    
    if (beds.length === 0) {
      return res.status(404).json({ error: 'Bed not found' });
    }
    
    res.json(beds[0]);
  } catch (error) {
    console.error('Error fetching bed:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admit patient to bed
router.post('/:bedId/admit', async (req, res) => {
  try {
    const { patientName, patientId, doctor, admissionReason } = req.body;
    
    if (!patientName || !patientId || !doctor) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [bed] = await db.query('SELECT status FROM beds WHERE id = ?', [req.params.bedId]);
    if (bed.length === 0) {
      return res.status(404).json({ error: 'Bed not found' });
    }
    if (bed[0].status !== 'available') {
      return res.status(400).json({ error: 'Bed is not available' });
    }

    const [patientResult] = await db.query(
      'SELECT id FROM patients WHERE id = ?',
      [patientId]
    );

    if (patientResult.length === 0) {
      await db.query(
        'INSERT INTO patients (id, name) VALUES (?, ?)',
        [patientId, patientName]
      );
    }

    const [doctorResult] = await db.query(
      'SELECT id FROM doctors WHERE name = ?',
      [doctor]
    );

    let doctorId;
    if (doctorResult.length === 0) {
      const docId = generateId();
      await db.query(
        'INSERT INTO doctors (id, name) VALUES (?, ?)',
        [docId, doctor]
      );
      doctorId = docId;
    } else {
      doctorId = doctorResult[0].id;
    }

    await db.query(
      'UPDATE beds SET status = ?, patientId = ?, doctorId = ?, admittedDate = NOW() WHERE id = ?',
      ['occupied', patientId, doctorId, req.params.bedId]
    );

    res.json({ success: true, message: 'Patient admitted successfully' });
  } catch (error) {
    console.error('Error admitting patient:', error);
    res.status(500).json({ error: error.message });
  }
});

// Discharge patient from bed
router.post('/:bedId/discharge', async (req, res) => {
  try {
    const [bed] = await db.query('SELECT status FROM beds WHERE id = ?', [req.params.bedId]);
    if (bed.length === 0) {
      return res.status(404).json({ error: 'Bed not found' });
    }
    if (bed[0].status !== 'occupied') {
      return res.status(400).json({ error: 'Bed is not occupied' });
    }

    await db.query(
      'UPDATE beds SET status = ?, patientId = NULL, doctorId = NULL, admittedDate = NULL WHERE id = ?',
      ['available', req.params.bedId]
    );

    res.json({ success: true, message: 'Patient discharged successfully' });
  } catch (error) {
    console.error('Error discharging patient:', error);
    res.status(500).json({ error: error.message });
  }
});

// Transfer patient to another bed
router.post('/:bedId/transfer', async (req, res) => {
  try {
    const { toBedId, transferReason } = req.body;

    if (!toBedId) {
      return res.status(400).json({ error: 'Destination bed ID is required' });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const [sourceBed] = await connection.query(
        'SELECT * FROM beds WHERE id = ?',
        [req.params.bedId]
      );

      if (sourceBed.length === 0) {
        throw new Error('Source bed not found');
      }
      if (sourceBed[0].status !== 'occupied') {
        throw new Error('Source bed is not occupied');
      }

      const [destBed] = await connection.query(
        'SELECT status FROM beds WHERE id = ?',
        [toBedId]
      );

      if (destBed.length === 0) {
        throw new Error('Destination bed not found');
      }
      if (destBed[0].status !== 'available') {
        throw new Error('Destination bed is not available');
      }

      await connection.query(
        'UPDATE beds SET status = ?, patientId = NULL, doctorId = NULL WHERE id = ?',
        ['available', req.params.bedId]
      );

      await connection.query(
        'UPDATE beds SET status = ?, patientId = ?, doctorId = ?, admittedDate = NOW() WHERE id = ?',
        ['occupied', sourceBed[0].patientId, sourceBed[0].doctorId, toBedId]
      );

      await connection.commit();
      res.json({ success: true, message: 'Patient transferred successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error transferring patient:', error);
    res.status(500).json({ error: error.message });
  }
});

// Utility function to generate ID
function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

module.exports = router;