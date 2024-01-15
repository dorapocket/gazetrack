var express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const {MD5} = require('crypto-js');
var cors = require('cors');

var app = express();
// app.use(bodyParser.json());
app.use(bodyParser.json({limit: '50mb'})); // 这里limit值可以根据实际情况自由设定
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

app.use(cors());

function convertToThreeDigitString(number) {
  var str = number.toString()
  // 如果字符串长度小于3，则在前面补0，直到长度为3
  while (str.length < 3) {
      str = '0' + str;
  }

  return str;
}

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
      from: 'Online Experiment System <liguoyu@dorapocket.top>',
      to: 'gyp10071350@163.com, xqyruby@163.com',
      // to: '993549790@qq.com',
      envelope: {
        from: 'Online Experiment System <liguoyu@dorapocket.top>', // used as MAIL FROM: address for SMTP
        to: 'gyp10071350@163.com, xqyruby@163.com' // used as RCPT TO: address for SMTP
        // to: '993549790@qq.com'
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