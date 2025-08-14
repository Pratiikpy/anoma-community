import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { title, description, category, imageUrl, authorName, authorEmail } = req.body;

    // Validate required fields
    if (!title || !description || !category || !imageUrl || !authorName || !authorEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['title', 'description', 'category', 'imageUrl', 'authorName', 'authorEmail']
      });
    }

    // Create content record
    const { data: content, error: contentError } = await supabase
      .from('content')
      .insert([
        {
          id: uuidv4(),
          title,
          description,
          category,
          image_url: imageUrl,
          author_name: authorName,
          author_email: authorEmail,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (contentError) {
      console.error('Supabase content error:', contentError);
      return res.status(500).json({ error: 'Failed to save content' });
    }

    // Send notification email (optional)
    // You can integrate with SendGrid, Resend, or other email services here

    res.status(201).json({
      success: true,
      message: 'Content submitted successfully',
      content: content[0]
    });

  } catch (error) {
    console.error('Content submission error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 