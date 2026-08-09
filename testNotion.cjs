const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8');
env.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    process.env[key.trim()] = values.join('=').trim();
  }
});

const { Client } = require('@notionhq/client');

async function testNotion() {
  try {
    const notion = new Client({ auth: process.env.NOTION_SECRET });
    const databaseId = process.env.NOTION_DATABASE_ID;

    console.log('Database ID:', databaseId);
    console.log('Secret starts with:', process.env.NOTION_SECRET.substring(0, 5));

    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Status',
        select: {
          equals: 'Published'
        }
      }
    });

    console.log(`Found ${response.results.length} published blogs.`);
    if (response.results.length > 0) {
      console.log('First blog:', JSON.stringify(response.results[0].properties, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.body ? error.body : error.message);
  }
}

testNotion();
