import express from "express";
import { submitContact, getAllContacts } from "../controllers/contactController.js";
import authUser from "../middlewares/authUser.js";

const contactRouter = express.Router();

// Submit contact form (public endpoint, but can use userId if authenticated)
contactRouter.post('/submit', submitContact);

// Get all contact submissions (admin only - you can add seller auth middleware if needed)
contactRouter.get('/get-all', authUser, getAllContacts);

export default contactRouter;
