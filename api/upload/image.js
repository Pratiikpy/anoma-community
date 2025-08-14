const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
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
    const { imageData, fileName, contentType } = req.body;

    if (!imageData || !fileName || !contentType) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['imageData', 'fileName', 'contentType']
      });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(contentType)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}-${fileName}`;

    // Convert base64 to buffer
    const buffer = Buffer.from(imageData.split(',')[1], 'base64');

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('content-images')
      .upload(uniqueFileName, buffer, {
        contentType: contentType,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase storage error:', error);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('content-images')
      .getPublicUrl(uniqueFileName);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      fileName: uniqueFileName,
      publicUrl: urlData.publicUrl,
      size: buffer.length
    });

  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 