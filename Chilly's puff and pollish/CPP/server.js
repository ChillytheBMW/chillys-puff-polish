const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = 3000;

// === SETUP INSTRUCTIONS ===
// 1. Go to https://myaccount.google.com/apppasswords while logged in as chillyspuffandpolish@gmail.com
// 2. Generate an App Password for 'Mail' and 'Other' (give it a name like 'ChecklistApp')
// 3. Paste the generated password below (it will be 16 characters, e.g. abcd efgh ijkl mnop)
const EMAIL_USER = 'chillyspuffandpolish@gmail.com';
const EMAIL_PASS = 'ezfkgqslgvlvmqdx'; // <-- Replace this with your Gmail App Password

app.use(cors());
app.use(express.json());

app.post('/send-checklist', async (req, res) => {
  const { employee, date, checklist } = req.body;
  if (!employee || !date || !checklist) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: EMAIL_USER,
    subject: `Checklist submitted by ${employee} on ${date}`,
    text: `Employee: ${employee}\nDate: ${date}\n\nChecklist:\n${checklist.join('\n')}`,
    html: `<h2>Chilly's Puff and Polish - Detailer Checklist</h2>
      <p><strong>Employee:</strong> ${employee}<br><strong>Date:</strong> ${date}</p>
      <h3>Checklist:</h3>
      <ul>${checklist.map(item => `<li>${item}</li>`).join('')}</ul>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send email. Make sure your Gmail App Password is correct and less secure app access is enabled. See server.js for setup instructions.', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});