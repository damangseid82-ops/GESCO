import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Courrier, STATUTS_LABELS, PRIORITES_LABELS } from '../types';

/**
 * Exports the filtered active mail registry to a beautifully formatted PDF document.
 */
export function exportCourriersToPDF(
  courriers: Courrier[],
  filters: {
    search: string;
    type: string;
    departement: string;
    statut: string;
    priorite: string;
    startDate: string;
    endDate: string;
  }
) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  // Color Palette
  const primaryColor = [30, 41, 59]; // Slate 800
  const secondaryColor = [71, 85, 105]; // Slate 600
  const accentColor = [14, 116, 144]; // Cyan 700

  // 1. Header Frame & Styling
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 297, 40, 'F'); // Main header dark band

  // White text in header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('REGISTRE ET SUIVI DES COURRIERS', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Système automatisé de gestion - Direction & Services', 15, 25);
  doc.text(`Généré le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 15, 32);

  // Stats summary right-aligned in header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('SYNTHÈSE DU RAPPORT', 215, 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const total = courriers.length;
  const arrivees = courriers.filter(c => c.type === 'ARRIVEE').length;
  const departs = courriers.filter(c => c.type === 'DEPART').length;
  const urgente = courriers.filter(c => c.priorite === 'URGENT').length;
  doc.text(`Total éléments : ${total}`, 215, 20);
  doc.text(`Courriers Arrivée : ${arrivees}`, 215, 25);
  doc.text(`Courriers Départ  : ${departs}`, 215, 30);
  doc.text(`Priorité Urgente  : ${urgente}`, 215, 35);

  // 2. Filters Info Banner
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Filtres et critères appliqués :', 15, 48);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  const filterSummary = [
    `Type: ${filters.type === 'ALL' ? 'Tous' : filters.type}`,
    `Département: ${filters.departement === 'ALL' ? 'Tous' : filters.departement}`,
    `Statut: ${filters.statut === 'ALL' ? 'Tous' : STATUTS_LABELS[filters.statut as any]?.label || filters.statut}`,
    `Priorité: ${filters.priorite === 'ALL' ? 'Tous' : PRIORITES_LABELS[filters.priorite as any]?.label || filters.priorite}`,
  ].join('  |  ');

  const dateRangeSummary = `Période: ${filters.startDate || 'Origine'} au ${filters.endDate || 'Présent'}`;
  doc.text(`${filterSummary}   [${dateRangeSummary}]`, 15, 54);

  // Line separator
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.setLineWidth(0.5);
  doc.line(15, 58, 282, 58);

  // 3. Grid Table of Mails
  const tableHeaders = [
    ['Référence', 'Type', 'Date Enreg.', 'Date Doc.', 'Correspondant', 'Objet / Sujet', 'Département', 'Statut', 'Priorité']
  ];

  const tableRows = courriers.map(c => [
    c.reference,
    c.type === 'ARRIVEE' ? 'Arrivée' : 'Départ',
    c.dateEnregistrement,
    c.dateCourrier,
    c.expeditriceDestinataire,
    c.objet,
    c.departement,
    STATUTS_LABELS[c.statut]?.label || c.statut,
    PRIORITES_LABELS[c.priorite]?.label || c.priorite,
  ]);

  (doc as any).autoTable({
    startY: 62,
    head: tableHeaders,
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 2.5,
      valign: 'middle',
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 28 }, // Reference
      1: { cellWidth: 16 }, // Type
      2: { cellWidth: 22 }, // Date Enreg
      3: { cellWidth: 22 }, // Date Doc
      4: { cellWidth: 40 }, // Correspondant
      5: { cellWidth: 65 }, // Objet
      6: { cellWidth: 45 }, // Département
      7: { cellWidth: 20 }, // Statut
      8: { cellWidth: 16 }, // Priorité
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // Slate 50
    },
    margin: { left: 15, right: 15 },
    didDrawPage: (data: any) => {
      // Footer page counting
      const str = `Page ${data.pageNumber}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(str, 282 - doc.getTextWidth(str), 200);
      doc.text('Document confidentiel édité par le service de gestion des courriers', 15, 200);
    },
  });

  // Save the document
  const fileName = `Rapport_Courriers_${new Date().toISOString().substring(0, 10)}.pdf`;
  doc.save(fileName);
}

