import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

export default function CompteForm({ onAdded }) {
  const [compte, setCompte] = useState({
    solde: '',
    dateCreation: '',
    type: 'COURANT',
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setCompte({ ...compte, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);

    try {
      await axios.post(`${API_BASE_URL}/banque/comptes`, {
        ...compte,
        // envoie un nombre pour solde, pas une string
        solde: compte.solde === '' ? null : Number(compte.solde),
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json', // force JSON
        },
      });

      // reset formulaire
      setCompte({ solde: '', dateCreation: '', type: 'COURANT' });
      if (typeof onAdded === 'function') onAdded(); // optionnel: rafraîchir la liste
      alert('Compte ajouté avec succès');
    } catch (e) {
      console.error('POST /banque/comptes failed:', e);
      setErr("Échec de l'ajout (vérifie le backend).");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Ajouter un Compte</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Solde</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="solde"
            className="form-control"
            value={compte.solde}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date de création</label>
          <input
            type="date"
            name="dateCreation"
            className="form-control"
            value={compte.dateCreation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            name="type"
            className="form-select"
            value={compte.type}
            onChange={handleChange}
            required
          >
            <option value="COURANT">Courant</option>
            <option value="EPARGNE">Épargne</option>
          </select>
        </div>

        {err && <div className="alert alert-danger">{err}</div>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Ajout…' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
}
