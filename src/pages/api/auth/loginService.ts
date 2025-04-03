// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;

  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/auth/login`, {
      email,
      password,
    });

    const token = response.data.access_token;

    res.setHeader(
      'Set-Cookie',
      serialize('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24,
      }),
    );

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(401).json({ message: 'Credenciais inválidas' });
  }
}
