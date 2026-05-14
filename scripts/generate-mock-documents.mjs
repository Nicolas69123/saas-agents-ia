// Generate realistic mock documents for the Entreprise page.
// Outputs to public/mock/documents/

import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { fileURLToPath } from "url"
import PDFDocument from "pdfkit"
import ExcelJS from "exceljs"
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from "docx"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, "..", "public", "mock", "documents")
await mkdir(OUT_DIR, { recursive: true })

function pdfToBuffer(builder) {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 })
    const chunks = []
    doc.on("data", (c) => chunks.push(c))
    doc.on("end", () => resolve(Buffer.concat(chunks)))
    builder(doc)
    doc.end()
  })
}

// 1. Facture client (PDF)
async function genFactureClient() {
  const buf = await pdfToBuffer((doc) => {
    doc.fontSize(20).font("Helvetica-Bold").text("FACTURE", { align: "right" })
    doc.moveDown(0.3)
    doc.fontSize(10).font("Helvetica").fillColor("#666")
      .text("N° FAC-2026-0142", { align: "right" })
      .text("Date : 12 mai 2026", { align: "right" })
      .text("Échéance : 11 juin 2026", { align: "right" })
    doc.moveDown(1.5)

    doc.fillColor("#000").fontSize(11).font("Helvetica-Bold").text("OmnIA SAS")
    doc.font("Helvetica").fontSize(10)
      .text("42 rue de la Tech, 75011 Paris")
      .text("SIRET 902 451 783 00012  -  TVA FR 87 902 451 783")
      .text("contact@omniaa.eu")

    doc.moveDown(1)
    doc.font("Helvetica-Bold").text("Facturé à :")
    doc.font("Helvetica")
      .text("Cabinet Fiducial Conseil")
      .text("18 avenue de l'Opéra, 75001 Paris")
      .text("SIRET 552 014 224 00087")
    doc.moveDown(1.5)

    const y = doc.y
    doc.font("Helvetica-Bold").fontSize(10)
    doc.text("Description", 50, y, { width: 280 })
    doc.text("Qté", 340, y, { width: 40, align: "right" })
    doc.text("PU HT", 390, y, { width: 60, align: "right" })
    doc.text("Total HT", 460, y, { width: 90, align: "right" })
    doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke()
    doc.font("Helvetica").moveDown(0.7)

    const rows = [
      ["Abonnement OmnIA Pro - Mai 2026", 1, 490, 490],
      ["Pack agents IA premium (8 agents)", 1, 290, 290],
      ["Stockage documents 50 Go", 1, 39, 39],
      ["Onboarding équipe (3 sessions)", 3, 150, 450],
    ]
    let total = 0
    rows.forEach((r) => {
      const yy = doc.y
      doc.text(r[0], 50, yy, { width: 280 })
      doc.text(String(r[1]), 340, yy, { width: 40, align: "right" })
      doc.text(`${r[2].toFixed(2)} €`, 390, yy, { width: 60, align: "right" })
      doc.text(`${r[3].toFixed(2)} €`, 460, yy, { width: 90, align: "right" })
      total += r[3]
      doc.moveDown(0.4)
    })

    doc.moveDown(1)
    const tva = total * 0.20
    const ttc = total + tva
    doc.font("Helvetica").fontSize(10)
      .text(`Total HT : ${total.toFixed(2)} €`, { align: "right" })
      .text(`TVA 20% : ${tva.toFixed(2)} €`, { align: "right" })
    doc.font("Helvetica-Bold").fontSize(12)
      .text(`Total TTC : ${ttc.toFixed(2)} €`, { align: "right" })

    doc.moveDown(3)
    doc.font("Helvetica").fontSize(8).fillColor("#666")
      .text("Conditions : paiement à 30 jours par virement. IBAN FR76 1820 6004 3500 0000 1234 567.", { align: "center" })
      .text("Pas d'escompte pour règlement anticipé. Pénalité de retard : 3 fois le taux légal.", { align: "center" })
  })
  await writeFile(path.join(OUT_DIR, "facture-fiducial-mai-2026.pdf"), buf)
  console.log("Wrote facture-fiducial-mai-2026.pdf")
}

