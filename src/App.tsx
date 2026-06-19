/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Courrier, MailStatus, DEPARTEMENTS } from './types';
import { INITIAL_COURRIERS } from './mockData';
import MailStats from './components/MailStats';
import MailFilters from './components/MailFilters';
import MailTable from './components/MailTable';
import MailFormModal from './components/MailFormModal';
import MailDetailsModal from './components/MailDetailsModal';
import { Mail, Plus, RotateCcw, FileText, LayoutGrid, ListFilter, HelpCircle, CheckCircle } from 'lucide-react';

export default function App() {
  // Core state for registry
  const [courriers, setCourriers] = useState<Courrier[]>([]);
  const [loaded, setLoaded] = useState(false);
  
  // Administrative Simulation State
  const [isAdmin, setIsAdmin] = useState(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingMail, setEditingMail] = useState<Courrier | null>(null);
  const [selectedMail, setSelectedMail] = useState<Courrier | null>(null);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active comprehensive filters state
  const [filters, setFilters] = useState({
    search: '',
    type: 'ALL',
    departement: 'ALL',
    statut: 'ALL',
    priorite: 'ALL',
    startDate: '',
    endDate: '',
    sortBy: 'dateEnregistrement' as 'dateEnregistrement' | 'reference' | 'dateCourrier',
    sortOrder: 'desc' as 'asc' | 'desc',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('registry_courriers_data');
    if (stored) {
      try {
        setCourriers(JSON.parse(stored));
      } catch (e) {
        setCourriers(INITIAL_COURRIERS);
      }
    } else {
      setCourriers(INITIAL_COURRIERS);
      localStorage.setItem('registry_courriers_data', JSON.stringify(INITIAL_COURRIERS));
    }
    setLoaded(true);
  }, []);

  // Save to localStorage when changed
  const saveCourriers = (newData: Courrier[]) => {
    setCourriers(newData);
    localStorage.setItem('registry_courriers_data', JSON.stringify(newData));
  };

  // Show friendly auto-dismissing feedback messages
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Create or Update mail logic
  const handleFormSubmit = (submittedMail: Courrier) => {
    if (!isAdmin) {
      showToast("Accès refusé : Droits d'administrateur requis pour enregistrer ou modifier un courrier.");
      return;
    }

    const exists = courriers.some((c) => c.id === submittedMail.id);
    let updated: Courrier[];
    
    if (exists) {
      updated = courriers.map((c) => (c.id === submittedMail.id ? submittedMail : c));
      showToast(`Le courrier n° ${submittedMail.reference} a été modifié avec succès.`);
    } else {
      // Prevent duplicate reference numbers
      const isRefDup = courriers.some(
        (c) => c.reference.trim().toLowerCase() === submittedMail.reference.trim().toLowerCase()
      );
      if (isRefDup) {
        alert(`Erreur : Le numéro de référence "${submittedMail.reference}" est déjà attribué à un autre courrier.`);
        return;
      }
      updated = [submittedMail, ...courriers];
      showToast(`Le courrier n° ${submittedMail.reference} a été enregistré et affecté.`);
    }

    saveCourriers(updated);
    setEditingMail(null);
  };

  const handleDeleteMail = (id: string) => {
    if (!isAdmin) {
      showToast("Accès refusé : Vous devez être connecté en tant qu'administrateur pour supprimer des courriers.");
      return;
    }
    const targetMail = courriers.find((c) => c.id === id);
    const updated = courriers.filter((c) => c.id !== id);
    saveCourriers(updated);
    if (targetMail) {
      showToast(`Courrier ${targetMail.reference} supprimé définitivement.`);
    }
  };

  // Quick inline status toggle action from logs list
  const handleQuickStatusChange = (id: string, newStatus: MailStatus) => {
    if (!isAdmin) {
      showToast("Accès refusé : Seuls les administrateurs peuvent modifier rapidement les statuts.");
      return;
    }
    const updated = courriers.map((c) => {
      if (c.id === id) {
        return { ...c, statut: newStatus };
      }
      return c;
    });
    saveCourriers(updated);
    const target = courriers.find((c) => c.id === id);
    if (target) {
      showToast(`Statut de ${target.reference} mis à jour.`);
    }
  };

  // Reload default mock data demo state
  const handleResetToDemo = () => {
    if (!isAdmin) {
      showToast("Accès refusé : Seul l'administrateur système peut réinitialiser le registre.");
      return;
    }
    if (confirm('Voulez-vous réinitialiser le registre aux données de démonstration ? (Vos changements actuels seront écrasés)')) {
      saveCourriers(INITIAL_COURRIERS);
      showToast('Registre réinitialisé avec succès avec les données types.');
    }
  };

  // Active filter logic inside client memory
  const filteredCourriers = courriers
    .filter((c) => {
      // 1. Text Search matches reference, object, correspondent, notes
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const refMatch = c.reference.toLowerCase().includes(query);
        const objMatch = c.objet.toLowerCase().includes(query);
        const corrMatch = c.expeditriceDestinataire.toLowerCase().includes(query);
        const notesMatch = c.notes?.toLowerCase().includes(query) || false;
        
        if (!refMatch && !objMatch && !corrMatch && !notesMatch) {
          return false;
        }
      }

      // 2. Mail Type Filter
      if (filters.type !== 'ALL' && c.type !== filters.type) {
        return false;
      }

      // 3. Department Filter
      if (filters.departement !== 'ALL' && c.departement !== filters.departement) {
        return false;
      }

      // 4. Status Filter
      if (filters.statut !== 'ALL' && c.statut !== filters.statut) {
        return false;
      }

      // 5. Priority Filter
      if (filters.priorite !== 'ALL' && c.priorite !== filters.priorite) {
        return false;
      }

      // 6. Start date filter
      if (filters.startDate && c.dateEnregistrement < filters.startDate) {
        return false;
      }

      // 7. End date filter
      if (filters.endDate && c.dateEnregistrement > filters.endDate) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort handling
      let comparison = 0;
      if (filters.sortBy === 'dateEnregistrement') {
        comparison = a.dateEnregistrement.localeCompare(b.dateEnregistrement);
      } else if (filters.sortBy === 'reference') {
        comparison = a.reference.localeCompare(b.reference);
      } else if (filters.sortBy === 'dateCourrier') {
        comparison = a.dateCourrier.localeCompare(b.dateCourrier);
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

  // Allow smart bidirectional department selection from statistics tables
  const handleSelectDeptForReport = (dept: string) => {
    setFilters((prev) => ({
      ...prev,
      departement: dept,
    }));
  };

  if (!loaded) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-500">Chargement de votre registre sécurisé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 selection:bg-sky-100 dark:selection:bg-sky-950">
      
      {/* Dynamic Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center bg-slate-900 text-slate-100 dark:bg-white dark:text-slate-900 border border-slate-700/10 shadow-xl px-4 py-3 rounded-xl transition duration-300 animate-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5 mr-2.5 text-emerald-500 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Structural Layout Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm select-none">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                GESCO <span className="text-indigo-600 dark:text-indigo-400 uppercase text-[10px] font-bold ml-1.5 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded">Admin</span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none mt-1">
                Système de Gestion des Courriers Arrivée & Départ
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Demo Reset Trigger */}
            <button
              onClick={handleResetToDemo}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
              title="Charger les courriers par défaut de démonstration"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Main Action Register New */}
            <button
              id="header-register-button"
              onClick={() => {
                if (!isAdmin) {
                  showToast("Accès restreint : Seuls les administrateurs peuvent enregistrer un nouveau courrier.");
                  return;
                }
                setEditingMail(null);
                setIsFormOpen(true);
              }}
              className={`flex items-center justify-center px-4 py-2 text-white rounded-lg font-bold text-xs shadow-md transition cursor-pointer ${
                isAdmin 
                  ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 dark:shadow-none' 
                  : 'bg-slate-400 hover:bg-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Nouveau Courrier
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Sub-Header Greeting Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
              Console d'Administration — GESCO v2.1
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Opérateur : <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-100/50 dark:border-indigo-900/35">damangseid82@gmail.com</span>
              </span>
              <span className="text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wide">
                Habilité (Admin)
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Interactive Admin simulation toggles to test restricted modes */}
            <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 select-none">
                SIMULATION DE RÔLE :
              </span>
              <div className="inline-flex rounded-md p-0.5 bg-slate-50 dark:bg-slate-950/40">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdmin(true);
                    showToast("Mode Administrateur activé : vous disposez de tous les droits de création, modification, suppression et export.");
                  }}
                  className={`px-3 py-1 text-[11px] font-bold rounded-sm transition-all cursor-pointer ${
                    isAdmin
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Accorder les privilèges d'administrateur complets"
                >
                  ADMINISTRATEUR
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdmin(false);
                    showToast("Mode Lecteur activé : modifications, créations, et suppressions restreintes pour test.");
                  }}
                  className={`px-3 py-1 text-[11px] font-bold rounded-sm transition-all cursor-pointer ${
                    !isAdmin
                      ? 'bg-slate-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                  title="Simuler un rôle de lecteur ou d'opérateur non autorisé"
                >
                  LECTEUR SEULE
                </button>
              </div>
            </div>
            
            <div className="text-right text-xs text-slate-450 dark:text-slate-500 font-mono self-center">
              Opération : {new Date().toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Section 1: Dashboard Analytics Reports & Departmental matrix */}
        <section id="statistics-section">
          <MailStats
            courriers={courriers}
            selectedDepartmentForReport={filters.departement}
            setSelectedDepartmentForReport={handleSelectDeptForReport}
          />
        </section>

        {/* Section 2: Comprehensive dynamic sorting and searching */}
        <section id="filters-section" className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="p-1 px-1.5 bg-slate-100 dark:bg-slate-800 rounded font-bold text-[10px] text-slate-600 dark:text-slate-400">
              FILTRES
            </span>
            <p className="text-xs font-semibold text-slate-450 dark:text-slate-400 uppercase tracking-widest">
              Recherche avancée et filtrage rapide du registre
            </p>
          </div>
          <MailFilters filters={filters} setFilters={setFilters} />
        </section>

        {/* Section 3: Primary records registry logs */}
        <section id="registry-log-section">
          <MailTable
            courriers={filteredCourriers}
            onViewDetails={(mail) => {
              setSelectedMail(mail);
              setIsDetailsOpen(true);
            }}
            onEdit={(mail) => {
              setEditingMail(mail);
              setIsFormOpen(true);
            }}
            onDelete={handleDeleteMail}
            onStatusChange={handleQuickStatusChange}
            filters={filters}
            isAdmin={isAdmin}
          />
        </section>

      </main>

      {/* Footer Info Statement */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800 py-8 mt-12 text-center text-xs text-slate-450 dark:text-slate-500 space-y-2">
        <p className="font-semibold text-slate-500 dark:text-slate-400">
          Système Sécurisé de Registre de Courriers Officiels — Ville & Services Techniques
        </p>
        <p>
          Conforme aux normes de traçabilité des courriers d'arrivée et de départ d'organisation.
        </p>
        <p className="font-mono text-[10px] py-1 text-slate-400">
          Enregistré sous l'adresse applicative de gestion localisée.
        </p>
      </footer>

      {/* Dynamic Creation/Modification Dialog Modal */}
      <MailFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingMail(null);
        }}
        onSubmit={handleFormSubmit}
        editingMail={editingMail}
        existingMails={courriers}
      />

      {/* Dynamic Detail Card Drawer Modal */}
      <MailDetailsModal
        mail={selectedMail}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedMail(null);
        }}
        onEdit={(mail) => {
          setEditingMail(mail);
          setIsFormOpen(true);
        }}
        onDelete={handleDeleteMail}
        isAdmin={isAdmin}
      />

    </div>
  );
}

