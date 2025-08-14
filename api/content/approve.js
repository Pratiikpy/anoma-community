import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check authorization header for admin token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - Admin token required' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify admin token
    if (token !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ error: 'Forbidden - Invalid admin token' });
    }

    const { id, action, adminNotes } = req.body;

    if (!id || !action) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['id', 'action']
      });
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ 
        error: 'Invalid action. Must be "approve" or "reject"'
      });
    }

    const status = action === 'approve' ? 'approved' : 'rejected';
    const updateData = {
      status,
      updated_at: new Date().toISOString()
    };

    // Add admin notes if provided
    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }

    const { data: content, error } = await supabase
      .from('content')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase update error:', error);
      return res.status(500).json({ error: 'Failed to update content status' });
    }

    if (!content || content.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    // Send notification email to content author (optional)
    // You can integrate with SendGrid, Resend, or other email services here

    res.status(200).json({
      success: true,
      message: `Content ${status} successfully`,
      content: content[0]
    });

  } catch (error) {
    console.error('Content approval error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 