import { NextRequest, NextResponse } from "next/server"
import { execFile } from "child_process"

// Chatbot de support de la vitrine : repond aux questions sur OmnIA via claude -p.
// Reutilise le meme binaire/env que /api/chat (pas de cle API supplementaire).

const CLAUDE_BIN = process.env.CLAUDE_BIN || "/home/webmaster/.npm-global/bin/claude"
const CLAUDE_HOME = process.env.CLAUDE_HOME || "/home/webmaster"
const CLAUDE_PATH_PREFIX = process.env.CLAUDE_PATH_PREFIX || "/home/webmaster/.npm-global/bin"

// Contexte produit injecte dans chaque requete (le support connait OmnIA).
const SYSTEM_CONTEXT = `Tu es l'assistant de support d'OmnIA, une plateforme SaaS d'agents IA pour automatiser la gestion d'entreprise.

Tu reponds aux questions des visiteurs sur OmnIA, de maniere claire, concise et chaleureuse (tutoiement, max 8 lignes). Tu n'es PAS un agent metier : tu renseignes sur le produit.

CE QUE TU SAIS SUR OMNIA :
- OmnIA propose 8 agents IA specialises : Lucas (Comptable), Marc (Tresorier), Julie (Investissements), Thomas (Reseaux sociaux), Sophie (Email marketing), Claire (RH), Emma (Support client), Lea (Standard telephonique).
- Chaque agent discute et genere de vrais documents (factures, fiches de poste, previsionnels, posts sociaux, etc.) aux formats DOCX, XLSX, PPTX, PDF.
- Tarifs : Starter 69 EUR/mois (1 agent), Business 119 EUR/mois (tous les agents), Enterprise sur devis. Essai gratuit disponible.
- Pour utiliser les agents, il faut creer un compte (bouton Essai gratuit) puis aller dans le chat.
- Les pages utiles : /agents (decouvrir les agents), /pricing (tarifs), /contact (nous ecrire), /blog.

REGLES :
- Reponds uniquement sur OmnIA et son usage. Si la question est hors-sujet, recadre poliment.
- Ne promets rien de chiffre que tu ne sais pas (pas de "-70%" invente).
- Si tu ne sais pas, oriente vers la page Contact.
- Reponds en francais, en texte simple (pas de JSON, pas de markdown complexe).`

function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = execFile(
      CLAUDE_BIN,
      ["-p", "--model", "haiku", prompt],
      {
        timeout: 60000,
        maxBuffer: 1024 * 1024 * 2,
        env: { ...process.env, HOME: CLAUDE_HOME, PATH: `${CLAUDE_PATH_PREFIX}:${process.env.PATH}` },
      },
      (error, stdout, stderr) => {
        if (error) reject(error)
        else resolve(stdout.trim() || stderr.trim())
      }
    )
    child.stdin?.end()
  })
}

export async function POST(request: NextRequest) {
  let body: { message?: string; history?: { role: string; content: string }[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Requete invalide" }, { status: 400 })
  }

  const message = (body.message || "").trim()
  if (!message) {
    return NextResponse.json({ error: "Message requis" }, { status: 400 })
  }

  // Historique court pour le contexte conversationnel (3 derniers echanges max)
  const history = Array.isArray(body.history) ? body.history.slice(-6) : []
  const historyText = history
    .map((m) => `${m.role === "user" ? "Visiteur" : "Assistant"}: ${m.content}`)
    .join("\n")

  const prompt = `${SYSTEM_CONTEXT}\n\n${historyText ? `Conversation precedente :\n${historyText}\n\n` : ""}Visiteur: ${message}\nAssistant:`

  try {
    const reply = await runClaude(prompt)
    return NextResponse.json({ reply: reply || "Desole, je n'ai pas pu repondre. Reessaie ou contacte-nous via la page Contact." })
  } catch (err) {
    console.error("[SUPPORT] erreur claude:", err)
    return NextResponse.json(
      { reply: "Le support est momentanement indisponible. Tu peux nous ecrire via la page Contact." },
      { status: 200 }
    )
  }
}
