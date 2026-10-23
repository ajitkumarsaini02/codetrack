const mongoose = require('mongoose')
const env = require('../src/config/env')

const User = require('../src/models/User')
const Problem = require('../src/models/Problem')
const CodingProfile = require('../src/models/CodingProfile')
const CodingStats = require('../src/models/CodingStats')
const DailyProgress = require('../src/models/DailyProgress')
const Revision = require('../src/models/Revision')

const seedDatabase = async () => {
  try {
    const targetEmail = process.argv[2]
    if (!targetEmail) {
      console.log('====================================================')
      console.log('CodeTrack Seeder: No demo user is created automatically.')
      console.log('To populate initial sample data for a registered user, run:')
      console.log('  node scripts/seed.js <registered-user-email>')
      console.log('====================================================')
      process.exit(0)
    }

    console.log('Connecting to MongoDB at:', env.MONGODB_URI)
    await mongoose.connect(env.MONGODB_URI)
    console.log('MongoDB connection established.')

    const user = await User.findOne({ email: targetEmail.toLowerCase().trim() })
    if (!user) {
      console.error(`User with email "${targetEmail}" not found. Please register via the UI first.`)
      process.exit(1)
    }

    const userId = user._id

    // 1. Clean existing sample data for this specific user
    await Promise.all([
      Problem.deleteMany({ user: userId }),
      CodingProfile.deleteMany({ user: userId }),
      CodingStats.deleteMany({ user: userId }),
      DailyProgress.deleteMany({ user: userId }),
      Revision.deleteMany({ user: userId })
    ])

    // 2. Seed All Questions from DSA Mastery Sheets for this user
    const fs = require('fs')
    const path = require('path')
    const sheetsDataPath = path.join(__dirname, '../src/data/sheetsData.json')
    const sheets = JSON.parse(fs.readFileSync(sheetsDataPath, 'utf8'))

    const seededMap = new Map()

    for (const sheet of sheets) {
      for (const phase of sheet.phases) {
        for (const topic of phase.topics) {
          for (const prob of topic.problems) {
            const key = `${sheet.platform}:${prob.title.toLowerCase().trim()}`
            if (!seededMap.has(key)) {
              seededMap.set(key, {
                user: userId,
                title: prob.title.trim(),
                platform: sheet.platform,
                problemUrl: prob.url || '',
                difficulty: prob.difficulty || 'Easy',
                status: 'todo',
                topics: [topic.topicName || topic.title || 'General'],
                solvedAt: null
              })
            }
          }
        }
      }
    }

    const allProblems = Array.from(seededMap.values())
    await Problem.insertMany(allProblems, { ordered: false })
    console.log(`Seeded ${allProblems.length} DSA problems into MongoDB for ${user.email}!`)

    await mongoose.disconnect()
    process.exit(0)
  } catch (error) {
    console.error('Database seeding failed:', error)
    process.exit(1)
  }
}

seedDatabase()
