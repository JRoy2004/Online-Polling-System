import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Send Verification Email
export const sendVerificationEmail = async (
  user,
  verificationToken = null,
  newEmail = null
) => {
  //console.log("NEW EMAIL: ", newEmail);
  // Configure nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });
  if (!verificationToken)
    verificationToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  const verificationUrl = `${process.env.BASE_URL}/api/auth/verify/${verificationToken}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: newEmail || user.email,
    subject: "Verify your email",
    html: `<h2>Hi ${user.username},</h2><p>Please click the link to verify your email: <a href="${verificationUrl}">Verify Email</a></p>`,
    //text: `Hi ${user.username},\nPlease click the link to verify your email: ${verificationUrl}`, // Plain text version
  });
};
