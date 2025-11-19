/**
 * Test script for note-image.ts regex fix
 * Verifies that URLs with parentheses are correctly captured
 * and that existing markdown handling remains unaffected.
 */

import { getNoteImage } from '../src/lib/note-image'

function testCase(name: string, content: string, expected: string | undefined) {
  const result = getNoteImage({ content })
  const passed = result === expected
  console.log(`${passed ? '✓' : '✗'} ${name}`)
  if (!passed) {
    console.log(`  Expected: ${expected}`)
    console.log(`  Got: ${result}`)
  }
  return passed
}

console.log('Testing note-image regex fix...\n')

let allPassed = true

// Test 1: Plain URL with parentheses (the main fix)
allPassed = testCase(
  'Plain URL with parentheses',
  'Check out https://example.com/image(with)parentheses.png',
  'https://example.com/image(with)parentheses.png'
) && allPassed

// Test 2: Plain URL with parentheses and image extension
allPassed = testCase(
  'Plain URL with parentheses and .png extension',
  'Image: https://cdn.example.com/path/to/file(name).png here',
  'https://cdn.example.com/path/to/file(name).png'
) && allPassed

// Test 3: Markdown image syntax (should still work)
allPassed = testCase(
  'Markdown image syntax',
  '![alt text](https://example.com/image.png)',
  'https://example.com/image.png'
) && allPassed

// Test 4: Markdown image with parentheses in URL (should use markdown parser)
allPassed = testCase(
  'Markdown image with parentheses in URL',
  '![alt](https://example.com/image(with)parentheses.png)',
  'https://example.com/image(with)parentheses.png'
) && allPassed

// Test 5: URL stops at whitespace
allPassed = testCase(
  'URL stops at whitespace',
  'Visit https://example.com/image.png and more text',
  'https://example.com/image.png'
) && allPassed

// Test 6: URL stops at quotes
allPassed = testCase(
  'URL stops at quotes',
  'Image: "https://example.com/image.png"',
  'https://example.com/image.png'
) && allPassed

// Test 7: Multiple URLs, prefer image extension
allPassed = testCase(
  'Multiple URLs, prefer image extension',
  'See https://example.com/page and https://cdn.example.com/pic(with)data.png',
  'https://cdn.example.com/pic(with)data.png'
) && allPassed

// Test 8: URL with parentheses stops at whitespace
allPassed = testCase(
  'URL with parentheses stops at whitespace',
  'Check https://example.com/path(file).png here',
  'https://example.com/path(file).png'
) && allPassed

// Test 9: URL with parentheses stops at quotes
allPassed = testCase(
  'URL with parentheses stops at quotes',
  'Image: "https://example.com/file(name).jpg"',
  'https://example.com/file(name).jpg'
) && allPassed

console.log(`\n${allPassed ? 'All tests passed!' : 'Some tests failed.'}`)
process.exit(allPassed ? 0 : 1)




