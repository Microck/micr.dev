# AnonQ - Anonymous Q&A Platform

A simple, elegant web application where visitors can ask anonymous questions and the owner can answer them publicly.

## Features

- **Anonymous Question Submission**: Users can ask questions without revealing their identity
- **Admin Dashboard**: Secure interface for viewing and answering questions
- **Grammar Correction**: AI-powered message regeneration (optional)
- **Real-time Updates**: Questions and answers appear in real-time
- **Rate Limiting**: Built-in protection against spam and brute force attacks
- **Notifications**: ntfy integration for new question alerts
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark Theme**: Modern dark interface using shadcn/ui components

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: Vanilla HTML/CSS/JavaScript with Tailwind CSS
- **UI Components**: shadcn/ui (new-york style, zinc color scheme)
- **Security**: bcryptjs for password hashing, express-rate-limit for protection
- **Notifications**: ntfy.sh integration
- **AI Integration**: OpenAI API for grammar correction (optional)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the anonq folder:
```bash
cd anonq
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
PORT=3001
ADMIN_PASSWORD_HASH=$2a$10$your_hashed_password_here
NTFY_URL=https://ntfy.sh/your-topic (optional)
OPENAI_API_KEY=your_openai_api_key_here (optional)
```

### Setting Up Admin Password

Generate a bcrypt hash for your admin password:

```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your_password', 10));"
```

Replace `your_password` with your desired admin password and copy the output to your `.env` file.

### Running the Application

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

3. Open your browser and navigate to:
   - `http://localhost:3001` - Public Q&A page
   - `http://localhost:3001/admin` - Admin login

## Usage

### For Visitors
1. Visit the main page
2. Type your question in the text area
3. Click "Send Question" to submit
4. Use "Regenerate Message" to correct grammar/spelling
5. Browse answered questions below

### For Admins
1. Navigate to `/admin`
2. Enter your password
3. View unanswered questions in the dashboard
4. Click on a question to select it
5. Write your answer and click "Post Answer Publicly"
6. Answers appear immediately on the main page

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 3001) | No |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of admin password | Yes |
| `NTFY_URL` | ntfy.sh URL for notifications | No |
| `OPENAI_API_KEY` | OpenAI API key for grammar correction | No |

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes for public endpoints
- **Admin Rate Limiting**: 5 login attempts per 15 minutes
- **No IP Logging**: Questions are stored without IP addresses
- **No Browser Fingerprinting**: No tracking mechanisms implemented
- **Secure Password Hashing**: bcrypt with salt rounds of 10
- **Input Validation**: All inputs are validated and sanitized

## Deployment

The application can be deployed to any Node.js hosting service:

### Netlify (with Functions)
1. Build the application locally
2. Deploy the `dist` folder and `public` folder
3. Set environment variables in Netlify dashboard
4. Configure redirects for API routes

### Traditional VPS
1. Install Node.js on your server
2. Clone the repository
3. Install dependencies and build
4. Use PM2 or similar process manager
5. Set up nginx as reverse proxy (optional)

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please use the GitHub issue tracker.