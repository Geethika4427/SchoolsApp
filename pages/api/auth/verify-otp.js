import pool from '../../../lib/db';
import crypto from 'crypto';
import { signToken, serializeTokenCookie } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { email, otp } = req.body || {};
  if (!email || !otp) return res.status(400).json({ error: 'Email + OTP required' });

  const otp_hash = crypto.createHash('sha256').update(otp).digest('hex');

  try {
    const [rows] = await pool.query(
      'SELECT * FROM otps WHERE email = ? AND otp_hash = ? AND used = 0 AND expires_at > NOW() ORDER BY id DESC LIMIT 1',
      [email, otp_hash]
    );

    if (!rows || rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    const otpRow = rows[0];
    await pool.query('UPDATE otps SET used = 1 WHERE id = ?', [otpRow.id]);

    // Create or fetch user (already created on send-otp)
    const [urows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
    const user = urows[0];

    // create JWT
    const token = signToken({ userId: user.id, email });

    // set cookie
    const cookie = serializeTokenCookie(token);
    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
