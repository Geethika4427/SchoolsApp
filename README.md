# Schools App

A full-stack **Next.js + MySQL** web application to manage schools, with **image uploads to Cloudinary** and database hosted on **Railway**. The app is deployed on **Vercel**.

## **Live Demo**
[View the app on Vercel](https://schools-app-7npp.vercel.app/)

## **Features**
- Add new schools with image upload
- Show list of schools with details
- View individual school details
- Email OTP Authentication (6-digit, 10 min expiry)
- Only authenticated users can Add, Edit, Delete schools
- Public users can only view schools
- Route protection for add/edit/delete pages
- Fully hosted on **Vercel** (frontend + backend)
- Images stored on **Cloudinary**
- Database hosted on **Railway MySQL**
- Server-side validation for form inputs
- Responsive design for mobile and desktop

## **Tech Stack**
- Frontend: Next.js, React
- Backend: Next.js API routes
- Database: MySQL (Railway)
- File Storage: Cloudinary
- Auth: Email OTP + JWT (cookies)
- Deployment: Vercel

## **Environment Variables**

### **Vercel**
Add the following in your project settings:

DB_HOST=<Railway DB host>
DB_USER=<Railway DB username>
DB_PASSWORD=<Railway DB password>
DB_NAME=<Railway DB name>
DB_PORT=<Railway DB port>
DB_SSL=true

CLOUDINARY_CLOUD_NAME=<Cloudinary cloud name>
CLOUDINARY_API_KEY=<Cloudinary API key>
CLOUDINARY_API_SECRET=<Cloudinary API secret>

SENDGRID_API_KEY=<your Sendgrid API_KEY>
FROM_EMAIL=<Sender Email Address>
JWT_SECRET=<a_long_random_secret_string>
JWT_EXPIRES_IN=7d
COOKIE_NAME=auth_token

### **Local**(For local developmen)
Same variables 

## **Setup Instructions**

1. **Clone the repository**
git clone https://github.com/Geethika4427/SchoolsApp.git <br>
cd SchoolsApp<br>

# Install dependencies
npm install

# Run locally<br>
npm run dev <br>
Open http://localhost:3000

# Deploy to Vercel

1) Push changes to GitHub <br>
2) Vercel automatically redeploys the app <br>
3) Make sure environment variables are set in Vercel<br>

### Step 2 Updates 

Implemented Email OTP login system (6-digit code, expires in 10 minutes)<br>
JWT & cookies used for maintaining session<br>
Protected routes for adding, editing, and deleting schools<br>
Public access only for viewing schools<br>
OTP sent using free email service (Nodemailer + Gmail SMTP)

# Author
Geethika <br>

GitHub: https://github.com/Geethika4427

