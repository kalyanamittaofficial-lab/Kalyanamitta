import { Client } from '@notionhq/client';

export default async function handler(req, res) {
  // Check for GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const notion = new Client({ auth: process.env.NOTION_SECRET });
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!process.env.NOTION_SECRET || !process.env.NOTION_DATABASE_ID) {
       return res.status(500).json({ message: 'Server configuration missing. NOTION_SECRET and NOTION_DATABASE_ID must be set.' });
    }

    // Query Notion Database
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Status',
        select: {
          equals: 'Published'
        }
      },
      sorts: [
        {
          property: 'Date',
          direction: 'descending'
        }
      ]
    });

    const blogs = response.results.map((page) => {
      // Extract basic properties safely
      const title = page.properties.Name?.title?.[0]?.plain_text || 'Untitled';
      const slug = page.properties.Slug?.rich_text?.[0]?.plain_text || '';
      const date = page.properties.Date?.date?.start || '';
      const author = page.properties.Author?.rich_text?.[0]?.plain_text || '';
      
      // Extract Cover image (can be external URL or uploaded file)
      let cover = null;
      if (page.cover) {
        if (page.cover.type === 'external') cover = page.cover.external.url;
        if (page.cover.type === 'file') cover = page.cover.file.url;
      } else if (page.properties.Cover?.files?.[0]) {
        // Fallback to Cover property if cover is set there instead of page cover
        const coverFile = page.properties.Cover.files[0];
        cover = coverFile.type === 'external' ? coverFile.external.url : coverFile.file.url;
      }

      return {
        id: page.id,
        title,
        slug,
        date,
        author,
        cover
      };
    });

    res.status(200).json(blogs);

  } catch (error) {
    console.error('Error fetching blogs from Notion:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}
