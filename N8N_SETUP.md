# Configuration n8n - Agent Marketing Complet

## 🔑 Clés API

### n8n API Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZWVhZTdkZi03ZTdlLTQxNGQtOTI2NC1mN2I2ZWY1ZmQ3YzUiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY2OTU5MDI1LCJleHAiOjE3Njk0OTAwMDB9.jyud_HvpjX3qs1IYhAzVXZXZJlY07CSRalzBzr8jx2g
```

**Expiration** : 2055-12-31

### Credentials configurées
- ✅ **Google Gemini API** (ID: `juqopekTUW4CU0nb`)
- ⏳ **Fal.ai API** (pour vidéos Veo3) - À configurer

---

## 📊 Workflow Actif

**Nom** : Agent Marketing Complet - Texte + Image + Video
**ID** : `pTQPxSybHSFGcMBB`
**Status** : ✅ Actif
**Webhook** : `http://localhost:5678/webhook/marketing-agent`

### Capacités

| Type | Status | Modèle utilisé |
|------|--------|----------------|
| **Texte (Posts sociaux)** | ✅ Actif | Gemini 2.0 Flash |
| **Image** | ✅ Actif | Gemini 2.5 Flash Image |
| **Vidéo** | ⏳ À configurer | Veo3 (via Fal.ai) |

---

## 🔄 Flux de données

```
User Message (Site Web)
       ↓
Next.js API (/api/chat)
       ↓
n8n Webhook (/webhook/marketing-agent)
       ↓
AI Agent (Gemini 2.0 Flash)
   ├─→ Social Post? → Generate Image? → Gemini 2.5 Flash Image
   ├─→ Image Only? → Gemini 2.5 Flash Image
   ├─→ Video? → Veo3 API (Fal.ai) → Wait 60s → Get Result
   └─→ Text? → Return text
       ↓
Respond to Webhook (avec image/vidéo en base64)
       ↓
Next.js API → Frontend → Affichage dans mockups
```

---

## 🎯 Types de contenu supportés

### 1. Posts Réseaux Sociaux
**Plateformes** : LinkedIn, Instagram, Twitter/X, Facebook

**Réponse JSON** :
```json
{
  "type_contenu": "social_post",
  "platform": "linkedin",
  "post_content": {
    "text": "Texte markdown...",
    "hook": "Accroche",
    "cta": "Call-to-action"
  },
  "hashtags": ["#tag1", "#tag2"],
  "image_base64": "iVBORw0KG...",
  "mimeType": "image/png",
  "image_ready": true
}
```

### 2. Images seules
**Réponse JSON** :
```json
{
  "type_contenu": "image",
  "description": "Description courte",
  "prompt_ameliore": "Prompt détaillé...",
  "image_base64": "iVBORw0KG...",
  "mimeType": "image/png",
  "image_ready": true
}
```

### 3. Vidéos (Veo3)
**Réponse JSON** :
```json
{
  "type_contenu": "video",
  "description": "Description",
  "video_prompt": "Prompt vidéo...",
  "video_url": "https://...",
  "video_ready": true,
  "status": "completed"
}
```

---

## 📝 Configuration requise pour vidéos

### 1. Créer un compte Fal.ai
https://fal.ai/dashboard/keys

### 2. Créer une clé API
Dans le dashboard Fal.ai → API Keys → Create New Key

### 3. Configurer les credentials dans n8n
1. Aller dans **Settings** → **Credentials**
2. Créer **HTTP Header Auth**
3. **Name** : `Fal.ai API Key`
4. **Header Name** : `Authorization`
5. **Header Value** : `Key YOUR_FAL_API_KEY`

### 4. Tester
```bash
# Test avec un post demandant une vidéo
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "reseaux-sociaux",
    "message": "Crée une vidéo de 5 secondes sur le leadership"
  }'
```

---

## 🔧 Commandes utiles

### Démarrer n8n
```bash
n8n start
```

### Activer le workflow
```bash
curl -X POST "http://localhost:5678/api/v1/workflows/pTQPxSybHSFGcMBB/activate" \
  -H "X-N8N-API-KEY: YOUR_API_KEY"
```

### Tester le webhook
```bash
curl -X POST "http://localhost:5678/webhook/marketing-agent" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Crée un post LinkedIn sur l'\''IA avec une image",
    "agentId": "reseaux-sociaux"
  }'
```

---

## 📊 Monitoring

### Logs n8n
- Dashboard : http://localhost:5678/executions
- API : http://localhost:5678/api/v1/executions

### Logs Next.js
```bash
# Voir les logs du serveur de dev
tail -f /tmp/claude/tasks/b3f4d6a.output
```

---

## ⚠️ Notes importantes

1. **Gemini Image URL** : Utilise `gemini-2.5-flash-image:generateContent` (pas `gemini-2.0-flash-exp:generateImage`)
2. **Timeout** : 120 secondes pour images (10-15s) et vidéos (60-90s)
3. **Format base64** : Les images sont retournées en base64 dans le champ `image_base64`
4. **Vidéos** : Nécessite un compte Fal.ai payant (environ $0.05/vidéo)

---

## 🎉 Résumé

**Ce qui fonctionne** :
- ✅ Posts LinkedIn/Instagram/Twitter/Facebook avec images
- ✅ Génération d'images seules
- ✅ Texte simple

**À configurer** :
- ⏳ Vidéos Veo3 (nécessite clé Fal.ai)

**Prochaines étapes** :
1. Obtenir clé API Fal.ai
2. Configurer credentials dans n8n
3. Tester génération vidéo
4. Ajouter affichage vidéo dans le frontend
