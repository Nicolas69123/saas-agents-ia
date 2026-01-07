/**
 * Configuration des Webhooks n8n pour les Agents IA
 *
 * Ce fichier centralise toutes les URLs des webhooks n8n.
 *
 * Pour créer les workflows dans n8n :
 * 1. Ouvrir http://localhost:5678
 * 2. Suivre le guide : /docs/n8n-workflows-guide.md
 * 3. Copier les URLs des webhooks ici
 */

export interface WebhookConfig {
  agentId: string
  name: string
  webhookUrl: string
  isActive: boolean
}

/**
 * Base URL pour les webhooks n8n
 * En production, remplacer par l'URL publique de n8n
 */
const N8N_BASE_URL = process.env.N8N_URL || 'http://localhost:5678'

/**
 * Configuration des webhooks pour chaque agent
 */
export const webhookConfigs: WebhookConfig[] = [
  {
    agentId: 'comptable',
    name: 'Agent Comptable',
    webhookUrl: `${N8N_BASE_URL}/webhook/comptable`,
    isActive: true, // À mettre à true après création du workflow
  },
  {
    agentId: 'tresorier',
    name: 'Agent Trésorier',
    webhookUrl: `${N8N_BASE_URL}/webhook/tresorier`,
    isActive: false, // À mettre à true après création du workflow
  },
  {
    agentId: 'investissements',
    name: 'Agent Investissements',
    webhookUrl: `${N8N_BASE_URL}/webhook/investissements`,
    isActive: false,
  },
  {
    agentId: 'reseaux-sociaux',
    name: 'Agent Réseaux Sociaux',
    webhookUrl: `${N8N_BASE_URL}/webhook/4bd6ad35-7ef0-43af-9a78-d14e818abb10/chat`,
    isActive: true,
  },
  {
    agentId: 'email-marketing',
    name: 'Agent Email Marketing',
    webhookUrl: `${N8N_BASE_URL}/webhook/email-marketing`,
    isActive: false,
  },
  {
    agentId: 'ressources-humaines',
    name: 'Agent RH',
    webhookUrl: `${N8N_BASE_URL}/webhook/ressources-humaines`,
    isActive: false,
  },
  {
    agentId: 'support-client',
    name: 'Agent Support Client',
    webhookUrl: `${N8N_BASE_URL}/webhook/support-client`,
    isActive: false,
  },
  {
    agentId: 'telephonique',
    name: 'Agent Téléphonique',
    webhookUrl: `${N8N_BASE_URL}/webhook/telephonique`,
    isActive: false,
  },
]

/**
 * Map des webhooks par agentId pour accès rapide
 */
export const webhookMap = new Map<string, WebhookConfig>(
  webhookConfigs.map(config => [config.agentId, config])
)

/**
 * Obtenir l'URL du webhook pour un agent
 */
export function getWebhookUrl(agentId: string): string | null {
  const config = webhookMap.get(agentId)
  return config && config.isActive ? config.webhookUrl : null
}

/**
 * Vérifier si un agent a un webhook actif
 */
export function hasActiveWebhook(agentId: string): boolean {
  const config = webhookMap.get(agentId)
  return config?.isActive || false
}

/**
 * Obtenir tous les agents avec webhooks actifs
 */
export function getActiveWebhooks(): WebhookConfig[] {
  return webhookConfigs.filter(config => config.isActive)
}
