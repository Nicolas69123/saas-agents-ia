# 🔑 Configuration des Credentials - Agent RH

## Liens directs pour créer chaque credential

Ouvre ces liens dans ton navigateur et configure chaque credential :

---

### 1️⃣ Google Drive
```
http://localhost:5678/credentials/new?credentialType=googleDriveOAuth2Api
```
**Configuration :**
- Clique sur "Sign in with Google"
- Autorise l'accès à Google Drive
- Sélectionne ton compte Google

---

### 2️⃣ Google Sheets
```
http://localhost:5678/credentials/new?credentialType=googleSheetsOAuth2Api
```
**Configuration :**
- Clique sur "Sign in with Google"
- Autorise l'accès à Google Sheets
- Sélectionne ton compte Google

---

### 3️⃣ Google Calendar
```
http://localhost:5678/credentials/new?credentialType=googleCalendarOAuth2Api
```
**Configuration :**
- Clique sur "Sign in with Google"
- Autorise l'accès à Google Calendar
- Sélectionne ton compte Google

---

### 4️⃣ Gmail
```
http://localhost:5678/credentials/new?credentialType=gmailOAuth2
```
**Configuration :**
- Clique sur "Sign in with Google"
- Autorise l'accès à Gmail
- Sélectionne ton compte Google

---

### 5️⃣ Airtable
```
http://localhost:5678/credentials/new?credentialType=airtableTokenApi
```
**Configuration :**
- Va sur https://airtable.com/create/tokens
- Crée un Personal Access Token
- Scopes nécessaires : `data.records:read`, `data.records:write`, `schema.bases:read`
- Colle le token dans n8n

---

### 6️⃣ Gemini (Google AI)
```
http://localhost:5678/credentials/new?credentialType=googlePalmApi
```
**Configuration :**
- API Key : `AIzaSyDFoxITJ29qzBiSfpQoYtS20FcJD4NcN6I` (déjà disponible)
- Host : `generativelanguage.googleapis.com`

---

## 📋 Checklist

- [ ] Google Drive configuré
- [ ] Google Sheets configuré
- [ ] Google Calendar configuré
- [ ] Gmail configuré
- [ ] Airtable configuré
- [ ] Gemini configuré

---

## ⚠️ Prérequis Google Cloud

Pour les credentials Google (Drive, Sheets, Calendar, Gmail), tu as besoin d'un projet Google Cloud avec :

1. **APIs activées :**
   - Google Drive API
   - Google Sheets API
   - Google Calendar API
   - Gmail API

2. **OAuth 2.0 Client ID** créé dans Google Cloud Console :
   - https://console.cloud.google.com/apis/credentials
   - Type : Application Web
   - Redirect URI : `http://localhost:5678/rest/oauth2-credential/callback`

---

## 🚀 Une fois tout configuré

Dis-moi et je branche tous les credentials au workflow Agent RH !
