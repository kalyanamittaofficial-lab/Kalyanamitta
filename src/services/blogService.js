// Mock data for local development when Vercel API is not running
const MOCK_BLOGS = [
  {
    id: '1',
    slug: 'finding-peace',
    title: 'ජීවිතයේ සැබෑ සැනසීම සොයා ගන්නේ කෙසේද?',
    summary: 'බොහෝ දෙනෙක් බාහිර ලෝකයෙන් සැනසීම සෙව්වද, සැබෑ සැනසීම ඇත්තේ තම සිත තුළමය. භාවනාව සහ සිහිය පිහිටුවීම හරහා එය සාක්ෂාත් කරගත හැක.',
    author: 'කල්‍යාණමිත්ත කර්තෘ මණ්ඩලය',
    date: '2024-05-12',
    imageUrl: 'https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    readTime: 'මිනිත්තු 5'
  },
  {
    id: '2',
    slug: 'meditation-basics',
    title: 'භාවනාව ආරම්භ කරන්නේ කෙසේද?',
    summary: 'ආධුනිකයන් සඳහා ආනාපානසති භාවනාව නිවැරදිව ආරම්භ කරන ආකාරය සහ එදිනෙදා ජීවිතයේදී සිත එකඟ කරගන්නා අයුරු.',
    author: 'කල්‍යාණමිත්ත කර්තෘ මණ්ඩලය',
    date: '2024-05-15',
    imageUrl: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    readTime: 'මිනිත්තු 8'
  }
];

export const getBlogs = async () => {
  try {
    const response = await fetch('/api/blogs');
    
    // In local Vite dev without Vercel CLI, /api/blogs returns the raw JS file instead of executing it.
    // We must check if the response is actually JSON.
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('API returned non-JSON. Falling back to mock data (Local Dev Mode).');
      return MOCK_BLOGS;
    }
    
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return MOCK_BLOGS; // Fallback to mock data on error so UI doesn't look broken
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    const response = await fetch(`/api/blog?slug=${slug}`);
    
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return MOCK_BLOGS.find(b => b.slug === slug) || null;
    }

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch blog');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching single blog:', error);
    return MOCK_BLOGS.find(b => b.slug === slug) || null;
  }
};
