import { supabase } from '../../lib/supabaseClient';

const handler = async (req, res) => {
  // Устанавливаем заголовки для разрешения CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://app-testing-next-js-supabase.webflow.io , https://user-auth-wine.vercel.app'); // Разрешаем только Webflow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Разрешаем методы
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Разрешаем заголовки
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Добавить, если используете cookies или сессии

  // Если это preflight запрос (OPTIONS), то просто возвращаем успешный ответ
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

