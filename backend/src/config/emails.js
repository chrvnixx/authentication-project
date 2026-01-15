import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.js";

export async function sendVerificationEmail(email, verificationToken) {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email verification",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log("MAIL ERROR:", error?.response || error?.message || error);
    console.log(process.env.MAILTRAP_TOKEN);
    throw new Error("Error sending mail");
  }
}

export async function sendWelcomeEmail(email, name) {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "ca16ecda-153c-41b5-adbe-e23b06687576",
      template_variables: {
        name: name,
        company_info_name: "Chronixx Mooluh",
      },
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.log("Couldn't send Email", error);
  }
}
