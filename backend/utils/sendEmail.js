/* ===================================================== */
/* =============== EMAIL SENDER (OPTIONAL) ============= */
/* ===================================================== */

export const sendEmail = async ({
  to,
  subject,
  html,
}) => {

  const hasSmtp =
    process.env.EMAIL_HOST &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS;

  // No SMTP configured — log instead so the flow works in dev
  if (!hasSmtp) {

    console.log("\n[EMAIL] Would send to:", to);
    console.log("[EMAIL] Subject:", subject);
    console.log("[EMAIL] Body:", html.replace(/<[^>]+>/g, " ").trim());
    console.log("[EMAIL] End\n");

    return;
  }

  let nodemailer;

  try {

    nodemailer =
      (await import("nodemailer")).default;

  } catch (error) {

    console.log(
      "[EMAIL] nodemailer is not installed; skipping send."
    );

    return;
  }

  const port =
    Number(process.env.EMAIL_PORT) ||
    587;

  const transporter =
    nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      // Fail fast so a slow/blocked SMTP never hangs the request
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

  try {

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

  } catch (error) {

    console.error(
      "[EMAIL] Failed to send:",
      error.message || error
    );

  }

};
