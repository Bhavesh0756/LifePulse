const { isBloodCompatible, DONOR_TO_RECIPIENT_MATRIX } = require('../utils/bloodCompatibility');

const BLOOD_GROUPS = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

const expectedCompatibleCounts = {
  'O-': 8,
  'O+': 4,
  'A-': 4,
  'A+': 2,
  'B-': 4,
  'B+': 2,
  'AB-': 2,
  'AB+': 1,
};

let passed = 0;
let failed = 0;

console.log('--- RUNNING RED BLOOD CELL COMPATIBILITY TESTS ---');

for (const donor of BLOOD_GROUPS) {
  let compatibleCount = 0;
  for (const recipient of BLOOD_GROUPS) {
    const isCompatible = isBloodCompatible(donor, recipient);
    
    // Explicitly check exact matches expectations
    if (DONOR_TO_RECIPIENT_MATRIX[donor].includes(recipient)) {
      if (isCompatible) {
        passed++;
        compatibleCount++;
      } else {
        console.error(`❌ FAIL: Expected ${donor} to be compatible with ${recipient}, but it was rejected.`);
        failed++;
      }
    } else {
      if (!isCompatible) {
        passed++;
      } else {
        console.error(`❌ FAIL: Expected ${donor} to be INCOMPATIBLE with ${recipient}, but it was allowed.`);
        failed++;
      }
    }
  }

  // Validate the total compatible count for the donor
  if (compatibleCount === expectedCompatibleCounts[donor]) {
    console.log(`✅ ${donor} donor passed (Matches ${compatibleCount} recipients as expected)`);
  } else {
    console.error(`❌ FAIL: ${donor} donor matched ${compatibleCount} recipients, expected ${expectedCompatibleCounts[donor]}`);
  }
}

console.log('\n--- EDGE CASES ---');

// Invalid blood group
if (!isBloodCompatible('INVALID', 'A+')) {
  console.log('✅ Edge Case: Invalid donor rejected');
  passed++;
} else {
  console.error('❌ Edge Case: Invalid donor allowed');
  failed++;
}

if (!isBloodCompatible('O+', 'INVALID')) {
  console.log('✅ Edge Case: Invalid recipient rejected');
  passed++;
} else {
  console.error('❌ Edge Case: Invalid recipient allowed');
  failed++;
}

// Missing blood group
if (!isBloodCompatible(undefined, 'A+')) {
  console.log('✅ Edge Case: Missing donor rejected');
  passed++;
} else {
  console.error('❌ Edge Case: Missing donor allowed');
  failed++;
}

console.log('\n--- SPECIFIC SCENARIOS FROM PROMPT ---');

const scenarios = [
  { donor: 'O+', request: 'O+', expected: true },
  { donor: 'O+', request: 'A+', expected: true },
  { donor: 'O+', request: 'B+', expected: true },
  { donor: 'O+', request: 'AB+', expected: true },
  { donor: 'O+', request: 'O-', expected: false },
  { donor: 'O+', request: 'A-', expected: false },
  { donor: 'O+', request: 'B-', expected: false },
  { donor: 'O+', request: 'AB-', expected: false },
  { donor: 'AB+', request: 'AB+', expected: true },
  { donor: 'AB+', request: 'O+', expected: false },
  { donor: 'O-', request: 'AB+', expected: true },
  { donor: 'O-', request: 'O-', expected: true },
];

for (const s of scenarios) {
  const result = isBloodCompatible(s.donor, s.request);
  if (result === s.expected) {
    console.log(`✅ Scenario: ${s.donor} donor -> ${s.request} request = ${s.expected ? 'ALLOW' : 'REJECT'}`);
    passed++;
  } else {
    console.error(`❌ Scenario FAIL: ${s.donor} donor -> ${s.request} request gave ${result}, expected ${s.expected}`);
    failed++;
  }
}

console.log(`\n============================`);
console.log(`Total Passed: ${passed}`);
console.log(`Total Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
