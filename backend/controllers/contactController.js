import Contact from "../models/Contact.js";

// Submit Contact Form: /api/contact/submit
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const userId = req.body.userId || req.user?.userId || null;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.json({ 
        success: false, 
        message: "Invalid email format" 
      });
    }

    // Create contact submission
    await Contact.create({
      name,
      email,
      subject,
      message,
      userId
    });

    res.json({ 
      success: true, 
      message: "Thank you for contacting us! We will get back to you soon." 
    });
  } catch (error) {
    console.log(error.message);
    res.json({ 
      success: false, 
      message: error.message || "Failed to submit contact form. Please try again." 
    });
  }
};

// Get All Contact Submissions (for admin): /api/contact/get-all
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