// 2. Contrat de prestation (PDF)
async function genContrat() {
  const buf = await pdfToBuffer((doc) => {
    doc.fontSize(18).font("Helvetica-Bold").text("CONTRAT DE PRESTATION DE SERVICES", { align: "center" })
    doc.moveDown(0.5)
    doc.fontSize(10).font("Helvetica").fillColor("#666").text("Référence CT-2026-007 - Signé le 03 avril 2026", { align: "center" })
    doc.moveDown(2)
    doc.fillColor("#000").fontSize(11).font("Helvetica-Bold").text("Entre les soussignés :")
    doc.moveDown(0.4)
    doc.font("Helvetica").fontSize(10)
      .text("OmnIA SAS, société par actions simplifiée au capital de 50 000 €,")
      .text("immatriculée au RCS de Paris sous le numéro 902 451 783,")
      .text("ayant son siège au 42 rue de la Tech, 75011 Paris,")
      .text("représentée par Nicolas Chalopin, en qualité de Président,")
      .text("ci-après dénommée \"OmnIA\",")
    doc.moveDown(0.5)
    doc.font("Helvetica-Bold").text("Et")
    doc.moveDown(0.3)
    doc.font("Helvetica")
      .text("Cabinet Fiducial Conseil SARL, au capital de 100 000 €,")
      .text("immatriculé au RCS de Paris sous le numéro 552 014 224,")
      .text("ayant son siège au 18 avenue de l'Opéra, 75001 Paris,")
      .text("représenté par Mme Hélène Royer, en qualité de Gérante,")
      .text("ci-après dénommé \"le Client\".")

    doc.moveDown(1)
    doc.font("Helvetica-Bold").fontSize(12).text("Article 1 - Objet")
    doc.font("Helvetica").fontSize(10).text("OmnIA met à disposition du Client sa plateforme SaaS OmnIA Pro comprenant 8 agents IA spécialisés (comptabilité, RH, support client, marketing, etc.) ainsi que les services d'accompagnement et de support afférents, pour une durée initiale de douze (12) mois.")

    doc.moveDown(0.8)
    doc.font("Helvetica-Bold").fontSize(12).text("Article 2 - Tarification")
    doc.font("Helvetica").fontSize(10).text("Le montant mensuel hors taxes est fixé à huit cent dix-neuf euros (819,00 €) HT, payable à terme échu par virement bancaire sur l'IBAN communiqué sur chaque facture, sous trente (30) jours.")

    doc.moveDown(0.8)
    doc.font("Helvetica-Bold").fontSize(12).text("Article 3 - Niveau de service")
    doc.font("Helvetica").fontSize(10).text("OmnIA garantit une disponibilité de 99,5 % calculée sur le mois calendaire, hors maintenances planifiées notifiées au moins 48 heures à l'avance. En cas de non-respect, un avoir au prorata sera émis sur la facture du mois suivant.")

    doc.moveDown(0.8)
    doc.font("Helvetica-Bold").fontSize(12).text("Article 4 - Confidentialité")
    doc.font("Helvetica").fontSize(10).text("Chaque partie s'engage à conserver strictement confidentielles toutes les informations échangées dans le cadre du présent contrat. Cette obligation perdurera pendant cinq (5) ans après l'expiration du contrat.")

    doc.moveDown(2)
    doc.font("Helvetica").fontSize(9).fillColor("#666")
      .text("Fait à Paris, le 3 avril 2026, en deux exemplaires originaux.", { align: "center" })
  })
  await writeFile(path.join(OUT_DIR, "contrat-fiducial-2026.pdf"), buf)
  console.log("Wrote contrat-fiducial-2026.pdf")
}

