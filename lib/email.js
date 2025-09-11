import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendOtpEmail(to, otp) {
  const msg = {
    to,
    from: process.env.FROM_EMAIL, 
    subject: 'Your OTP for School App Login',
    text: `
Hi,

Your One-Time Password (OTP) for School App login is: ${otp}

This code will expire in 10 minutes.
If you did not request this, please ignore this email.

Thanks,  
School App Team
Hyderabad, India
    `,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <p>Hi,</p>
        <p>Your One-Time Password (OTP) for <strong>School App</strong> login is:</p>
        <h2 style="color: #2e86de; letter-spacing: 2px;">${otp}</h2>
        <p>This code will expire in <strong>10 minutes</strong>.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br />
        <p>Thanks,<br/>School App Team<br/>Hyderabad, India</p>
      </div>
    `,
  };

  return sgMail.send(msg);
}
