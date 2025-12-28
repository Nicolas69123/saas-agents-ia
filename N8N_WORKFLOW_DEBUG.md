# Debug Workflow n8n Complet

## 🎯 Objectif
Tout faire dans n8n (texte + image + vidéo) - ZÉRO génération dans Next.js API

## 📊 Workflow actuel

**ID** : `X3MwjADz8LpcOAML`
**Webhook** : `http://localhost:5678/webhook/marketing-agent`
**Status** : ✅ Actif mais retourne vide

## ❌ Problème identifié

Le webhook répond 200 OK mais retourne `{}` (objet vide).

### Test effectué
```bash
curl -X POST http://localhost:5678/webhook/marketing-agent \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "chatInput": "Test"}'

# Résultat: {"response": null} ou {}
```

## 🔍 À vérifier dans n8n UI

### 1. Ouvrir le workflow
http://localhost:5678/workflow/X3MwjADz8LpcOAML

### 2. Checker les Executions
http://localhost:5678/executions

Vérifier :
- ✅ Le workflow s'exécute-t-il ?
- ✅ Quels nodes s'exécutent ?
- ❌ Où est l'erreur ?

### 3. Credentials à vérifier

| Credential | Type | ID | Status |
|------------|------|-----|--------|
| Google Gemini API | googlePalmApi | `juqopekTUW4CU0nb` | ❓ À vérifier |
| Fal.ai API Key | httpHeaderAuth | `fal-api-key` | ❌ Non créé |

#### Vérifier Gemini credential
1. Settings → Credentials
2. Chercher "Google Gemini API" (ID: juqopekTUW4CU0nb)
3. Vérifier que la clé API est : `AIzaSyB7MY-gNyHEgQsGILymOzG43XHi5XRkOm0`

### 4. Nodes à vérifier

#### AI Agent - Thomas
- ✅ Connected to Gemini Chat Model?
- ✅ Connected to Structured Output Parser?
- ✅ Outputs to 3 IF nodes?

#### Generate Image (Social) & (Only)
- ✅ URL correcte : `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`
- ✅ Credential : Google Gemini API (juqopekTUW4CU0nb)
- ✅ Headers : Content-Type: application/json
- ✅ Body JSON correct avec `contents` et `generationConfig`

#### Code Nodes (Merge)
- ✅ Peuvent accéder à l'output de l'AI Agent ?
- ✅ JavaScript syntax valide ?

### 5. Test manuel dans n8n

1. Ouvrir le workflow
2. Cliquer "Execute Workflow"
3. Dans "Webhook Trigger", cliquer "Listen for Test Event"
4. Envoyer requête :

```bash
curl -X POST http://localhost:5678/webhook-test/marketing-agent \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Crée un post LinkedIn sur le succès",
    "chatInput": "Crée un post LinkedIn sur le succès"
  }'
```

5. Vérifier les outputs de chaque node

## 🔧 Fixes probables

### Fix 1: Credential Gemini manquant
Le node "Generate Image" n'a peut-être pas accès au credential.

**Solution** :
1. Ouvrir node "Generate Image (Social)"
2. Section "Credentials"
3. Sélectionner "Google Gemini API" existant ou en créer un nouveau

### Fix 2: Connections cassées
Les connections entre nodes peuvent être invalides.

**Solution** :
1. Vérifier visuellement les flèches entre nodes
2. Re-connecter si nécessaire

### Fix 3: Output Parser ne fonctionne pas
L'AI Agent ne retourne peut-être pas de JSON valide.

**Solution** :
1. Tester l'AI Agent seul
2. Vérifier que l'output est bien structuré
3. Vérifier le system message du parser

## 📝 Architecture attendue

```
Webhook Trigger
    ↓
AI Agent (Gemini 2.0 Flash) - Génère JSON structuré
    ↓
[Split 4 branches en parallèle]
    ├─→ Is Social Post? (TRUE)
    │       ↓
    │   Generate Image? (TRUE si generate_image=true)
    │       ↓
    │   Generate Image (Social) - Gemini 2.5 Flash Image
    │       ↓
    │   Merge Social + Image (Code node)
    │       ↓
    │   Respond (With Image) ✅
    │
    ├─→ Is Image Only? (TRUE)
    │       ↓
    │   Generate Image (Only) - Gemini 2.5 Flash Image
    │       ↓
    │   Merge Image Only (Code node)
    │       ↓
    │   Respond (Image Only) ✅
    │
    ├─→ Is Video? (TRUE)
    │       ↓
    │   Generate Video (Veo3) - Fal.ai
    │       ↓
    │   Wait 60s
    │       ↓
    │   Get Video Result
    │       ↓
    │   Merge Video
    │       ↓
    │   Respond (Video) ✅
    │
    └─→ Respond (Text Only) ✅
```

## ⚠️ IMPORTANT

Les branches sont en PARALLÈLE. Si plusieurs conditions sont vraies, n8n peut répondre plusieurs fois au webhook. Il faut que les conditions soient **mutuellement exclusives**.

## 🎯 Prochaines étapes

1. ✅ Ouvrir n8n UI : http://localhost:5678
2. ✅ Aller dans le workflow X3MwjADz8LpcOAML
3. ✅ Checker Executions → voir les erreurs
4. ✅ Fixer les credentials
5. ✅ Tester manuellement avec "Execute Workflow"
6. ✅ Une fois OK, tester depuis le site web

## 📞 Support

Si besoin, consulter la doc n8n :
- https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-langchain.agent/
- https://docs.n8n.io/integrations/builtin/credentials/google/
