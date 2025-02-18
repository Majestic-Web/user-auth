import { supabase } from '../../lib/supabaseClient';

const handler = async (req, res) => {
  try {
    // Obtain allowed origins and validate
    const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(", ");
    if (!allowedOrigins) {
      return res.status(500).json({ error: 'Server error: Allowed origins not configured' });
    }

    const origin = req.headers.origin;

    if (!allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: 'Forbidden: Origin not allowed' });

    }
    console.log('Request Origin:', origin);
    setCorsHeaders(res, origin);

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { email, password } = req.body;
    
    const { user, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      throw new Error(signUpError.message);
    }
    const { session, error: sessionError } = await supabase.auth.api.getSession();
    if (sessionError) {
      throw new Error(sessionError.message);
    }

    return res.status(200).json({ user, session });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Function to set CORS headers
function setCorsHeaders(res, origin) {
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

export default handler;


