#!/usr/bin/env node

/**
 * Simple integration test for seed data
 * Run with: node test-integration.js
 */

const fs = require('fs');
const path = require('path');

async function runTest() {
  try {
    console.log('🧪 Testing seed data integration...')
    
    // Test JSON files directly
    const coursePath = path.join(__dirname, 'src/data/mockDb/Course.json');
    const resourcePath = path.join(__dirname, 'src/data/mockDb/Resource.json');
    const lessonPath = path.join(__dirname, 'src/data/mockDb/Lesson.json');
    
    // Check if files exist
    if (!fs.existsSync(coursePath)) {
      console.log('❌ Course.json not found at:', coursePath)
      return
    }
    
    if (!fs.existsSync(resourcePath)) {
      console.log('❌ Resource.json not found at:', resourcePath)
      return
    }
    
    if (!fs.existsSync(lessonPath)) {
      console.log('❌ Lesson.json not found at:', lessonPath)
      return
    }
    
    // Read and parse JSON files
    const courseData = JSON.parse(fs.readFileSync(coursePath, 'utf8'));
    const resourceData = JSON.parse(fs.readFileSync(resourcePath, 'utf8'));
    const lessonData = JSON.parse(fs.readFileSync(lessonPath, 'utf8'));
    
    console.log('📊 Seed data stats:', {
      courses: courseData.length,
      resources: resourceData.length,
      lessons: lessonData.length,
      coursesFromSeed: courseData.length,
      resourcesFromSeed: resourceData.length,
      lessonsFromSeed: lessonData.length
    })
    
    if (courseData.length > 0) {
      console.log('✅ Courses loaded from seed data:', courseData.length)
    } else {
      console.log('❌ No courses found in seed data')
    }
    
    if (resourceData.length > 0) {
      console.log('✅ Resources loaded from seed data:', resourceData.length)
    } else {
      console.log('❌ No resources found in seed data')
    }
    
    if (lessonData.length > 0) {
      console.log('✅ Lessons loaded from seed data:', lessonData.length)
    } else {
      console.log('❌ No lessons found in seed data')
    }
    
    // Show sample data
    if (courseData.length > 0) {
      console.log('📄 Sample course:', {
        id: courseData[0].id,
        userId: courseData[0].userId,
        price: courseData[0].price,
        submissionRequired: courseData[0].submissionRequired
      })
    }
    
    if (resourceData.length > 0) {
      console.log('📄 Sample resource:', {
        id: resourceData[0].id,
        userId: resourceData[0].userId,
        price: resourceData[0].price,
        videoId: resourceData[0].videoId || 'NULL'
      })
    }
    
    if (lessonData.length > 0) {
      console.log('📄 Sample lesson:', {
        id: lessonData[0].id,
        courseId: lessonData[0].courseId,
        resourceId: lessonData[0].resourceId,
        index: lessonData[0].index
      })
    }
    
    // Test lesson relationships
    if (lessonData.length > 0 && courseData.length > 0) {
      const courseId = courseData[0].id
      const lessonsForCourse = lessonData.filter(lesson => lesson.courseId === courseId)
      console.log(`📚 Found ${lessonsForCourse.length} lessons for course ${courseId}`)
      
      if (lessonsForCourse.length > 0) {
        console.log('📝 Lessons for this course (by index):', 
          lessonsForCourse.sort((a, b) => a.index - b.index).map(l => `${l.index}: ${l.id}`))
      }
    }
    
    console.log('\n✅ Basic integration test completed!')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

runTest()