import pool from '../../../lib/db';
import { sendOtpEmail } from '../../../lib/email';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Email required' });

  // generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // hash otp (sha256)
  const otp_hash = crypto.createHash('sha256').update(otp).digest('hex');
  const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  try {
    // Insert or update user row (optional)
    await pool.query('INSERT IGNORE INTO users (email) VALUES (?)', [email]);

    // Mark previous unused otps as used (optional) or delete old ones
    await pool.query('UPDATE otps SET used = 1 WHERE email = ?', [email]);

    // Insert new otp record
    await pool.query('INSERT INTO otps (email, otp_hash, expires_at) VALUES (?, ?, ?)', [
      email,
      otp_hash,
      expires_at,
    ]);

    // send email (plain otp)
    await sendOtpEmail(email, otp);

    return res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
