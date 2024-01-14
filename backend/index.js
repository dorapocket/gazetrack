var express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const {MD5} = require('crypto-js');
var cors = require('cors');

var app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/upload', async (req, res) => {
  try {
    const jsonString = req.body;
    /**
     * {
     *    experimentee: {
     *      number:xx
     *      name:xx
     *      age:xx
     *    },
     *    data:xx
     * }
     */
    // console.log("MD5 Error",calculateMD5("gyp"+JSON.stringify(jsonString.experimentee)+"lgy"));
    if(jsonString.experimentee.name){
      jsonString.experimentee.name = jsonString.experimentee.name.replace("lgy","gyp")
      jsonString.experimentee.name = jsonString.experimentee.name.replace("李国宇","葛乙平")
      jsonString.experimentee.name = jsonString.experimentee.name.replace("liguoyu","geyiping")
      jsonString.experimentee.name = jsonString.experimentee.name.replace("guoyuli","yipingge")
    }
    if(jsonString.md5!=MD5("gyp"+JSON.stringify(jsonString.experimentee.idcard)+"lgy").toString()){
      
      res.status(500).send({ success: false, message: 'Not Authorized' });
      return
    }
    // 配置SMTP传输器
    const transporter = nodemailer.createTransport({
      pool: true,
      host: "smtp.exmail.qq.com",
      port: 465,
      secure: true, // use TLS
      auth: {
        user: "liguoyu@dorapocket.top",
        pass: "Zs4DEryU45psNvca",
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    // 邮件选项
    const mailOptions = {
      from: 'liguoyu@dorapocket.top',
      to: 'gyp10071350@163.com, xqyruby@163.com',
      envelope: {
        from: 'Online Experiment System <liguoyu@dorapocket.top>', // used as MAIL FROM: address for SMTP
        to: 'gyp10071350@163.com, xqyruby@163.com' // used as RCPT TO: address for SMTP
      },
      subject: 'Experiment Data '+"- "+jsonString.experimentee.name,
      text: "See Attachment",
      attachments: [
        {
          filename: 'data_'+jsonString.experimentee.name+'.json',
          content: JSON.stringify(jsonString),
        },
      ],
    };

    // 发送邮件
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