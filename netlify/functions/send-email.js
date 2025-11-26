exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body || "{}");

    const {
      name,
      company,
      email,
      purpose,
      timeIn,
      timeOut,
      date
    } = data;

    const subject = `New visitor sign-in: ${name}`;
    const text = `
New visitor sign-in:

Name: ${name}
Company: ${company}
Email: ${email}
Purpose of Visit: ${purpose}
Time In: ${timeIn}
Time Out: ${timeOut}
Date: ${date}
    `.trim();

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM;
    const to = "info@block-buddy.co.uk";

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        text,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(errText);
      return { statusCode: 500, body: "Failed to send email" };
    }

    return { statusCode: 200, body: "OK" };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: "Server error" };
  }
};
