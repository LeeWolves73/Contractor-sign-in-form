import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, company, email, siteAddress, purpose, timeIn, date } = req.body;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Visitor Log <info@block-buddy.co.uk>",
      to: "info@block-buddy.co.uk",
      subject: "New Visitor Sign-In",
      html: `
        <h2>New Visitor Sign-In</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Site Address:</strong> ${siteAddress}</p>
        <p><strong>Purpose of Visit:</strong> ${purpose}</p>
        <p><strong>Time In:</strong> ${timeIn}</p>
        <p><strong>Date:</strong> ${date}</p>

        <hr />
        <p>This visitor has signed in via the Block Buddy visitor system.</p>
      `
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ error: "Email failed to send" });
  }
}
