export type MailType = 'ARRIVEE' | 'DEPART';

export type MailStatus = 'A_TRAITER' | 'EN_COURS' | 'TRAITE' | 'ARCHIVE';

export type MailPriority = 'BASSE' | 'MOYENNE' | 'URGENT';

export interface Courrier {
  id: string;
  type: MailType;
  reference: string;
  dateEnregistrement: string; // ISO date of system entry
  dateCourrier: string;       // Date written on the mail itself
  expeditriceDestinataire: string; // Sender for ARRIVEE, Receiver for DEPART
  objet: string;
  departement: string;
  statut: MailStatus;
  priorite: MailPriority;
  notes?: string;
  pieceJointeNom?: string; // Optional simulated attachment name
}

export const DEPARTEMENTS = [
  'Direction générale',
  'Ressources Humaines',
  'Finance & Comptabilité',
  'Technique & Informatique',
  'Commercial & Marketing',
  'Juridique & Contentieux',
  'Logistique & Achats',
];

export const STATUTS_LABELS: Record<MailStatus, { label: string; bg: string; text: string }> = {
  A_TRAITER: { label: 'À traiter', bg: 'bg-amber-100 dark:bg-amber-950/40', text: 'text-amber-800 dark:text-amber-300' },
  EN_COURS: { label: 'En cours', bg: 'bg-blue-100 dark:bg-blue-950/40', text: 'text-blue-800 dark:text-blue-300' },
  TRAITE: { label: 'Traité', bg: 'bg-emerald-100 dark:bg-emerald-950/40', text: 'text-emerald-800 dark:text-emerald-300' },
  ARCHIVE: { label: 'Archivé', bg: 'bg-slate-100 dark:bg-slate-800/40', text: 'text-slate-800 dark:text-slate-300' },
};

export const PRIORITES_LABELS: Record<MailPriority, { label: string; color: string; badgeBg: string; badgeText: string }> = {
  BASSE: { label: 'Basse', color: 'text-gray-500', badgeBg: 'bg-gray-50', badgeText: 'text-gray-700' },
  MOYENNE: { label: 'Moyenne', color: 'text-orange-500', badgeBg: 'bg-orange-50', badgeText: 'text-orange-700' },
  URGENT: { label: 'Urgent !', color: 'text-rose-600 font-semibold', badgeBg: 'bg-rose-50 border border-rose-200', badgeText: 'text-rose-700' },
};
