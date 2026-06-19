import React from 'react';
import { Courrier, DEPARTEMENTS } from '../types';
import { Mail, Send, CheckCircle2, AlertTriangle, Building, FileText, TrendingUp } from 'lucide-react';
import { exportDepartementReportToPDF } from '../utils/pdfExport';

interface MailStatsProps {
  courriers: Courrier[];
  selectedDepartmentForReport: string;
  setSelectedDepartmentForReport: (dept: string) => void;
}

export default function MailStats({
  courriers,
  selectedDepartmentForReport,
  setSelectedDepartmentForReport,
}: MailStatsProps) {
  // Global counts
  const totalCount = courriers.length;
  const arriveeCount = courriers.filter((c) => c.type === 'ARRIVEE').length;
  const departCount = courriers.filter((c) => c.type === 'DEPART').length;
  const traiteCount = courriers.filter((c) => c.statut === 'TRAITE').length;
  const enCoursCount = courriers.filter((c) => c.statut === 'EN_COURS').length;
  const aTraiterCount = courriers.filter((c) => c.statut === 'A_TRAITER').length;
  const urgentCount = courriers.filter((c) => c.priorite === 'URGENT').length;

  // Departmental intelligence engine (Automated reports sorted by Department)
  const departementsReportData = DEPARTEMENTS.map((dept) => {
    const deptMails = courriers.filter((c) => c.departement === dept);
    return {
      name: dept,
      total: deptMails.length,
      arrivees: deptMails.filter((c) => c.type === 'ARRIVEE').length,
      departs: deptMails.filter((c) => c.type === 'DEPART').length,
      traite: deptMails.filter((c) => c.statut === 'TRAITE').length,
      enCours: deptMails.filter((c) => c.statut === 'EN_COURS').length,
      aTraiter: deptMails.filter((c) => c.statut === 'A_TRAITER').length,
      urgent: deptMails.filter((c) => c.priorite === 'URGENT' && c.statut !== 'TRAITE').length,
    };
  }).sort((a, b) => b.total - a.total); // Sort by busiest department by default

  // Export departmental summary
  const handleExportDeptReport = () => {
    exportDepartementReportToPDF(departementsReportData, totalCount);
  };

  return (
    <div id="statistics-panel" className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total General */}
        <div id="stat-card-total" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Volume Global</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">{totalCount}</h3>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-750 rounded-xl">
              <FileText className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-sky-600">{arriveeCount}</span>
            <span>Arrivées</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="font-semibold text-emerald-600">{departCount}</span>
            <span>Départs</span>
          </div>
        </div>

        {/* À Traiter */}
        <div id="stat-card-pending" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-amber-555 dark:text-amber-400 uppercase tracking-wider">À Traiter / En Cours</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1">
                {aTraiterCount + enCoursCount}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-amber-600">{aTraiterCount} En attente</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-semibold text-blue-600">{enCoursCount} En cours</span>
          </div>
        </div>

        {/* Traités et Archivés */}
        <div id="stat-card-completed" className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Courriers Résolus</p>
              <h3 className="text-2xl font-bold text-emerald-650 dark:text-emerald-405 mt-1">{traiteCount}</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center mt-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Taux de résolution : {totalCount > 0 ? Math.round((traiteCount / totalCount) * 100) : 0}% de l'ensemble
          </div>
        </div>

        {/* Urgences actives */}
        <div id="stat-card-urgencies" className="bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-950 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-rose-550 dark:text-rose-400 uppercase tracking-wider">Urgences Non Résolues</p>
              <h3 className="text-2xl font-bold text-rose-650 mt-1">{urgentCount}</h3>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 rounded-xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center mt-3 text-xs text-rose-500 dark:text-rose-400">
            Requiert une attention prioritaire de la direction
          </div>
        </div>
      </div>

      {/* Analytics & Department Breakdown section */}
      <div id="departmental-breakdown" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center">
              <Building className="w-5 h-5 mr-2 text-slate-600 dark:text-slate-400" />
              Rapport automatisé par Département (Tri intelligent)
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Statistiques d’activité triées automatiquement par volume de courrier affecté.
            </p>
          </div>
          <button
            id="export-dept-pdf-button"
            onClick={handleExportDeptReport}
            className="flex items-center justify-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg shadow-indigo-100 dark:shadow-none transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 mr-2" />
            Exporter Rapport Analytique (PDF)
          </button>
        </div>

        {/* Micro Dashboard Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-medium">
                <th className="py-3 px-4 rounded-l-lg">Département d'Intérêt</th>
                <th className="py-3 px-3 text-center">Volume Global</th>
                <th className="py-3 px-3 text-center">Arrivées</th>
                <th className="py-3 px-3 text-center">Départs</th>
                <th className="py-3 px-3 text-center text-emerald-600">Résolu (Traité)</th>
                <th className="py-3 px-3 text-center text-blue-500">En cours</th>
                <th className="py-3 px-3 text-center text-orange-500">À Traiter</th>
                <th className="py-3 px-3 text-center text-rose-500 rounded-r-lg">Urgences Actives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {departementsReportData.map((dept) => {
                const isSelected = selectedDepartmentForReport === dept.name;
                return (
                  <tr
                    key={dept.name}
                    id={`dept-row-${dept.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => {
                      setSelectedDepartmentForReport(
                        selectedDepartmentForReport === dept.name ? 'ALL' : dept.name
                      );
                    }}
                    className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-sky-50/70 dark:bg-sky-950/20 font-medium border-l-2 border-sky-500' : ''
                    }`}
                    title="Cliquez pour filtrer la liste des courriers par ce département"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-100">
                      {dept.name}
                      {isSelected && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-350">
                          Filtre actif
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                      {dept.total}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-600 dark:text-slate-400">
                      {dept.arrivees > 0 ? (
                        <span className="flex items-center justify-center space-x-1">
                          <Mail className="w-3 h-3 text-sky-500" />
                          <span>{dept.arrivees}</span>
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center text-slate-600 dark:text-slate-400">
                      {dept.departs > 0 ? (
                        <span className="flex items-center justify-center space-x-1">
                          <Send className="w-3 h-3 text-emerald-500" />
                          <span>{dept.departs}</span>
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                      {dept.traite}
                    </td>
                    <td className="py-3.5 px-3 text-center text-blue-600 dark:text-blue-400">
                      {dept.enCours}
                    </td>
                    <td className="py-3.5 px-3 text-center text-amber-600 dark:text-amber-400">
                      {dept.aTraiter}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {dept.urgent > 0 ? (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-450 animate-pulse">
                          {dept.urgent} urgent
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
