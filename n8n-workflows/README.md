# Workflows n8n pour le Chat

Ce dossier contient les workflows n8n pour l'integration avec le chat des agents IA.

## Workflows disponibles

### Workflows complets (recommandes)

Ces workflows contiennent TOUTE la logique originale + l'integration chat:

| Fichier | Agent | Webhook Path | Description |
|---------|-------|--------------|-------------|
| `agent-rh-complet.json` | Agent RH (Claire) | `/webhook/ressources-humaines` | Workflow RH complet avec Google Drive, Sheets, Calendar + Chat |
| `agent-marketing-complet.json` | Agent Marketing (Thomas) | `/webhook/reseaux-sociaux` | Workflow Marketing complet avec Buffer, Gemini, images + Chat |

### Workflows simplifies (backup)

Ces workflows sont des versions simplifiees pour test rapide:

| Fichier | Agent | Webhook Path | Description |
|---------|-------|--------------|-------------|
| `chat-rh.json` | Agent RH | `/webhook/ressources-humaines` | Version simplifiee: Webhook + Gemini |
| `chat-marketing.json` | Agent Marketing | `/webhook/reseaux-sociaux` | Version simplifiee: Webhook + Gemini |

## Installation

### 1. Demarrer n8n

```bash
# Demarrer n8n en local
n8n start

# Ou avec Docker
docker run -it --rm -p 5678:5678 n8nio/n8n
```

### 2. Configurer les credentials

Les workflows utilisent les credentials suivants:

- **Google Gemini(PaLM) Api** - Pour l'IA (requis)
- **Google Drive OAuth2** - Pour les CV (workflow RH)
- **Google Sheets OAuth2** - Pour sauvegarder les donnees
- **Google Calendar OAuth2** - Pour creer des entretiens
- **Airtable** - Pour la base candidats (workflow RH)

### 3. Importer les workflows complets

1. Ouvrir n8n: http://localhost:5678
2. Aller dans **Workflows**
3. Cliquer sur **Import from File**
4. Selectionner `agent-rh-complet.json` ou `agent-marketing-complet.json`
5. Ouvrir le workflow importe
6. **Configurer les credentials** (cliquer sur chaque node rouge)
7. **Activer le workflow** (toggle en haut a droite)

### 4. Tester le webhook

```bash
# Test Agent RH
curl -X POST http://localhost:5678/webhook/ressources-humaines \
  -H "Content-Type: application/json" \
  -d '{"message": "Comment rediger une fiche de poste ?", "agentId": "ressources-humaines"}'

# Test Agent Marketing
curl -X POST http://localhost:5678/webhook/reseaux-sociaux \
  -H "Content-Type: application/json" \
  -d '{"message": "Ecris un post LinkedIn sur l IA", "agentId": "reseaux-sociaux"}'
```

## Configuration du projet

Les webhooks sont configures dans `/config/n8n-webhooks.ts`.

Pour activer/desactiver un agent, modifier `isActive`:

```typescript
{
  agentId: 'ressources-humaines',
  name: 'Agent RH',
  webhookUrl: `${N8N_BASE_URL}/webhook/ressources-humaines`,
  isActive: true, // true = actif, false = desactive
}
```

## Structure des workflows complets

### Agent RH Complet

```
[Google Drive] -----> [CV Processing] -----> [AI Analysis] -----> [Airtable/Sheets]
                                                    |
[Chat Webhook] -----> [Chat AI Agent] -----> [Respond to Webhook]
                           |
                    [Gemini Model]
```

Fonctionnalites:
- Analyse automatique de CV depuis Google Drive
- Extraction d'informations avec IA
- Stockage dans Airtable et Google Sheets
- Creation d'entretiens dans Google Calendar
- Envoi d'emails de confirmation
- **Reponse aux questions chat via webhook**

### Agent Marketing Complet

```
[Webhook Campaign] -----> [AI Agent] -----> [Image/Video Generation] -----> [Buffer Publish]
                              |
                              +-----> [Chat Respond Marketing]
```

Fonctionnalites:
- Reception de briefs marketing
- Generation de contenu avec Gemini
- Creation d'images avec DALL-E/Gemini
- Publication sur reseaux sociaux via Buffer
- Rapports de performance
- **Reponse aux questions chat via webhook**

## Fichiers originaux

Les fichiers originaux (non modifies) sont dans Downloads:
- `Agent RH _ Complet.json`
- `IA Marketing _ Complet [ Manque API ].json`
