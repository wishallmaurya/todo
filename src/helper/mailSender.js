import nodemailer from 'nodemailer'
export const sendMail=async(name,email)=>{

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});
  let info = await transporter.sendMail({
    from: '"Iron Man 👻" <rev.paradox766@gmail.com>', // sender address
    to: `${name},${email}`, // list of receivers
    subject: "Account activated successfully", // Subject line
    text: "", // plain text body
    html: "<b>Account activated successfully Otp validation success</b>", // html body

  });

  console.log("Message sent: %s", info.messageId);
}

export const sendOtp=async(name,email)=>{

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: 'rev.paradox766@gmail.com',
        pass: "tfjnibiwubdnzkug"
    }
});
let otp = Math.random() * 9991;
  let info = await transporter.sendMail({
    from: '"Iron Man 👻" <rev.paradox766@gmail.com>', // sender address
    to: `${name},${email}`, // list of receivers
    subject: "OTP ✔", // Subject line
    text: "", // plain text body
    html: `${~~otp}`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  return ~~otp
}