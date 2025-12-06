# AnonQ - Anonymous Q&A Platform

AnonQ is a simple, elegant web application where visitors can ask anonymous questions and the owner can answer them publicly.

## Features

- **Anonymous Question Submission**: Users can ask questions without revealing their identity
- **Admin Dashboard**: Secure interface for viewing and answering questions  
- **Grammar Correction**: AI-powered message regeneration (optional)
- **Real-time Updates**: Questions and answers appear in real-time
- **Rate Limiting**: Built-in protection against spam and brute force attacks
- **Notifications**: ntfy integration for new question alerts
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark Theme**: Modern dark interface using shadcn/ui components

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Build the project**:
   ```bash
   npm run build
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Access the application**:
   - Main page: http://localhost:3001
   - Admin login: http://localhost:3001/admin (password: admin123)

## URLs

- **Public Q&A Page**: `/` - Submit questions and view answered questions
- **Admin Login**: `/admin` - Secure login for administrators  
- **Admin Dashboard**: `/admin/dashboard` - Manage and answer questions

## API Endpoints

### Public Endpoints
- `POST /api/questions` - Submit a new question
- `GET /api/questions/qa` - Get all answered Q&A pairs
- `POST /api/questions/regenerate` - AI-powered grammar correction

### Admin Endpoints  
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/questions` - Get unanswered questions
- `POST /api/admin/answer` - Post an answer to a question

## Configuration

Environment variables in `.env`:

```env
PORT=3001
ADMIN_PASSWORD_HASH=$2b$10$I8iiehLuypHdq9Y9nuR6SOm1XEbheebNn.jRhcQLGopf9x8IOBW8S
NTFY_URL=https://ntfy.sh/your-topic (optional)
OPENAI_API_KEY=your_openai_api_key_here (optional)
```

## Default Credentials

- **Admin Password**: `admin123`

## Security Features

- Rate limiting (100 requests/15min for public, 5 login attempts/15min for admin)
- No IP logging or browser fingerprinting
- Secure password hashing with bcrypt
- Input validation and sanitization
- Session-based admin authentication

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: Vanilla HTML/CSS/JavaScript with Tailwind CSS
- **UI**: shadcn/ui components (new-york style, zinc theme)
- **Security**: bcryptjs, express-rate-limit

The application is fully functional and ready for use!