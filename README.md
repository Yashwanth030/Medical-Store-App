# PharMArt
Project Overview
This application is a personal medical store management system designed for a single predefined admin and multiple users. Users can place orders by selecting medicines or uploading handwritten medicine requests. The admin manages inventory and monitors all user orders.

### https://pharmartt.netlify.app/

## Key Functionalities Completed
### User Side
User registration and login with JWT-based authentication.
Browse available medicines added by the admin.

### Place orders by:

Selecting medicines from the list.
Uploading an image (handwritten slip or prescription).
Choose payment method:
Online payment with slip upload.
Cash on Delivery (COD) option.
Basic chatbot for medicine-related queries (test version with static answers).

## Admin Side
Predefined admin creation script (createAdmin.js).
Admin login and session-based access control.

### Admin can:

Add, edit, delete medicines (with image upload support).
View all orders placed by users.
See payment method, uploaded slip, and order details.
Update delivery/payment status if needed.

## Technical Tasks Completed
MongoDB database connection and schema design (User, Medicine, Order models).

### API routes:

/api/users, /api/auth, /api/medicines, /api/orders, /api/chatbot
File upload setup using multer.
Chatbot backend route with OpenAI/static fallback.
Proxy configuration for frontend (/api/... calls).
Chatbot UI component built in React.

## Future Enhancements (Planned Features)
These are features considered for future updates to improve functionality, automation, and usability of the Medical Store app:

### AI & Automation
AI Chatbot (Enhanced)
Use OpenAI/Gemini APIs to answer user queries about medicines, usage, and symptoms.

AI-Based Slip Reader (OCR)
Extract medicine names from uploaded handwritten slips and auto-fill the order cart.

### Order & Payment Enhancements
Direct Online Payment Integration
Allow users to pay directly via UPI, Paytm, PhonePe, etc., without uploading slip manually.

Invoice PDF Generation
Automatically generate downloadable invoices for users and admin for each order.

Order Status Tracking
Add order status field to track:

pending → shipped → delivered

### Admin can update these as order progresses.

Cloud & Notifications
Cloud Storage (e.g., Cloudinary/AWS S3)
Store uploaded images (slips, prescriptions) securely and retrieve even after backend restart.

Email/WhatsApp Alerts
Notify admin when a new order is placed or payment is done.

## Role-based Access (Future ERP Style)
Admin has full access (CRUD + analytics)
Future support for sub-admins (e.g., delivery, billing, pharmacist roles)

## Admin Dashboard & Stock Management (Planned Feature)
To enhance admin experience and streamline store operations, the following features are planned:

### Stock & Inventory Management
Real-time Stock Tracking
Admin can view available quantity (countInStock) of each medicine and update it when:
-New stock is added
-Orders are placed or fulfilled
-Low Stock Alerts
-Auto-flag items with quantity below a threshold (e.g., < 10 units) and highlight them in red on dashboard.
-Bulk Import/Export
-Upload or download medicine data via Excel/CSV for easier inventory updates.




