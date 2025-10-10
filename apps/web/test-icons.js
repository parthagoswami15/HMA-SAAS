const TablerIcons = require('@tabler/icons-react');

console.log('🔍 Checking Tabler Icons...\n');

const iconsToCheck = [
  'IconScalpel',
  'IconVital',
  'IconDepartment',
  'IconHealthRecognition',
  'IconTrendingDown2',
  'IconEmergencyBed',
  'IconNurse',
  'IconMedicalCross',
  'IconList',
  'IconLayoutColumns'
];

console.log('Testing potentially problematic icons:\n');

iconsToCheck.forEach(iconName => {
  const exists = !!TablerIcons[iconName];
  console.log(`${iconName}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
});

console.log('\n' + '='.repeat(50));
console.log(`\nTotal Tabler icons available: ${Object.keys(TablerIcons).filter(k => k.startsWith('Icon')).length}`);
