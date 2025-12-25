var express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const {MD5} = require('crypto-js');
var cors = require('cors');

var app = express();
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(cors());

function convertToThreeDigitString(number) {
  var str = number.toString()
  while (str.length < 3) {
      str = '0' + str;
  }

  return str;
}

app.post('/upload', async (req, res) => {
  try {
    const jsonString = req.body;
    if(jsonString.md5!=MD5("sec"+JSON.stringify(jsonString.experimentee.idcard)).toString()){
      res.status(500).send({ success: false, message: 'Not Authorized' });
      return
    }
    const transporter = nodemailer.createTransport({
      pool: true,
      host: "smtp.exmail.qq.com",
      port: 465,
      secure: true, // use TLS
      auth: {
        user: "[hidden]",
        pass: "[hidden]",
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: 'Online Experiment System <[hidden]>',
      to: '[hidden]',
      envelope: {
        from: 'Online Experiment System <[hidden]>', // used as MAIL FROM: address for SMTP
        to: '[hidden]' // used as RCPT TO: address for SMTP
      },
      subject: 'Experiment Data '+"- "+convertToThreeDigitString(jsonString.experimentee.id) + " - "+jsonString.experimentee.name,
      text: "See Attachment",
      attachments: [
        {
          filename: 'data_'+convertToThreeDigitString(jsonString.experimentee.id)+'.json',
          content: JSON.stringify(jsonString),
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent: ', info.response);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ success: false, message: 'Internal Server Error: '+error });
  }
});

app.listen(9000, () => {
    console.log('start success.');
}).on('error', (e) => {
    console.error(e.code, e.message)
})