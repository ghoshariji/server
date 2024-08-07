const express = require("express");
const app = express();
const nodemailer = require("nodemailer");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Priority Queue Class
class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(node, priority) {
    let flag = false;
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i].priority > priority) {
        this.values.splice(i, 0, { node, priority });
        flag = true;
        break;
      }
    }
    if (!flag) {
      this.values.push({ node, priority });
    }
  }

  dequeue() {
    return this.values.shift();
  }

  size() {
    return this.values.length;
  }
}

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "arijitghosh1203@gmail.com",
    pass: "hryc yasr hlft mjsi",
  },
});

const sendMail = async (mailContent) => {
  let mailOptions = {
    from: '"Arijit-DEV" <arijitghosh1203@gmail.com>',
    to: "arijit1087.be22@chitkarauniversity.edu.in",
    subject: `New Contact Fill Up - ${mailContent}`,
    text: `Name: ${mailContent}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Mail sent successfully");
  } catch (error) {
    console.error("Error sending mail:", error);
  }
};

let pQ = new PriorityQueue();

app.post("/send-mail", async (req, res) => {
  try {
    const { priority, mailContent } = req.body;

    if (priority === "otp") {
      pQ.enqueue(mailContent, 0);
    } else if (priority === "promo") {
      pQ.enqueue(mailContent, 1);
    } else {
      pQ.enqueue(mailContent, 2);
    }

    res.status(201).send({
      message: "Mails queued and sent based on priority",
      success: true,
    });
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).send({
      message: "Error processing request",
      success: false,
    });
  }
});

setInterval(async () => {
  while (pQ.size() > 0) {
    let { node: mailToSend } = pQ.dequeue();
    console.log(mailToSend);
    await sendMail(mailToSend);
  }
}, 3000);
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