// 3. Statuts (PDF)
async function genStatuts() {
  const buf = await pdfToBuffer((doc) => {
    doc.fontSize(18).font("Helvetica-Bold").text("STATUTS D'OMNIA SAS", { align: "center" })
    doc.moveDown(0.3)
    doc.fontSize(10).font("Helvetica").fillColor("#666").text("Société par Actions Simplifiée au capital de 50 000 €", { align: "center" })
    doc.text("Mise à jour : 15 janvier 2026", { align: "center" })
    doc.moveDown(2)
    const articles = [
      ["TITRE I - FORME, OBJET, DÉNOMINATION, SIÈGE, DURÉE", null],
      ["Article 1 - Forme", "Il est formé entre les soussignés une société par actions simplifiée régie par les dispositions législatives et réglementaires en vigueur et par les présents statuts."],
      ["Article 2 - Objet", "La Société a pour objet, en France et à l'étranger : la conception, le développement, la commercialisation et l'exploitation de plateformes logicielles d'intelligence artificielle, notamment dans le domaine de l'automatisation des processus d'entreprise."],
      ["Article 3 - Dénomination", "La dénomination de la Société est : OMNIA"],
      ["Article 4 - Siège social", "Le siège social est fixé au 42 rue de la Tech, 75011 Paris."],
      ["Article 5 - Durée", "La durée de la Société est fixée à 99 années à compter de son immatriculation au RCS, sauf prorogation ou dissolution anticipée."],
      ["TITRE II - CAPITAL SOCIAL", null],
      ["Article 6 - Capital", "Le capital social est fixé à 50 000 euros, divisé en 5 000 actions de 10 euros chacune, intégralement souscrites et libérées."],
      ["Article 7 - Cession d'actions", "Les cessions d'actions à des tiers non actionnaires sont soumises à l'agrément préalable de la collectivité des associés statuant à la majorité des deux tiers."],
    ]
    articles.forEach(([title, body]) => {
      if (!body) {
        doc.moveDown(0.5)
        doc.font("Helvetica-Bold").fontSize(11).fillColor("#000").text(title)
        doc.moveDown(0.3)
      } else {
        doc.font("Helvetica-Bold").fontSize(10).fillColor("#000").text(title)
        doc.font("Helvetica").fontSize(10).text(body, { align: "justify" })
        doc.moveDown(0.5)
      }
    })
  })
  await writeFile(path.join(OUT_DIR, "statuts-omnia.pdf"), buf)
  console.log("Wrote statuts-omnia.pdf")
}

// 4. Bilan mensuel (XLSX)
async function genBilan() {
  const wb = new ExcelJS.Workbook()
  wb.creator = "OmnIA"
  wb.created = new Date()

  const ws = wb.addWorksheet("Bilan Avril 2026")
  ws.columns = [
    { header: "Compte", key: "code", width: 12 },
    { header: "Libellé", key: "label", width: 40 },
    { header: "Débit (€)", key: "debit", width: 15 },
    { header: "Crédit (€)", key: "credit", width: 15 },
  ]
  ws.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } }
  ws.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F46E5" } }

  const rows = [
    ["101000", "Capital social", "", 50000],
    ["106100", "Réserve légale", "", 5000],
    ["120000", "Résultat de l'exercice", "", 18450.32],
    ["164000", "Emprunts bancaires", "", 12000],
    ["211000", "Terrains", 0, ""],
    ["218300", "Matériel informatique", 28400, ""],
    ["281830", "Amort. matériel info", "", 9466.67],
    ["401000", "Fournisseurs", "", 4280.5],
    ["411000", "Clients", 18960, ""],
    ["445660", "TVA déductible", 1842.5, ""],
    ["445710", "TVA collectée", "", 3120],
    ["512000", "Banque BNP", 64129.99, ""],
    ["530000", "Caisse", 105, ""],
    ["606300", "Petit équipement", 920, ""],
    ["613500", "Locations diverses", 4800, ""],
    ["615000", "Entretien et réparations", 1230, ""],
    ["616000", "Primes d'assurances", 890, ""],
    ["622600", "Honoraires (comptable, juridique)", 3600, ""],
    ["625100", "Frais déplacements", 1480, ""],
    ["626000", "Frais postaux et télécom", 540, ""],
    ["641000", "Rémunérations personnel", 24600, ""],
    ["645000", "Charges sociales", 11070, ""],
    ["706000", "Prestations de services", "", 89400],
    ["707000", "Ventes de marchandises", "", 4200],
    ["768000", "Autres produits financiers", "", 184.32],
  ]
  let debTotal = 0, creTotal = 0
  rows.forEach((r) => {
    const row = ws.addRow({ code: r[0], label: r[1], debit: r[2] || "", credit: r[3] || "" })
    if (typeof r[2] === "number") debTotal += r[2]
    if (typeof r[3] === "number") creTotal += r[3]
    row.getCell(3).numFmt = "#,##0.00"
    row.getCell(4).numFmt = "#,##0.00"
  })

  const totalRow = ws.addRow({ code: "", label: "TOTAL", debit: debTotal, credit: creTotal })
  totalRow.font = { bold: true }
  totalRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE0E7FF" } }
  totalRow.getCell(3).numFmt = "#,##0.00"
  totalRow.getCell(4).numFmt = "#,##0.00"

  const ws2 = wb.addWorksheet("KPIs")
  ws2.columns = [
    { header: "Indicateur", key: "k", width: 35 },
    { header: "Valeur", key: "v", width: 20 },
    { header: "Variation M-1", key: "var", width: 15 },
  ]
  ws2.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } }
  ws2.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F46E5" } }
  const kpis = [
    ["Chiffre d'affaires HT", "93 600,00 €", "+12,4 %"],
    ["Marge brute", "67 230,00 €", "+8,9 %"],
    ["EBITDA", "23 480,00 €", "+18,2 %"],
    ["Résultat net", "18 450,32 €", "+22,1 %"],
    ["BFR", "11 480,00 €", "-3,4 %"],
    ["Trésorerie nette", "64 234,99 €", "+5,8 %"],
    ["Taux de marge", "71,8 %", "+1,2 pts"],
    ["DSO (jours clients)", "27 j", "-3 j"],
  ]
  kpis.forEach((k) => ws2.addRow({ k: k[0], v: k[1], var: k[2] }))

  await wb.xlsx.writeFile(path.join(OUT_DIR, "bilan-avril-2026.xlsx"))
  console.log("Wrote bilan-avril-2026.xlsx")
}

