/**
 * Script to check what data exists in the database
 */

import { prisma } from '../src/lib/prisma'

async function checkDatabaseData() {
  console.log('Checking database content...\n')

  try {
    // Check courses
    const courseCount = await prisma.course.count()
    const courses = await prisma.course.findMany({ take: 5 })
    console.log(`Courses: ${courseCount} total`)
    if (courses.length > 0) {
      console.log('Sample courses:')
      courses.forEach(course => {
        console.log(`  - ${course.id}: Price: ${course.price}, User: ${course.userId}`)
      })
    }
    console.log('')

    // Check resources
    const resourceCount = await prisma.resource.count()
    const resources = await prisma.resource.findMany({ take: 5 })
    console.log(`Resources: ${resourceCount} total`)
    if (resources.length > 0) {
      console.log('Sample resources:')
      resources.forEach(resource => {
        console.log(`  - ${resource.id}: Price: ${resource.price}, User: ${resource.userId}`)
      })
    }
    console.log('')

    // Check lessons
    const lessonCount = await prisma.lesson.count()
    const lessons = await prisma.lesson.findMany({ take: 5 })
    console.log(`Lessons: ${lessonCount} total`)
    if (lessons.length > 0) {
      console.log('Sample lessons:')
      lessons.forEach(lesson => {
        console.log(`  - ${lesson.id}: Course: ${lesson.courseId}, Resource: ${lesson.resourceId}, Index: ${lesson.index}`)
      })
    }
    console.log('')

    // Check users
    const userCount = await prisma.user.count()
    console.log(`Users: ${userCount} total`)
    console.log('')

    // Check drafts
    const draftCount = await prisma.draft.count()
    const courseDraftCount = await prisma.courseDraft.count()
    console.log(`Drafts: ${draftCount} resource drafts, ${courseDraftCount} course drafts`)

  } catch (error) {
    console.error('Error checking database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabaseData()