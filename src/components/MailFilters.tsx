import React from 'react';
import { MailType, MailStatus, MailPriority, DEPARTEMENTS, STATUTS_LABELS, PRIORITES_LABELS } from '../types';
import { Search, X, Calendar, ArrowUpDown, Filter } from 'lucide-react';

interface MailFiltersProps {
  filters: {
    search: string;
    type: string;
    departement: string;
    statut: string;
    priorite: string;
    startDate: string;
    endDate: string;
    sortBy: 'dateEnregistrement' | 'reference' | 'dateCourrier';
    sortOrder: 'asc' | 'desc';
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
}

export default function MailFilters({ filters, setFilters }: MailFiltersProps) {
  const handleReset = () => {
    setFilters({
      search: '',
      type: 'ALL',
      departement: 'ALL',
      statut: 'ALL',
      priorite: 'ALL',
      startDate: '',
      endDate: '',
      sortBy: 'dateEnregistrement',
      sortOrder: 'desc',
    });
  };

  const updateFilter = (key: string, value: any) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  // Count active filters (ignoring ALL, empty values and default sorting)
  const activeFiltersCount = Object.entries(filters).filter(([key, val]) => {
    if (key === 'sortBy' || key === 'sortOrder') return false;
    if (key === 'search' && val === '') return false;
    if ((key === 'startDate' || key === 'endDate') && val === '') return false;
    if (val === 'ALL') return false;
    return true;
  }).length;

  return (
    <div id="filter-container" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 p-5 shadow-sm space-y-4">
      {/* Search and Core Type Toggles */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            id="filter-search-input"
            type="text"
            placeholder="Rechercher par référence, objet, expéditeur, destinataire, notes..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Type Toggles */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start lg:self-auto shrink-0">
          <button
            id="type-filter-all"
            onClick={() => updateFilter('type', 'ALL')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filters.type === 'ALL'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Tous les flux
          </button>
          <button
            id="type-filter-arrivee"
            onClick={() => updateFilter('type', 'ARRIVEE')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filters.type === 'ARRIVEE'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Arrivée
          </button>
          <button
            id="type-filter-depart"
            onClick={() => updateFilter('type', 'DEPART')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filters.type === 'DEPART'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Départ
          </button>
        </div>
      </div>

      {/* Advanced Dropdown Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
        {/* Department Filter */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Département</label>
          <select
            id="filter-department-select"
            value={filters.departement}
            onChange={(e) => updateFilter('departement', e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            <option value="ALL">Tous les départements</option>
            {DEPARTEMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Statut de Traitement</label>
          <select
            id="filter-status-select"
            value={filters.statut}
            onChange={(e) => updateFilter('statut', e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            <option value="ALL">Tous les statuts</option>
            {Object.entries(STATUTS_LABELS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Priorité du Courrier</label>
          <select
            id="filter-priority-select"
            value={filters.priorite}
            onChange={(e) => updateFilter('priorite', e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 outline-none"
          >
            <option value="ALL">Toutes priorités</option>
            {Object.entries(PRIORITES_LABELS).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Début */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Date Début
          </label>
          <input
            id="filter-start-date"
            type="date"
            value={filters.startDate}
            onChange={(e) => updateFilter('startDate', e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Date Fin */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Date Fin
          </label>
          <input
            id="filter-end-date"
            type="date"
            value={filters.endDate}
            onChange={(e) => updateFilter('endDate', e.target.value)}
            className="w-full text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Sort & Order settings */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center">
            <ArrowUpDown className="w-3 h-3 mr-1" />
            Tri par défaut
          </label>
          <div className="flex items-center gap-1">
            <select
              id="filter-sort-by-select"
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="flex-1 text-xs bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              <option value="dateEnregistrement">Date Enreg.</option>
              <option value="reference">N° Référence</option>
              <option value="dateCourrier">Date Document</option>
            </select>
            <button
              id="sort-order-toggle"
              onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-slate-150 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 hover:text-slate-900 transition-all cursor-pointer"
              title={filters.sortOrder === 'asc' ? 'Ordre croissant' : 'Ordre décroissant'}
            >
              <span className="text-xs font-bold">{filters.sortOrder === 'asc' ? '▲' : '▼'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selected Filters count & Reset link */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {activeFiltersCount} filtre(s) actif(s) sur les courriers
          </span>
          <button
            id="reset-filters-button"
            onClick={handleReset}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Réinitialiser les filtres
          </button>
        </div>
      )}
    </div>
  );
}
