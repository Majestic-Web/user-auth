import { supabase } from '../../lib/supabaseClient';

const handler = async (req, res) => {
  // Получаем список разрешенных доменов из переменной окружения
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(", ");

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    // Если Origin разрешен, добавляем необходимые заголовки
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    // Если Origin не разрешен, возвращаем ошибку
    return res.status(403).json({ error: 'Forbidden: Origin not allowed' });
  }

  // Если это preflight запрос (OPTIONS), просто возвращаем успешный ответ
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Обработка POST-запроса для регистрации
  if (req.method === 'POST') {
    const { email, password } = req.body;

    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Генерация сессии (токена)
    const { session, error: sessionError } = await supabase.auth.api.getSession();

    if (sessionError) {
      return res.status(400).json({ error: sessionError.message });
    }

    // Отправляем токен (если необходимо) или информацию о пользователе
    return res.status(200).json({ user, session });
  } else {
    return res.status(405).json({ error: 'Метод не поддерживается' });
  }
};

export default handler;


