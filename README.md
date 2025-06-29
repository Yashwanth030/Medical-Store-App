# Medical Store Web Application – Summary
🔹 Project Overview
This application is a personal medical store management system designed for a single predefined admin and multiple users. Users can place orders by selecting medicines or uploading handwritten medicine requests. The admin manages inventory and monitors all user orders.

## Key Functionalities Completed
👤 User Side
User registration and login with JWT-based authentication.

Browse available medicines added by the admin.

## Place orders by:

Selecting medicines from the list.

Uploading an image (handwritten slip or prescription).

Choose payment method:

Online payment with slip upload.

Cash on Delivery (COD) option.

Basic chatbot for medicine-related queries (test version with static answers).

## Admin Side
Predefined admin creation script (createAdmin.js).

Admin login and session-based access control.

## Admin can:

Add, edit, delete medicines (with image upload support).

View all orders placed by users.

See payment method, uploaded slip, and order details.

Update delivery/payment status if needed.

## Technical Tasks Completed
MongoDB database connection and schema design (User, Medicine, Order models).

## API routes:

/api/users, /api/auth, /api/medicines, /api/orders, /api/chatbot

File upload setup using multer.

Chatbot backend route with OpenAI/static fallback.

Proxy configuration for frontend (/api/... calls).

Chatbot UI component built in React.
