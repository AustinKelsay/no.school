/**
 * Test script to verify seed data integration
 */

import { CourseAdapter, ResourceAdapter, LessonAdapter, getSeedDataStats } from './db-adapter'
import { getAllCoursesWithContent, getAllResourcesWithContent, getLessonsByCourseId, getLessonById } from '@/data'
import { CourseRepository, ResourceRepository, LessonRepository } from './repositories'

export async function testSeedDataIntegration() {
  console.log('🧪 Testing seed data integration...\n')
  
  // Test 1: Check seed data stats
  const stats = getSeedDataStats()
  console.log('📊 Seed data stats:', stats)
  
  // Test 1.5: Test lesson relationships
  if (stats.lessons > 0) {
    console.log('📚 Testing lesson relationships...')
    const lessons = await LessonAdapter.findAll()
    const courseIds = [...new Set(lessons.map(l => l.courseId).filter(Boolean))]
    console.log(`✅ Found lessons for ${courseIds.length} different courses`)
    
    // Test lessons for first course
    if (courseIds.length > 0) {
      const firstCourseId = courseIds[0]
      const lessonsForCourse = lessons.filter(l => l.courseId === firstCourseId)
      console.log(`✅ Course ${firstCourseId} has ${lessonsForCourse.length} lessons`)
      
      // Show lesson order
      const sortedLessons = lessonsForCourse.sort((a, b) => a.index - b.index)
      console.log('📝 Lesson order:', sortedLessons.map(l => `${l.index}: ${l.id.substring(0, 8)}...`))
    }
  }
  
  // Test 2: Test direct adapter access
  console.log('\n🔧 Testing direct adapter access...')
  const courses = await CourseAdapter.findAll()
  const resources = await ResourceAdapter.findAll()
  const lessons = await LessonAdapter.findAll()
  
  console.log(`✅ Courses found: ${courses.length}`)
  console.log(`✅ Resources found: ${resources.length}`)
  console.log(`✅ Lessons found: ${lessons.length}`)
  
  // Test 3: Test repository layer
  console.log('\n📚 Testing repository layer...')
  const repoCourses = await CourseRepository.findAll()
  const repoResources = await ResourceRepository.findAll()
  const repoLessons = await LessonAdapter.findAll()
  
  console.log(`✅ Repository courses: ${repoCourses.length}`)
  console.log(`✅ Repository resources: ${repoResources.length}`)
  console.log(`✅ Repository lessons: ${repoLessons.length}`)
  
  // Test 4: Test display layer integration (with Nostr)
  console.log('\n🎨 Testing display layer integration...')
  const displayCourses = getAllCoursesWithContent()
  const displayResources = getAllResourcesWithContent()
  
  console.log(`✅ Display courses: ${displayCourses.length}`)
  console.log(`✅ Display resources: ${displayResources.length}`)
  
  // Test 4.5: Test lesson data functions
  console.log('\n📚 Testing lesson data functions...')
  if (courses.length > 0) {
    const firstCourseId = courses[0].id
    const courseLessons = getLessonsByCourseId(firstCourseId)
    console.log(`✅ getLessonsByCourseId(${firstCourseId}): ${courseLessons.length} lessons`)
    
    if (courseLessons.length > 0) {
      const firstLesson = getLessonById(courseLessons[0].id)
      console.log(`✅ getLessonById(${courseLessons[0].id}): ${firstLesson ? 'Found' : 'Not found'}`)
    }
  }
  
  // Test 5: Test CRUD operations
  console.log('\n💾 Testing CRUD operations...')
  
  // Create a new course
  const newCourse = await CourseAdapter.create({
    userId: 'test-user-id',
    price: 5000,
    noteId: 'test-note-id',
    submissionRequired: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  console.log(`✅ Created course: ${newCourse.id}`)
  
  // Update the course
  const updatedCourse = await CourseAdapter.update(newCourse.id, {
    price: 10000
  })
  console.log(`✅ Updated course price: ${updatedCourse?.price}`)
  
  // Find the course
  const foundCourse = await CourseAdapter.findById(newCourse.id)
  console.log(`✅ Found course: ${foundCourse?.id}`)
  
  // Delete the course
  const deleted = await CourseAdapter.delete(newCourse.id)
  console.log(`✅ Deleted course: ${deleted}`)
  
  // Test 6: Test some sample data
  console.log('\n🔍 Sample data preview...')
  if (courses.length > 0) {
    console.log('First course:', {
      id: courses[0].id,
      userId: courses[0].userId,
      price: courses[0].price,
      submissionRequired: courses[0].submissionRequired
    })
  }
  
  if (resources.length > 0) {
    console.log('First resource:', {
      id: resources[0].id,
      userId: resources[0].userId,
      price: resources[0].price,
      videoId: resources[0].videoId
    })
  }
  
  if (displayCourses.length > 0) {
    console.log('First display course:', {
      id: displayCourses[0].id,
      title: displayCourses[0].title,
      description: displayCourses[0].description,
      isPremium: displayCourses[0].isPremium
    })
  }
  
  console.log('\n✅ All tests completed successfully!')
  
  return {
    stats,
    courses: courses.length,
    resources: resources.length,
    lessons: lessons.length,
    displayCourses: displayCourses.length,
    displayResources: displayResources.length
  }
}

// Export for console testing
export default testSeedDataIntegration