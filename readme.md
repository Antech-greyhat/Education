# AntechLearn - Programming Learning Platform
Made with ❤️ by Antech for all aspiring developers

----

## About

AntechLearn is a comprehensive full-stack educational platform designed for learning programming languages. The project consists of a responsive frontend website and a robust backend API service.

**Frontend:** A fully responsive educational website built with vanilla HTML, CSS, and JavaScript, offering an intuitive interface for browsing and learning programming languages.

**Backend API:** A comprehensive backend service providing secure authentication, user management, course handling, and administrative controls through well-structured RESTful endpoints. Built to ensure scalability, security, and performance.

Live Demo: [https://education-ecru.vercel.app](https://education-ecru.vercel.app)

----

## Features

### Frontend Features
- Modern, clean UI with soft, pleasing colors suitable for learning
- Light/dark mode toggle with localStorage persistence
- Fully responsive design for desktop, tablet, and mobile
- Search functionality for programming languages
- Language cards with details and links to learning pages
- Educational comparison guides for choosing languages
- Semantic HTML and accessible design

### Backend API Features
- Secure authentication using JWT tokens
- User registration and login management
- Password reset workflows with email notifications
- Protected routes for authorized access
- Admin dashboard and controls
- Database migrations with Alembic
- Email service integration
- Newsletter subscription management
- Contact form handling

----

## Frontend Setup

### How to Use

1. Open `index.html` in any modern web browser
2. Use the search bar to find specific languages
3. Click on language cards to navigate to learning pages
4. Toggle between light and dark mode using the moon/sun icon
5. On mobile, use the hamburger menu for navigation

----

## Backend API Setup

Follow the steps below to set up and run the API locally:

### 1. Clone the Repository
Clone the project to your local machine:
```bash
git clone https://github.com/Antech-greyhat/Education.git
cd Education/api
```

### 2. Create a Virtual Environment (Recommended)
```bash
python -m venv venv
source venv/bin/activate   # On Linux/Mac
venv\Scripts\activate      # On Windows
```

### 3. Create a .env File
Copy the provided `.env.example` file and rename it to `.env`:
```bash
cp .env.example .env
```
Fill in all required environment variables inside the `.env` file.

### 4. Configure Email App Password
Generate an App Password from your email provider (e.g., Gmail) for secure email forwarding. Add the generated app password and email credentials to the `.env` file.

### 5. Install Dependencies
Install all required packages:
```bash
pip install -r requirements.txt
```

If the above command fails, install the required packages manually:
```bash
pip install flask flask-restx flask-sqlalchemy flask-mail flask-jwt-extended flask-migrate flask-cors email-validator python-dotenv sqlalchemy
```

### 6. Run the Application
Start the server by running the main file:
```bash
python main.py
```

Once the server is running, the application will be accessible at the configured host and port.

----

## Project Structure

```
Education/
├── api/                    # Backend API
│   ├── app/               # Application modules
│   │   ├── auth/         # Authentication endpoints
│   │   ├── templates/    # Email templates
│   │   └── ...
│   ├── migrations/        # Database migrations
│   └── main.py           # API entry point
│
└── frontend/              # Frontend website
    ├── scripts/          # JavaScript modules
    ├── styles/           # CSS stylesheets
    └── *.html            # HTML pages
```

----

Made with ♥ by BraveraTech. All rights reserved.

