export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const {
      name,
      company,
      email,
      purpose,
      timeIn,
      timeOut,
      date
    } = req.body;

    const subject = `New visitor sign-in: ${name}`;
    const text = `
New visitor sign-in:

Name: ${name}
Company: ${company}
Email: ${email}
Purpose: ${purpose}
Time In: ${timeIn}
Time Out: ${timeOut}
Date: ${date}
    `.trim();

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM,
        to: "info@block-buddy.co.uk",
        subject,
        text,
      }),
    });

    if (!response.ok) {
      return res.status(500).send("Failed to send email");
    }

    return res.status(200).send("OK");
  } catch (error) {
    return res.status(500).send("Server error");
  }
}
