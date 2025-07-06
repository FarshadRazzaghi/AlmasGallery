#!/usr/bin/env node

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function suggestNames(feature, type) {
  const kebabFeature = feature.trim().toLowerCase().replace(/\s+/g, '-');
  const shortFeature = kebabFeature
    .split('-')
    .map(word => word[0])
    .join('');

  const baseName = `${kebabFeature}-${type}`;
  const selector = `app-${shortFeature}-${type}`;
  const className = toPascalCase(baseName) + 'Component';

  return {
    fileName: `${baseName}.component.ts`,
    className,
    selector
  };
}

function toPascalCase(input) {
  return input
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

rl.question('Enter feature name (e.g., Product Category): ', (feature) => {
  rl.question('Enter component type (e.g., upsert, list, form): ', (type) => {
    const result = suggestNames(feature, type);
    console.log('\\n🧠 Suggested Naming:');
    console.log(`- 📄 File name   : ${result.fileName}`);
    console.log(`- 🏷️ Selector    : ${result.selector}`);
    console.log(`- 🧱 Class name  : ${result.className}`);
    rl.close();
  });
});