/**
 * Exports a focused, professional Departmental Audit / Summary Report to PDF.
 */
export function exportDepartementReportToPDF(
  departementsData: Array<{
    name: string;
    total: number;
    arrivees: number;
    departs: number;
    traite: number;
    enCours: number;
    aTraiter: number;
    urgent: number;
  }>,
  totalGlobal: number
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [30, 41, 59]; // Slate 800
  const secondaryColor = [71, 85, 105]; // Slate 600

  // Header banner
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('RAPPORT D\'ACTIVITÉ PAR DÉPARTEMENT', 15, 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Analyse consolidée de la distribution et des flux de courrier', 15, 22);
  doc.text(`Date de génération : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 15, 28);

  // Global Info box
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFillColor(241, 245, 249); // Slate 100
  doc.rect(15, 42, 180, 20, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('RÉCAPITULATIF CORPORATE', 20, 49);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  
  const totalArrivees = departementsData.reduce((acc, d) => acc + d.arrivees, 0);
  const totalDeparts = departementsData.reduce((acc, d) => acc + d.departs, 0);
  const totalUrgent = departementsData.reduce((acc, d) => acc + d.urgent, 0);
  doc.text(`Total Courriers : ${totalGlobal}  |  Arrivées : ${totalArrivees}  |  Départs : ${totalDeparts}  |  Urgents en attente : ${totalUrgent}`, 20, 56);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 70, 195, 70);

  // Table header
  const tableHeaders = [
    ['Département', 'Total Régistre', 'Flux Arrivées', 'Flux Départs', 'Résolus (Traité)', 'En cours', 'À traiter', 'Urgents']
  ];

  const tableRows = departementsData.map(d => [
    d.name,
    d.total.toString(),
    d.arrivees.toString(),
    d.departs.toString(),
    d.traite.toString(),
    d.enCours.toString(),
    d.aTraiter.toString(),
    d.urgent.toString(),
  ]);

  // Add virtual total row at the end
  tableRows.push([
    'TOTAL GÉNÉRAL',
    totalGlobal.toString(),
    totalArrivees.toString(),
    totalDeparts.toString(),
    departementsData.reduce((acc, d) => acc + d.traite, 0).toString(),
    departementsData.reduce((acc, d) => acc + d.enCours, 0).toString(),
    departementsData.reduce((acc, d) => acc + d.aTraiter, 0).toString(),
    totalUrgent.toString()
  ]);

  (doc as any).autoTable({
    startY: 75,
    head: tableHeaders,
    body: tableRows,
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      valign: 'middle',
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 }, // Dept name
      1: { cellWidth: 20, halign: 'center' }, // Total
      2: { cellWidth: 22, halign: 'center' }, // Arrivées
      3: { cellWidth: 20, halign: 'center' }, // Départs
      4: { cellWidth: 22, halign: 'center' }, // Traité
      5: { cellWidth: 16, halign: 'center' }, // En cours
      6: { cellWidth: 16, halign: 'center' }, // À traiter
      7: { cellWidth: 14, halign: 'center', fontStyle: 'bold' }, // Urgentes
    },
    didParseCell: (data: any) => {
      // Highlight the total general row
      if (data.row.index === tableRows.length - 1) {
        data.cell.styles.fillColor = [226, 232, 240];
        data.cell.styles.fontStyle = 'bold';
      }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 15, right: 15 },
    didDrawPage: (data: any) => {
      const str = `Page ${data.pageNumber}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.text(str, 195 - doc.getTextWidth(str), 282);
      doc.text('Registre et Suivi des Courriers administratifs - Direction Générale', 15, 282);
    }
  });

  const fileName = `Rapport_Analytique_Departements_${new Date().toISOString().substring(0, 10)}.pdf`;
  doc.save(fileName);
}
