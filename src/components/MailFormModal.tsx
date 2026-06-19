import React, { useState, useEffect } from 'react';
import { Courrier, MailType, MailStatus, MailPriority, DEPARTEMENTS } from '../types';
import { X, Check, HelpCircle, FileUp, AlertCircle } from 'lucide-react';

interface MailFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mail: Courrier) => void;
  editingMail?: Courrier | null;
  existingMails: Courrier[];
}

export default function MailFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingMail,
  existingMails,
}: MailFormModalProps) {
  // Constants for generation
  const currentYear = new Date().getFullYear();
  const todayStr = new Date().toISOString().split('T')[0];

  // Forms state
  const [type, setType] = useState<MailType>('ARRIVEE');
  const [reference, setReference] = useState('');
  const [dateEnregistrement, setDateEnregistrement] = useState(todayStr);
  const [dateCourrier, setDateCourrier] = useState(todayStr);
  const [expeditriceDestinataire, setExpeditriceDestinataire] = useState('');
  const [objet, setObjet] = useState('');
  const [departement, setDepartement] = useState(DEPARTEMENTS[0]);
  const [statut, setStatut] = useState<MailStatus>('A_TRAITER');
  const [priorite, setPriorite] = useState<MailPriority>('MOYENNE');
  const [notes, setNotes] = useState('');
  const [pieceJointeNom, setPieceJointeNom] = useState('');

  // Auto reference suggestion logic
  const generateAutomaticReference = (selectedType: MailType) => {
    const prefix = selectedType === 'ARRIVEE' ? 'ARR' : 'DEP';
    const yearPattern = `${prefix}-${currentYear}-`;
    
    // Find all matching current year references
    const matchedMails = existingMails.filter((m) => m.reference.startsWith(yearPattern));
    
    let maxNum = 0;
    matchedMails.forEach((m) => {
      const parts = m.reference.split('-');
      if (parts.length === 3) {
        const serialNum = parseInt(parts[2], 10);
        if (!isNaN(serialNum) && serialNum > maxNum) {
          maxNum = serialNum;
        }
      }
    });

    const nextSerial = String(maxNum + 1).padStart(4, '0');
    return `${prefix}-${currentYear}-${nextSerial}`;
  };

  // Sync state with editingMail or defaults
  useEffect(() => {
    if (editingMail) {
      setType(editingMail.type);
      setReference(editingMail.reference);
      setDateEnregistrement(editingMail.dateEnregistrement);
      setDateCourrier(editingMail.dateCourrier);
      setExpeditriceDestinataire(editingMail.expeditriceDestinataire);
      setObjet(editingMail.objet);
      setDepartement(editingMail.departement);
      setStatut(editingMail.statut);
      setPriorite(editingMail.priorite);
      setNotes(editingMail.notes || '');
      setPieceJointeNom(editingMail.pieceJointeNom || '');
    } else {
      setType('ARRIVEE');
      setReference(generateAutomaticReference('ARRIVEE'));
      setDateEnregistrement(todayStr);
      setDateCourrier(todayStr);
      setExpeditriceDestinataire('');
      setObjet('');
      setDepartement(DEPARTEMENTS[0]);
      setStatut('A_TRAITER');
      setPriorite('MOYENNE');
      setNotes('');
      setPieceJointeNom('');
    }
  }, [editingMail, isOpen]);

  // Adjust reference auto-generation when type is toggled in "Add mode"
  const handleTypeChange = (newType: MailType) => {
    setType(newType);
    if (!editingMail) {
      setReference(generateAutomaticReference(newType));
    }
  };

  const handleSuggestReference = () => {
    setReference(generateAutomaticReference(type));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim() || !expeditriceDestinataire.trim() || !objet.trim()) {
      return alert('Veuillez remplir tous les champs obligatoires (*)');
    }

    const submissionData: Courrier = {
      id: editingMail ? editingMail.id : `mail-${Date.now()}`,
      type,
      reference: reference.trim(),
      dateEnregistrement,
      dateCourrier,
      expeditriceDestinataire: expeditriceDestinataire.trim(),
      objet: objet.trim(),
      departement,
      statut,
      priorite,
      notes: notes.trim(),
      pieceJointeNom: pieceJointeNom.trim() || undefined,
    };

    onSubmit(submissionData);
    onClose();
  };

  // Simulated drop/attachment selection
  const simulateAttachment = () => {
    const mockFiles = [
      'contrat_cadre_signe.pdf',
      'devis_maintenance_reseau.pdf',
      'fiche_paye_correction.pdf',
      'attestation_assurances_2026.pdf',
      'lettre_reclamation_paris.pdf',
      'accord_partenariat_commercial.pdf',
    ];
    const randomIndex = Math.floor(Math.random() * mockFiles.length);
    setPieceJointeNom(mockFiles[randomIndex]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-2xl w-full border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-slate-50 dark:bg-slate-850 border-b border-slate-150 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">
              {editingMail ? 'Modifier la fiche courrier' : 'Enregistrer un nouveau courrier'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Affectation par numéro unique, département et statut de suivi.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Row 1: Flow selector (Arrivée vs Départ) */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Sens du courrier *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleTypeChange('ARRIVEE')}
                className={`py-3 px-4 rounded-lg font-semibold text-sm border flex items-center justify-center gap-2 transition cursor-pointer ${
                  type === 'ARRIVEE'
                    ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-500 text-indigo-800 dark:text-indigo-350'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350 hover:bg-slate-50'
                }`}
              >
                📥 Courrier ARRIVÉE
                {type === 'ARRIVEE' && <span className="w-2 h-2 rounded-full bg-indigo-500"></span>}
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('DEPART')}
                className={`py-3 px-4 rounded-lg font-semibold text-sm border flex items-center justify-center gap-2 transition cursor-pointer ${
                  type === 'DEPART'
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-800 dark:text-emerald-350'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350 hover:bg-slate-50'
                }`}
              >
                📤 Courrier DÉPART
                {type === 'DEPART' && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reference */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Numéro de Référence unique *
                </label>
                <button
                  type="button"
                  onClick={handleSuggestReference}
                  className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Regénérer séquentiel
                </button>
              </div>
              <input
                id="form-reference-input"
                type="text"
                required
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ex: ARR-2026-0001"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Correspondent Dynamic Label (Sender / Receiver) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {type === 'ARRIVEE' ? 'Expéditeur / Provenance *' : 'Destinataire Saisi *'}
              </label>
              <input
                id="form-correspondent-input"
                type="text"
                required
                value={expeditriceDestinataire}
                onChange={(e) => setExpeditriceDestinataire(e.target.value)}
                placeholder={type === 'ARRIVEE' ? 'Ministère, Entreprise ABC, Nom...' : 'Cabinet d\'avocat, M. Legrand, Client...'}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Core Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Date sur le Courrier papier (Date Doc) *
              </label>
              <input
                id="form-date-doc-input"
                type="date"
                required
                value={dateCourrier}
                onChange={(e) => setDateCourrier(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Date d'Enregistrement système *
              </label>
              <input
                id="form-date-enreg-input"
                type="date"
                required
                value={dateEnregistrement}
                onChange={(e) => setDateEnregistrement(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Department Assignment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Département affecté *
              </label>
              <select
                id="form-dept-select"
                value={departement}
                onChange={(e) => setDepartement(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {DEPARTEMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Tracking */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Statut actuel de suivi *
              </label>
              <select
                id="form-status-select"
                value={statut}
                onChange={(e) => setStatut(e.target.value as MailStatus)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="A_TRAITER">À traiter</option>
                <option value="EN_COURS">En cours</option>
                <option value="TRAITE">Traité</option>
                <option value="ARCHIVE">Archivé</option>
              </select>
            </div>

            {/* Priority Indicator */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Niveau d'urgence *
              </label>
              <select
                id="form-priority-select"
                value={priorite}
                onChange={(e) => setPriorite(e.target.value as MailPriority)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="BASSE">Basse (Courant)</option>
                <option value="MOYENNE">Moyenne</option>
                <option value="URGENT">Urgent !</option>
              </select>
            </div>
          </div>

          {/* Subject / Objet */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Objet / Sujet principal *
            </label>
            <input
              id="form-subject-input"
              type="text"
              required
              value={objet}
              onChange={(e) => setObjet(e.target.value)}
              placeholder="Ex: Facturation électricité Mars 2026, Contrat de partenariat, ..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Notes summary */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Description, notes d'instruction ou synthèse (Optionnel)
            </label>
            <textarea
              id="form-notes-input"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Précisez les consignes de traitement, le suivi ou les personnes notifiées..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Piece Jointe */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Numérisation / Document attaché (Simulé)
            </label>
            <div className="flex items-center gap-3">
              <input
                id="form-attachment-input"
                type="text"
                value={pieceJointeNom}
                onChange={(e) => setPieceJointeNom(e.target.value)}
                placeholder="Ex: facture_mars_2026.pdf (Aucun document si vide)"
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-mono"
              />
              <button
                type="button"
                onClick={simulateAttachment}
                className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-250 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <FileUp className="w-3.5 h-3.5" />
                Attacher un reçu
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Permet de simuler la numérisation du courrier physique pour l'archivage numérique.
            </p>
          </div>

        </form>

        {/* Footer Actions */}
        <div id="form-footer" className="px-6 py-4 bg-slate-50 dark:bg-slate-850/80 border-t border-slate-150 dark:border-slate-850/100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold transition cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md shadow-indigo-100 dark:shadow-none transition cursor-pointer"
          >
            {editingMail ? 'Enregistrer les modifications' : 'Enregistrer le courrier'}
          </button>
        </div>

      </div>
    </div>
  );
}
