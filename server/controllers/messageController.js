const Message = require("../models/Message");
const { sendEmail } = require("../utils/sendMail");

const getPaginatedMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Message.countDocuments();
    const messages = await Message.find({})
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(total / limit);

    res.json({
      status: true,
      messages,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Keep your existing endpoints
const putMsg = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    await Message.create({ name, email, message });

    const emailOptions = {
      to: process.env.COMPANY_EMAIL,
      subject: `New Property Enquiry from ${name}`,
      html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #2B2BD9;">New Website Enquiry</h2>
                    <p><strong>Sender Name:</strong> ${name}</p>
                    <p><strong>Sender Email:</strong> ${email}</p>
                    <hr />
                    <p><strong>Message:</strong></p>
                    <p style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${message}</p>
                    <hr />
                    <p style="font-size: 12px; color: #888;">This message was sent via the SRI SAI RAM Estate website contact form.</p>
                </div>
            `,
    };

    await sendEmail(emailOptions);

    res.json({ status: true });
  } catch (err) {
    res.json({ status: false, message: "Cannot Drop Message" });
  }
};

const getMsg = async (req, res) => {
  try {
    const msg = await Message.find({});
    return res.json({ status: true, msg });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: false, message: "Server error" });
  }
};

const deleteMsg = async (req, res) => {
  try {
    const { _id } = req.body;
    await Message.findByIdAndDelete(_id);
    res.json({ status: true, message: "Inquiry deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ status: false, message: "Failed to delete message" });
  }
};

module.exports = { putMsg, getMsg, getPaginatedMessages, deleteMsg };