// 5. Liste clients (XLSX)
async function genClients() {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet("Clients")
  ws.columns = [
    { header: "Client", key: "name", width: 30 },
    { header: "Contact", key: "contact", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Téléphone", key: "phone", width: 16 },
    { header: "Statut", key: "status", width: 14 },
    { header: "CA 2026 (€)", key: "ca", width: 15 },
    { header: "Encours (€)", key: "encours", width: 15 },
  ]
  ws.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } }
  ws.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF10B981" } }
  const list = [
    ["Fiducial Conseil", "Hélène Royer", "h.royer@fiducial.fr", "01 44 21 78 92", "Actif", 14760, 819],
    ["Numa Studio", "Mathieu Ferrand", "mathieu@numa.studio", "01 56 12 04 33", "Actif", 9840, 0],
    ["Atelier Verlaine", "Sophie Verlaine", "sophie@atelier-v.fr", "06 78 45 19 02", "Actif", 4200, 350],
    ["Boucherie Lefèvre", "Jean Lefèvre", "boucherie.lefevre@gmail.com", "01 42 78 11 24", "Actif", 2400, 0],
    ["Studio Mongin", "Camille Mongin", "contact@studio-mongin.com", "06 14 78 09 22", "Prospect", 0, 0],
    ["LBM Bichat-Nord", "Dr. Antoine Marchal", "a.marchal@lbm-bichat.fr", "01 53 04 18 77", "Actif", 18900, 2450],
    ["Pâtisserie Lenoir", "Élise Lenoir", "elise@patisserie-lenoir.fr", "01 47 02 33 18", "Inactif", 1280, 0],
    ["Cabinet Doré & Associés", "Maître Pierre Doré", "pdore@dore-avocats.fr", "01 42 60 14 22", "Actif", 7560, 630],
    ["Garage Auto-Plus", "Frédéric Bayard", "f.bayard@autoplus.fr", "01 60 22 88 47", "Actif", 3960, 0],
    ["TechConsult SARL", "Marie Dubois", "marie@techconsult.fr", "01 70 39 12 88", "Actif", 12300, 1980],
  ]
  list.forEach((r) => {
    const row = ws.addRow({ name: r[0], contact: r[1], email: r[2], phone: r[3], status: r[4], ca: r[5], encours: r[6] })
    row.getCell(6).numFmt = "#,##0.00"
    row.getCell(7).numFmt = "#,##0.00"
    const statusColors = { Actif: "FFD1FAE5", Prospect: "FFFEF3C7", Inactif: "FFFEE2E2" }
    row.getCell(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: statusColors[r[4]] || "FFFFFFFF" } }
  })

  await wb.xlsx.writeFile(path.join(OUT_DIR, "liste-clients-omnia.xlsx"))
  console.log("Wrote liste-clients-omnia.xlsx")
}

