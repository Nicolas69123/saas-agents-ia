# Configuration des Credentials Réseaux Sociaux

Ce guide explique comment configurer les credentials pour poster automatiquement sur les réseaux sociaux via n8n.

---

## 1. LinkedIn

### Créer une App LinkedIn

1. Va sur https://www.linkedin.com/developers/apps
2. Clique sur **"Create App"**
3. Remplis :
   - **App name**: OmniA Marketing Agent
   - **LinkedIn Page**: Ta page entreprise (obligatoire)
   - **Logo**: Upload un logo
4. Accepte les conditions et crée l'app

### Configurer les permissions

1. Dans l'app, va dans **Products**
2. Demande l'accès à **"Share on LinkedIn"** (pour poster)
3. Dans **Auth**, note :
   - **Client ID**: `xxxxxxxxxxxxxxxx`
   - **Client Secret**: `xxxxxxxxxxxxxxxx`
4. Ajoute l'URL de callback : `http://localhost:5678/rest/oauth2-credential/callback`

### Dans n8n

1. Va dans **Credentials** > **Add Credential**
2. Cherche **"LinkedIn OAuth2 API"**
3. Entre :
   - Client ID
   - Client Secret
4. Clique sur **"Connect"** et autorise l'app

---

## 2. Facebook & Instagram

> Instagram utilise l'API Facebook Graph. Les posts Instagram passent par une Page Facebook connectée.

### Créer une App Facebook

1. Va sur https://developers.facebook.com/apps
2. Clique sur **"Create App"**
3. Choisis **"Business"** comme type
4. Remplis :
   - **App name**: OmniA Marketing
   - **Contact email**: ton email
5. Crée l'app

### Configurer les permissions

1. Dans le Dashboard, ajoute le produit **"Facebook Login"**
2. Configure :
   - **Valid OAuth Redirect URIs**: `http://localhost:5678/rest/oauth2-credential/callback`
3. Dans **Settings > Basic**, note :
   - **App ID**: `xxxxxxxxxxxxxxxx`
   - **App Secret**: `xxxxxxxxxxxxxxxx`

### Obtenir un Access Token

1. Va dans **Tools > Graph API Explorer**
2. Sélectionne ton app
3. Ajoute les permissions :
   - `pages_manage_posts` (poster sur Page Facebook)
   - `pages_read_engagement`
   - `instagram_basic`
   - `instagram_content_publish` (poster sur Instagram)
4. Clique sur **"Generate Access Token"**
5. Convertis en token longue durée (60 jours) :
   ```
   GET https://graph.facebook.com/v18.0/oauth/access_token?
     grant_type=fb_exchange_token&
     client_id={APP_ID}&
     client_secret={APP_SECRET}&
     fb_exchange_token={SHORT_LIVED_TOKEN}
   ```

### Lier Instagram à Facebook

1. Dans Facebook Business Suite, connecte ton compte Instagram à ta Page
2. Note l'**Instagram Business Account ID** :
   ```
   GET https://graph.facebook.com/v18.0/{page-id}?fields=instagram_business_account&access_token={TOKEN}
   ```

### Dans n8n

1. Va dans **Credentials** > **Add Credential**
2. Cherche **"Facebook Graph API"**
3. Entre l'Access Token

---

## 3. Twitter / X

### Créer une App Twitter

1. Va sur https://developer.twitter.com/en/portal/dashboard
2. Crée un projet (Free tier = 1500 tweets/mois)
3. Dans ton projet, crée une **App**

### Configurer l'authentification

1. Dans **User authentication settings**, active **OAuth 1.0a**
2. Configure :
   - **App permissions**: Read and Write
   - **Callback URL**: `http://localhost:5678/rest/oauth1-credential/callback`
   - **Website URL**: ton site
3. Dans **Keys and tokens**, note :
   - **API Key** (Consumer Key): `xxxxxxxxxxxxxxxx`
   - **API Secret** (Consumer Secret): `xxxxxxxxxxxxxxxx`
4. Génère aussi :
   - **Access Token**: `xxxxxxxxxxxxxxxx`
   - **Access Token Secret**: `xxxxxxxxxxxxxxxx`

### Dans n8n

1. Va dans **Credentials** > **Add Credential**
2. Cherche **"X (Twitter) OAuth1 API"**
3. Entre les 4 clés

---

## 4. TikTok

> ⚠️ L'API TikTok pour le posting nécessite une approbation (1-2 semaines).

### Créer une App TikTok

1. Va sur https://developers.tiktok.com/
2. Crée un compte développeur
3. Crée une nouvelle app

### Demander l'accès Content Posting

1. Dans ton app, demande l'accès au produit **"Content Posting API"**
2. TikTok va review ta demande (explique ton use case business)
3. Une fois approuvé, tu auras accès à :
   - **Client Key**
   - **Client Secret**

### Alternative : TikTok via Zapier/Make

En attendant l'approbation, tu peux utiliser un service tiers :
- Zapier avec TikTok integration
- Make (ex-Integromat)
- Buffer ou Hootsuite

### Dans n8n (après approbation)

1. Va dans **Credentials** > **Add Credential**
2. Utilise **"HTTP Request"** avec OAuth2
3. Configure :
   - Authorization URL: `https://www.tiktok.com/auth/authorize/`
   - Token URL: `https://open-api.tiktok.com/oauth/access_token/`
   - Scopes: `video.upload,video.publish`

---

## 5. YouTube (Shorts)

### Créer un projet Google Cloud

1. Va sur https://console.cloud.google.com/
2. Crée un nouveau projet
3. Active l'API **YouTube Data API v3**

### Configurer OAuth

1. Va dans **APIs & Services > Credentials**
2. Crée un **OAuth 2.0 Client ID**
3. Configure :
   - Type: Web application
   - Redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
4. Note :
   - **Client ID**: `xxxxxxxxxxxxxxxx`
   - **Client Secret**: `xxxxxxxxxxxxxxxx`

### Dans n8n

1. Va dans **Credentials** > **Add Credential**
2. Cherche **"YouTube OAuth2 API"**
3. Entre les credentials et connecte-toi

---

## Récapitulatif des Credentials à créer dans n8n

| Plateforme | Type de Credential n8n | Clés nécessaires |
|------------|------------------------|------------------|
| LinkedIn | LinkedIn OAuth2 API | Client ID, Client Secret |
| Facebook | Facebook Graph API | Access Token (longue durée) |
| Instagram | Facebook Graph API | Access Token + IG Business ID |
| Twitter/X | X OAuth1 API | API Key, API Secret, Access Token, Access Token Secret |
| TikTok | HTTP Request (OAuth2) | Client Key, Client Secret |
| YouTube | YouTube OAuth2 API | Client ID, Client Secret |

---

## Variables d'environnement (.env.local)

Ajoute ces variables pour référence :

```env
# LinkedIn
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

# Facebook/Instagram
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_ACCESS_TOKEN=
INSTAGRAM_BUSINESS_ACCOUNT_ID=
FACEBOOK_PAGE_ID=

# Twitter/X
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=

# TikTok (après approbation)
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=

# YouTube
YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
```

---

## Prochaine étape

Une fois les credentials configurées dans n8n, le workflow postera automatiquement :
1. L'image/vidéo générée
2. Le texte du post
3. Les hashtags

Sur la plateforme correspondante selon le type de post demandé.
