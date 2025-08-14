const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authorization header for admin token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - Admin token required' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify admin token (you can use JWT verification here)
    // For now, we'll use a simple check - you should implement proper JWT verification
    if (token !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: 'Forbidden - Invalid admin token' });
    }

    const { limit = 50, offset = 0 } = req.query;

    const { data: content, error, count } = await supabase
      .from('content')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      console.error('Supabase query error:', error);
      return res.status(500).json({ error: 'Failed to fetch pending content' });
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
    console.error('Pending content fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 