import React, { useState } from 'react';
import { Courrier, STATUTS_LABELS, PRIORITES_LABELS, MailStatus } from '../types';
import { Mail, Send, Eye, Edit2, Trash2, CheckCircle2, FileText, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import { exportCourriersToPDF } from '../utils/pdfExport';

interface MailTableProps {
  courriers: Courrier[];
  onViewDetails: (mail: Courrier) => void;
  onEdit: (mail: Courrier) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: MailStatus) => void;
  filters: any;
  isAdmin?: boolean;
}

export default function MailTable({
  courriers,
  onViewDetails,
  onEdit,
  onDelete,
  onStatusChange,
  filters,
  isAdmin = true,
}: MailTableProps) {
  // Highlight search substring
  const highlightSearch = (text: string, search: string) => {
    if (!search || !text) return <>{text}</>;
    const index = text.toLowerCase().indexOf(search.toLowerCase());
    if (index === -1) return <>{text}</>;
    
    const before = text.substring(0, index);
    const match = text.substring(index, index + search.length);
    const after = text.substring(index + search.length);
    
    return (
      <>
        {before}
        <strong className="bg-yellow-250 bg-amber-200 dark:bg-amber-900/60 rounded-xs text-slate-900 dark:text-slate-50 px-0.5">
          {match}
        </strong>
        {after}
      </>
    );
  };

  // Export current list to PDF
  const handleExportList = () => {
    exportCourriersToPDF(courriers, filters);
  };

  return (
    <div id="registry-table-card" className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-4">
      
      {/* Header bar of the registry log */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-slate-50/70 dark:bg-slate-850/50 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-850 dark:text-slate-100 flex items-center">
            Registre des flux ({courriers.length} {courriers.length > 1 ? 'enregistrements' : 'enregistrement'})
          </h3>
          <p className="text-xs text-slate-450 dark:text-slate-400 mt-1">
            Recherche dynamique sur l'ensemble des numéros de suivis et correspondants.
          </p>
        </div>

        {courriers.length > 0 && (
          <button
            id="export-list-pdf-button"
            onClick={handleExportList}
            className="flex items-center justify-center px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-705 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:bg-slate-750 transition-all rounded-lg cursor-pointer"
          >
            <FileText className="w-4 h-4 mr-1.5 text-rose-500" />
            Exporter la liste actuelle (PDF)
          </button>
        )}
      </div>

      {courriers.length === 0 ? (
        /* Empty state view */
        <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 rounded-full">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Aucun courrier ne correspond à vos critères
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Essayez de réinitialiser vos dates, de changer le département ou de simplifier votre filtre de texte.
            </p>
          </div>
        </div>
      ) : (
        /* Desktop Table View */
        <div id="table-view" className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider select-none">
                <th className="py-3 px-4">Référence</th>
                <th className="py-3 px-3">Flux</th>
                <th className="py-3 px-3">Dates</th>
                <th className="py-3 px-4">Correspondant</th>
                <th className="py-3 px-4">Objet & Sujet</th>
                <th className="py-3 px-4">Département</th>
                <th className="py-3 px-3 text-center">Urgence</th>
                <th className="py-3 px-3 text-center">Statut</th>
                <th className="py-3 px-4 text-center rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {courriers.map((mail) => {
                const statusTheme = STATUTS_LABELS[mail.statut] || { label: mail.statut, bg: 'bg-gray-100', text: 'text-gray-800' };
                const priorityTheme = PRIORITES_LABELS[mail.priorite] || { label: mail.priorite, color: '', badgeBg: '', badgeText: '' };
                const isArrivee = mail.type === 'ARRIVEE';

                return (
                  <tr
                    key={mail.id}
                    id={`mail-row-${mail.reference.toLowerCase()}`}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    {/* Reference */}
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-850 dark:text-slate-100">
                      <button
                        onClick={() => onViewDetails(mail)}
                        className="hover:underline flex items-center space-x-1 hover:text-indigo-600 text-left cursor-pointer"
                      >
                        <span>{mail.reference}</span>
                      </button>
                    </td>

                    {/* Type badge */}
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        isArrivee
                          ? 'bg-sky-50 dark:bg-sky-950/20 text-sky-850 dark:text-sky-300'
                          : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-850 dark:text-emerald-300'
                      }`}>
                        {isArrivee ? '📥 Arrivée' : '📤 Départ'}
                      </span>
                    </td>

                    {/* Calendar Dates */}
                    <td className="py-3.5 px-3 text-xs text-slate-500 dark:text-slate-450 space-y-0.5">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-[10px] text-slate-400">Doc:</span>
                        <span className="font-mono">{mail.dateCourrier}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-[10px] text-slate-400">Enr:</span>
                        <span className="font-mono">{mail.dateEnregistrement}</span>
                      </div>
                    </td>

                    {/* Sender / Receiver */}
                    <td className="py-3.5 px-4 max-w-[180px] truncate text-slate-800 dark:text-slate-205 font-medium text-xs">
                      {highlightSearch(mail.expeditriceDestinataire, filters.search)}
                    </td>

                    {/* Subject / Object description */}
                    <td className="py-3.5 px-4 max-w-[280px] truncate text-xs text-slate-650 dark:text-slate-300">
                      <div className="font-medium text-slate-800 dark:text-slate-100 truncate">
                        {highlightSearch(mail.objet, filters.search)}
                      </div>
                      {mail.notes && (
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate leading-relaxed mt-0.5">
                          {mail.notes}
                        </div>
                      )}
                    </td>

                    {/* Department Assigned */}
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {mail.departement}
                    </td>

                    {/* Urgency Priority badge */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${priorityTheme.badgeBg} ${priorityTheme.badgeText}`}>
                        {priorityTheme.label}
                      </span>
                    </td>

                    {/* Status Tracking with dynamic switch trigger */}
                    <td className="py-3.5 px-3 text-center">
                      <select
                        id={`status-toggle-${mail.id}`}
                        value={mail.statut}
                        disabled={!isAdmin}
                        onChange={(e) => onStatusChange(mail.id, e.target.value as any)}
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold border-none select-none ${
                          isAdmin 
                            ? `focus:ring-1 focus:ring-indigo-505 focus:ring-indigo-500 cursor-pointer ${statusTheme.bg} ${statusTheme.text}` 
                            : `opacity-70 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 cursor-not-allowed`
                        }`}
                        title={isAdmin ? "Changer rapidement le statut de ce courrier" : "Modification de statut réservée aux administrateurs"}
                      >
                        <option value="A_TRAITER">À traiter</option>
                        <option value="EN_COURS">En cours</option>
                        <option value="TRAITE">Traité</option>
                        <option value="ARCHIVE">Archivé</option>
                      </select>
                    </td>

                    {/* Detail operations menu */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          id={`action-view-${mail.id}`}
                          onClick={() => onViewDetails(mail)}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition cursor-pointer"
                          title="Fiche détaillée"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          id={`action-edit-${mail.id}`}
                          onClick={() => {
                            if (isAdmin) {
                              onEdit(mail);
                            }
                          }}
                          disabled={!isAdmin}
                          className={`p-1 rounded transition ${
                            isAdmin 
                              ? "text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer" 
                              : "text-slate-350 dark:text-slate-700 cursor-not-allowed opacity-40"
                          }`}
                          title={isAdmin ? "Modifier" : "Droits d'édition requis (Administrateur)"}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          id={`action-delete-${mail.id}`}
                          onClick={() => {
                            if (isAdmin && confirm('Supprimer ce courrier ?')) {
                              onDelete(mail.id);
                            }
                          }}
                          disabled={!isAdmin}
                          className={`p-1 rounded transition ${
                            isAdmin 
                              ? "text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer" 
                              : "text-slate-350 dark:text-slate-700 cursor-not-allowed opacity-40"
                          }`}
                          title={isAdmin ? "Supprimer" : "Droits de suppression requis (Administrateur)"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
