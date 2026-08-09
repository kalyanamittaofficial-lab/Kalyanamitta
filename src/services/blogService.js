export const getBlogs = async () => {
  try {
    const response = await fetch('/api/blogs');
    if (!response.ok) {
      throw new Error('Failed to fetch blogs');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
};

export const getBlogBySlug = async (slug) => {
  try {
    const response = await fetch(`/api/blog?slug=${slug}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to fetch blog');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching single blog:', error);
    return null;
  }
};
