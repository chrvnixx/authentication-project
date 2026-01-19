import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
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
        verificationToken,
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

export async function sendResetPasswordTokenEmail(email, resetUrl) {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
      category: "Password reset",
    });
    console.log("Password recovery mail sent!!! ", response);
  } catch (error) {
    console.log(
      "couldn't send password recovery mail",
      error?.response || error?.message,
    );
  }
}

export async function sendPasswordResetSuccessEmail(email) {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password reset success",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password reset",
    });
    console.log("Success email sent!!!", response);
  } catch (error) {
    console.log("Unable to send success email", error);
  }
}
