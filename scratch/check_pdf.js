import fs from 'fs';
import pdfParse from 'pdf-parse';

const dataBuffer = fs.readFileSync('C:/Users/pc/.gemini/antigravity-ide/brain/0f9124dc-c542-4c5f-9ce1-5680a2477f2f/.user_uploaded/media_1788513641275.pdf');

pdfParse(dataBuffer).then(function(data) {
  const lines = data.text.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('BT24ME') || l.includes('BT22BIO') || l.includes('26') || l.includes('250')) {
      console.log(`${idx}: ${l}`);
    }
  });
}).catch(err => console.error(err));
