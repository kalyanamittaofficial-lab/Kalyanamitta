import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({ message: 'Slug query parameter is required' });
  }

  try {
    const notion = new Client({ auth: process.env.NOTION_SECRET });
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!process.env.NOTION_SECRET || !process.env.NOTION_DATABASE_ID) {
       return res.status(500).json({ message: 'Server configuration missing.' });
    }

    const n2m = new NotionToMarkdown({ notionClient: notion });

    // 1. Query the database to find the page with the matching slug
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        and: [
          {
            property: 'Slug',
            rich_text: {
              equals: slug
            }
          },
          {
            property: 'Status',
            select: {
              equals: 'Published'
            }
          }
        ]
      }
    });

    if (response.results.length === 0) {
      return res.status(404).json({ message: 'Blog post not found or not published.' });
    }

    const page = response.results[0];

    // 2. Extract properties
    const title = page.properties.Name?.title?.[0]?.plain_text || 'Untitled';
    const date = page.properties.Date?.date?.start || '';
    const author = page.properties.Author?.rich_text?.[0]?.plain_text || '';
    
    let cover = null;
    if (page.cover) {
      if (page.cover.type === 'external') cover = page.cover.external.url;
      if (page.cover.type === 'file') cover = page.cover.file.url;
    } else if (page.properties.Cover?.files?.[0]) {
      const coverFile = page.properties.Cover.files[0];
      cover = coverFile.type === 'external' ? coverFile.external.url : coverFile.file.url;
    }

    // 3. Convert page blocks to markdown
    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const markdown = n2m.toMarkdownString(mdBlocks);

    res.status(200).json({
      id: page.id,
      title,
      slug,
      date,
      author,
      cover,
      content: markdown.parent || markdown
    });

  } catch (error) {
    console.error('Error fetching single blog from Notion:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
