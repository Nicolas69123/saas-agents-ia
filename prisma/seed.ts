import { PrismaClient } from '@prisma/client'
import { agents } from '../data/agents'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Créer les 8 agents IA
  for (const agent of agents) {
    await prisma.agent.upsert({
      where: { agentId: agent.id },
      update: {
        name: agent.name,
        icon: agent.icon,
        description: agent.description,
        domain: agent.domain,
        category: agent.category,
        welcomeMessage: agent.welcomeMessage,
      },
      create: {
        agentId: agent.id,
        name: agent.name,
        icon: agent.icon,
        description: agent.description,
        domain: agent.domain,
        category: agent.category,
        welcomeMessage: agent.welcomeMessage,
      },
    })
    console.log(`✅ Agent créé: ${agent.name}`)
  }

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