// 6. Procédure interne (DOCX)
async function genProcedure() {
  const doc = new Document({
    creator: "OmnIA",
    title: "Procédure interne - Onboarding nouveau collaborateur",
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: "Procédure d'onboarding - Nouveau collaborateur",
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({ text: "Version 2.1 - Mise à jour : avril 2026", italics: true, color: "666666" })],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "1. Avant l'arrivée (J-7 à J-1)", heading: HeadingLevel.HEADING_2 }),
        new Paragraph("- Préparer le poste de travail (laptop, écran, badge d'accès)."),
        new Paragraph("- Créer le compte Google Workspace (prenom.nom@omnia.eu)."),
        new Paragraph("- Provisionner les accès Notion, GitHub, OmnIA Pro et 1Password."),
        new Paragraph("- Envoyer le pack d'accueil au manager (org chart, charte télétravail, livret métier)."),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "2. Premier jour (J0)", heading: HeadingLevel.HEADING_2 }),
        new Paragraph("- Accueil RH à 9h30 : signature du contrat, badge, présentation des locaux."),
        new Paragraph("- Café de bienvenue avec l'équipe à 10h30."),
        new Paragraph("- Session avec l'IT : prise en main du laptop, MFA, VPN."),
        new Paragraph("- Déjeuner d'intégration avec le manager."),
        new Paragraph("- Après-midi : lecture du runbook et exploration de la codebase principale."),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "3. Première semaine", heading: HeadingLevel.HEADING_2 }),
        new Paragraph("- Une session 1:1 quotidienne avec le manager (30 minutes)."),
        new Paragraph("- Pair programming sur une issue \"good first issue\" en J+2."),
        new Paragraph("- Premier commit en production validé avant J+5."),
        new Paragraph("- Rencontres planifiées avec chaque membre de l'équipe (30 min)."),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "4. Premier mois", heading: HeadingLevel.HEADING_2 }),
        new Paragraph("- Bilan à J+30 : objectifs SMART, montée en compétence, retour d'expérience."),
        new Paragraph("- Participation à au moins une demo client."),
        new Paragraph("- Formation OmnIA Academy (8h) : architecture, conventions, agents IA."),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "5. Contacts clés", heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ children: [
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Rôle", bold: true })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Personne", bold: true })] })] }),
              new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Contact", bold: true })] })] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ children: [new Paragraph("RH")] }),
              new TableCell({ children: [new Paragraph("Claire Bertin")] }),
              new TableCell({ children: [new Paragraph("claire.bertin@omnia.eu")] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ children: [new Paragraph("IT")] }),
              new TableCell({ children: [new Paragraph("Karim Ouazri")] }),
              new TableCell({ children: [new Paragraph("karim.ouazri@omnia.eu")] }),
            ]}),
            new TableRow({ children: [
              new TableCell({ children: [new Paragraph("Office Manager")] }),
              new TableCell({ children: [new Paragraph("Léa Charpentier")] }),
              new TableCell({ children: [new Paragraph("lea.charpentier@omnia.eu")] }),
            ]}),
          ],
        }),
      ],
    }],
  })
  const buf = await Packer.toBuffer(doc)
  await writeFile(path.join(OUT_DIR, "procedure-onboarding-omnia.docx"), buf)
  console.log("Wrote procedure-onboarding-omnia.docx")
}

await genFactureClient()
await genContrat()
await genStatuts()
await genBilan()
await genClients()
await genProcedure()

console.log("\nDone. All 6 mock documents written to", OUT_DIR)
