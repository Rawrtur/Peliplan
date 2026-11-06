import nodemailer from "nodemailer";

import { EMAIL, EMAIL_PASSWORD } from "../config/env.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (email, code) => {
  await transporter.sendMail({
    from: EMAIL,
    to: email,
    subject: "Email verification",
    // text: `Your verification code is: ${code}`
    html: `
 <div
      style="
        display: flex;
        flex-direction:row;
        width: max-content;
        font-family: Arial;
        max-width: 600px;
        margin: auto;
        background-color: #f6eecf;
        padding: 15px;
      "
    >
      <div>
        <p style="font-weight: bold; font-size: larger">
          The Future of Learning.<br />
          Simple. Easy. Fast
        </p>

        <h1 style="font-weight: 600; color: #ea7a53">Welcome to Evolvo!</h1>

        <p>Your verification code is:</p>

        <h1 style="color: #ea8a53">${code}</h1>

        <p style="font-weight: light; color: rgb(82, 82, 82)">
          This code expires in 15 minutes.
        </p>
      </div>
      <div
        style="display: flex; justify-content: center; align-items: center"
      >
      <img src="cid:maskott" width="180" />
      </div>
    </div>
`,
    attachments: [
        {
            filename: "maskott.png",
            path:"./assets/maskott.png",
            cid: "maskott"
        }
    ],
  });
};
