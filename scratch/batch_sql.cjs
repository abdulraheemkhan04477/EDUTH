const fs = require('fs');

const content = fs.readFileSync('scratch/seed_subjects.sql', 'utf-8');
const lines = content.split('\n');

const chunkSize = Math.ceil(lines.length / 4);

for (let i = 0; i < 4; i++) {
  const chunk = lines.slice(i * chunkSize, (i + 1) * chunkSize).join('\n');
  fs.writeFileSync(`scratch/batch${i + 1}.sql`, chunk, 'utf-8');
  console.log(`Wrote batch${i + 1}.sql (${chunk.length} bytes)`);
}
