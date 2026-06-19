import React from 'react';
import { Courrier, STATUTS_LABELS, PRIORITES_LABELS, DEPARTEMENTS } from '../types';
import { X, Calendar, User, FileText, Tag, Briefcase, Bookmark, PenTool, Hash, Download } from 'lucide-react';

interface MailDetailsModalProps {
  mail: Courrier | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (mail: Courrier) => void;
  onDelete: (id: string) => void;
  isAdmin?: boolean;
}

export default function MailDetailsModal({
  mail,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  isAdmin = true,
}: MailDetailsModalProps) {
  if (!isOpen || !mail) return null;

  const statusMeta = STATUTS_LABELS[mail.statut] || { label: mail.statut, bg: 'bg-gray-100', text: 'text-gray-800' };
  const priorityMeta = PRIORITES_LABELS[mail.priorite] || { label: mail.priorite, badgeBg: 'bg-gray-50', badgeText: 'text-gray-850' };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal box */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Color bar indicator depending on Mail Type */}
        <div className={`h-2.5 ${mail.type === 'ARRIVEE' ? 'bg-indigo-600' : 'bg-emerald-500'}`} />

        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-sm ${
              mail.type === 'ARRIVEE'
                ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-305'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-305'
            }`}>
              {mail.type === 'ARRIVEE' ? 'Courrier Arrivée' : 'Courrier Départ'}
            </span>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 font-mono">
              {mail.reference}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detailed Grid Content */}
        <div className="p-6 space-y-5">
          {/* Title / Object */}
          <div>
            <h4 className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider mb-1">
              Objet / Sujet principal
            </h4>
            <p className="text-base font-bold text-slate-850 dark:text-slate-50 leading-snug">
              {mail.objet}
            </p>
          </div>

          <hr className="border-slate-100 dark:border-slate-800/80" />

          {/* Key attributes grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* Correspondent */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center">
                <User className="w-3.5 h-3.5 mr-1" />
                {mail.type === 'ARRIVEE' ? 'Provenance / Expéditeur' : 'Destinataire'}
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {mail.expeditriceDestinataire}
              </p>
            </div>

            {/* Department */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center">
                <Briefcase className="w-3.5 h-3.5 mr-1" />
                Département Affecté
              </span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {mail.departement}
              </p>
            </div>

            {/* Date Creation */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                Date Document (Papier)
              </span>
              <p className="text-slate-700 dark:text-slate-350 font-mono">
                {new Date(mail.dateCourrier).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* Date Enregistrement */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center">
                <Bookmark className="w-3.5 h-3.5 mr-1" />
                Date d'Enregistrement
              </span>
              <p className="text-slate-700 dark:text-slate-350 font-mono">
                {new Date(mail.dateEnregistrement).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* Current workflow status */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Statut de Traitement
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusMeta.bg} ${statusMeta.text}`}>
                {statusMeta.label}
              </span>
            </div>

            {/* Priority order */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                Niveau d'Urgence
              </span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${priorityMeta.badgeBg} ${priorityMeta.badgeText}`}>
                {priorityMeta.label}
              </span>
            </div>
          </div>

          {/* Notes description block */}
          {mail.notes && (
            <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-lg p-3.5">
              <span className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Notes et consignes de suivi
              </span>
              <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {mail.notes}
              </p>
            </div>
          )}

          {/* Simulated Attachment Link */}
          {mail.pieceJointeNom && (
            <div className="bg-blue-50/40 dark:bg-sky-950/20 border border-blue-105 dark:border-blue-900/30 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4.5 h-4.5 text-blue-500 select-none animate-pulse" />
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {mail.pieceJointeNom}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">Fichier numérisé (PDF)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert(`Simulated Download/Preview of scanned document "${mail.pieceJointeNom}"`)}
                className="p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 hover:text-blue-600 dark:text-slate-300 transition cursor-pointer"
                title="Consulter le fichier"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Action button bar */}
        <div id="details-actions" className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-150 dark:border-slate-800 flex items-center justify-between">
          <div>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir supprimer définitivement ce courrier ?')) {
                    onDelete(mail.id);
                    onClose();
                  }
                }}
                className="text-xs font-bold text-rose-650 hover:text-rose-700 transition cursor-pointer"
              >
                Supprimer la fiche
              </button>
            ) : (
              <span className="text-[10px] font-semibold text-slate-400 select-none">
                Édition bloquée (Mode Lecteur)
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Fermer
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  onEdit(mail);
                  onClose();
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-100 dark:shadow-none transition cursor-pointer"
              >
                Modifier la fiche
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
