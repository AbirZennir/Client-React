import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function CompteList() {
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchComptes = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await axios.get(`${API_BASE_URL}/banque/comptes`, {
        headers: { Accept: 'application/json' }, // force JSON
      });
      // Selon le backend, on normalise en tableau
      const data = Array.isArray(res.data) ? res.data : [res.data];
      setComptes(data);
    } catch (e) {
      console.error('GET /banque/comptes failed:', e);
      setErr("Erreur de chargement (backend?)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComptes();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="mb-3">Liste des Comptes</h2>
        <button className="btn btn-outline-secondary" onClick={fetchComptes}>
          Rafraîchir
        </button>
      </div>

      {loading && <div>Chargement…</div>}
      {err && <div className="text-danger">{err}</div>}

      {!loading && !err && (
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Solde</th>
              <th>Date de création</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {comptes.length > 0 ? (
              comptes.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.solde}</td>
                  <td>{c.dateCreation}</td>
                  <td>{c.type}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Aucun compte.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
