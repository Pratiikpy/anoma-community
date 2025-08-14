const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('content')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    // Filter by category if specified
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: content, error, count } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: 'Failed to fetch content' });
    }

    res.status(200).json({
      success: true,
      content: content || [],
      count: count || 0,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: content && content.length === parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Content fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 