# 🚀 Setup Workflow n8n - Agent Marketing (Gemini 2025)

## 📦 Fichier de Workflow

**Fichier**: `workflow-agent-marketing-gemini-2025.json`

Ce workflow utilise les **derniers modèles Gemini (décembre 2025)** :
- ✅ **Gemini 2.0 Flash** pour génération de texte
- ✅ **Gemini 2.5 Flash Image** pour génération d'images (via l'API route.ts)
- ✅ Détection automatique de plateforme (LinkedIn/Instagram/Twitter/Facebook)
- ✅ JSON parfait pour les mockups du site

---

## 📋 Étapes d'Installation

### 1️⃣ Importer le Workflow dans n8n

1. **Ouvre n8n** : http://localhost:5678
2. **Clique** sur le bouton `+` (Create new workflow)
3. **Menu** (3 points en haut à droite) → **Import from File**
4. **Sélectionne** : `workflow-agent-marketing-gemini-2025.json`
5. **Le workflow s'ouvre** dans l'éditeur

### 2️⃣ Activer le Workflow

1. **Toggle** en haut à droite : `Inactive` → `Active` ✅
2. Le webhook devient disponible à : `http://localhost:5678/webhook/agent-marketing-2025`

### 3️⃣ Vérifier que ça marche

Teste le webhook directement :

```bash
curl -X POST http://localhost:5678/webhook/agent-marketing-2025 \\
  -H "Content-Type: application/json" \\
  -d '{"chatInput": "Create a LinkedIn post about AI", "message": "Create a LinkedIn post about AI"}'
```

**Réponse attendue** (JSON avec post_content, hashtags, etc.) :

```json
{
  "response": {
    "type_contenu": "social_post",
    "platform": "linkedin",
    "post_content": {
      "text": "🚀 L'intelligence artificielle transforme...",
      "hook": "Accroche percutante",
      "cta": "Suivez-moi pour plus de contenus!"
    },
    "hashtags": ["#AI", "#Innovation", "#Tech"],
    "image_prompt": "Professional business AI...",
    "generate_image": true
  }
}
```

---

## 🔧 Configuration du Site

Le code du site est **déjà configuré** pour utiliser ce workflow :

**Fichier** : `/app/api/chat/route.ts`
**Webhook URL** : `http://localhost:5678/webhook/agent-marketing-2025`

### Comment ça fonctionne :

1. **Utilisateur** envoie un message dans le chat (ex: "Crée un post LinkedIn sur l'IA")
2. **Site Next.js** appelle l'API `/api/chat` avec `agentId: "reseaux-sociaux"`
3. **API route.ts** appelle le webhook n8n `/webhook/agent-marketing-2025`
4. **Workflow n8n** :
   - Analyse la demande (plateforme, type de contenu)
   - Génère le texte avec **Gemini 2.0 Flash**
   - Retourne le JSON structuré
5. **API route.ts** reçoit le JSON et génère l'image avec **Gemini 2.5 Flash Image**
6. **Frontend** affiche le post dans les mockups (LinkedIn/Instagram/Twitter/Facebook)

---

## 🎨 Architecture du Workflow

```
┌─────────────────────┐
│  Webhook Trigger    │  ← Reçoit chatInput + message
│  (agent-marketing-  │
│   2025)             │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Analyze Request    │  ← Détecte plateforme + type contenu
│  (Code Node)        │     + génère prompt pour Gemini
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Generate Content   │  ← Gemini 2.0 Flash (dernier modèle)
│  (HTTP Request)     │     Génère le JSON structuré
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Parse JSON         │  ← Extrait le JSON de la réponse
│  (Code Node)        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Respond to Webhook │  ← Retourne le JSON au site
│  (Respond Node)     │
└─────────────────────┘
```

---

## ✅ Checklist

- [ ] Workflow importé dans n8n
- [ ] Workflow activé (toggle vert)
- [ ] Test webhook OK (retourne JSON)
- [ ] Site Next.js tourne sur localhost:3001
- [ ] Variable `GEMINI_API_KEY` dans `.env.local`
- [ ] Test complet : message → génération texte + image → affichage mockup

---

## 🐛 Troubleshooting

### Le webhook retourne 404

**Cause** : Le workflow n'est pas activé
**Solution** : Active le toggle en haut à droite dans n8n

### Timeout après 60 secondes

**Cause** : Gemini API prend trop de temps
**Solution** : Vérifier que la clé API Gemini est valide dans `.env.local`

### Pas d'image générée

**Cause** : L'API Gemini 2.5 Flash Image n'est pas appelée
**Solution** : Vérifier que `parsedContent.generate_image === true` dans la réponse n8n

### Le JSON est mal parsé

**Cause** : Gemini ne retourne pas exactement le format JSON attendu
**Solution** : Le code node "Parse JSON" essaie de le matcher, vérifier les logs n8n

---

## 📊 Modèles Gemini Utilisés (Décembre 2025)

**Sources** : [Google Developers Blog - Gemini 2025](https://developers.googleblog.com/)

### Pour Texte :
- **Gemini 2.0 Flash** : Modèle rapide avec multimodal input
- Génération de posts sociaux personnalisés par plateforme

### Pour Images :
- **Gemini 2.5 Flash Image** ("Nano Banana") : État de l'art pour génération d'images
- Support jusqu'à 4K avec "thinking process"
- Appelé depuis `/app/api/chat/route.ts` après réception du JSON

### Pour Vidéos (futur) :
- **Gemini 2.0 Flash** avec génération vidéo native
- À implémenter avec Veo 3 API

---

## 🎯 Prochaines Étapes

1. **Tester le workflow** avec différents types de demandes :
   - "Crée un post LinkedIn"
   - "Génère un post Instagram avec image"
   - "Post Twitter sur l'IA"

2. **Vérifier l'affichage dans les mockups** :
   - Composant : `/components/SocialMockups/`
   - LinkedIn, Instagram, Twitter, Facebook

3. **Ajouter la génération vidéo** (optionnel) :
   - Intégrer Veo 3 API
   - Modifier le workflow pour supporter `type_contenu: "video"`

---

**Enjoy! 🚀**
