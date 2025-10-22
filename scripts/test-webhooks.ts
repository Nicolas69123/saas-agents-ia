#!/usr/bin/env tsx
/**
 * Script de test des webhooks n8n
 *
 * Ce script teste tous les webhooks n8n configurés pour valider qu'ils répondent correctement.
 *
 * Usage:
 *   npx tsx scripts/test-webhooks.ts
 *   npx tsx scripts/test-webhooks.ts comptable  # Tester un agent spécifique
 */

import { webhookConfigs, getActiveWebhooks } from '../config/n8n-webhooks'

interface TestResult {
  agentId: string
  name: string
  webhookUrl: string
  status: 'success' | 'error' | 'skipped'
  responseTime?: number
  response?: any
  error?: string
}

/**
 * Tester un webhook spécifique
 */
async function testWebhook(agentId: string, webhookUrl: string): Promise<TestResult> {
  const startTime = Date.now()

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Test automatique pour l'agent ${agentId}`,
        agentId,
        conversationId: `test-${Date.now()}`
      }),
      signal: AbortSignal.timeout(10000)
    })

    const responseTime = Date.now() - startTime

    if (!response.ok) {
      return {
        agentId,
        name: '',
        webhookUrl,
        status: 'error',
        responseTime,
        error: `HTTP ${response.status}: ${await response.text()}`
      }
    }

    const data = await response.json()

    return {
      agentId,
      name: '',
      webhookUrl,
      status: 'success',
      responseTime,
      response: data
    }
  } catch (error) {
    const responseTime = Date.now() - startTime
    return {
      agentId,
      name: '',
      webhookUrl,
      status: 'error',
      responseTime,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

/**
 * Afficher les résultats dans la console
 */
function displayResults(results: TestResult[]) {
  console.log('\n📊 Résultats des tests de webhooks n8n\n')
  console.log('═'.repeat(80))

  const successCount = results.filter(r => r.status === 'success').length
  const errorCount = results.filter(r => r.status === 'error').length
  const skippedCount = results.filter(r => r.status === 'skipped').length

  results.forEach(result => {
    const statusIcon = {
      success: '✅',
      error: '❌',
      skipped: '⏭️'
    }[result.status]

    console.log(`\n${statusIcon} ${result.name || result.agentId}`)
    console.log(`   URL: ${result.webhookUrl}`)

    if (result.status === 'success') {
      console.log(`   ⏱️  Temps de réponse: ${result.responseTime}ms`)
      console.log(`   ✨ Réponse: ${result.response?.response?.substring(0, 100)}...`)
    } else if (result.status === 'error') {
      console.log(`   ❌ Erreur: ${result.error}`)
      if (result.responseTime) {
        console.log(`   ⏱️  Temps écoulé: ${result.responseTime}ms`)
      }
    } else {
      console.log(`   ⏭️  Agent non actif (isActive: false)`)
    }
  })

  console.log('\n' + '═'.repeat(80))
  console.log(`\n📈 Statistiques:`)
  console.log(`   ✅ Succès: ${successCount}/${results.length}`)
  console.log(`   ❌ Erreurs: ${errorCount}/${results.length}`)
  console.log(`   ⏭️  Ignorés: ${skippedCount}/${results.length}`)

  if (successCount === results.filter(r => r.status !== 'skipped').length && successCount > 0) {
    console.log(`\n🎉 Tous les webhooks actifs fonctionnent correctement !`)
  } else if (errorCount > 0) {
    console.log(`\n⚠️  Certains webhooks ont des erreurs. Vérifiez n8n et la configuration.`)
  }

  console.log('')
}

/**
 * Main
 */
async function main() {
  const specificAgent = process.argv[2]

  let configsToTest = specificAgent
    ? webhookConfigs.filter(c => c.agentId === specificAgent)
    : webhookConfigs

  if (specificAgent && configsToTest.length === 0) {
    console.error(`❌ Agent "${specificAgent}" introuvable.`)
    console.log('\nAgents disponibles:')
    webhookConfigs.forEach(c => console.log(`  - ${c.agentId}`))
    process.exit(1)
  }

  console.log('🚀 Démarrage des tests de webhooks n8n...')
  console.log(`📝 Nombre d'agents à tester: ${configsToTest.length}`)

  const activeConfigs = configsToTest.filter(c => c.isActive)
  const inactiveConfigs = configsToTest.filter(c => !c.isActive)

  console.log(`✅ Agents actifs: ${activeConfigs.length}`)
  console.log(`⏭️  Agents inactifs: ${inactiveConfigs.length}\n`)

  const results: TestResult[] = []

  // Tester les webhooks actifs
  for (const config of activeConfigs) {
    console.log(`🔍 Test de ${config.name} (${config.agentId})...`)
    const result = await testWebhook(config.agentId, config.webhookUrl)
    result.name = config.name
    results.push(result)
  }

  // Ajouter les agents inactifs comme "skipped"
  for (const config of inactiveConfigs) {
    results.push({
      agentId: config.agentId,
      name: config.name,
      webhookUrl: config.webhookUrl,
      status: 'skipped'
    })
  }

  displayResults(results)

  // Exit avec code erreur si des tests ont échoué
  const hasErrors = results.some(r => r.status === 'error')
  process.exit(hasErrors ? 1 : 0)
}

main().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})
