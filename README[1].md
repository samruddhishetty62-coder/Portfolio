# Samruddhi Shetty — Full-Stack Portfolio

A responsive personal portfolio built with HTML, CSS and JavaScript on the frontend, Node.js/Express on the backend, and MongoDB for project and contact-message storage.

## Included
- Responsive portfolio with About, Skills, Projects, Education/Experience and Contact sections
- Projects are loaded from MongoDB through `GET /api/projects`
- Contact form saves messages through `POST /api/messages`
- Health endpoint: `GET /api/health`

## Run locally
1. Install Node.js 18 or later.
2. Open this folder in VS Code.
3. Open a terminal in this folder and run:
   ```bash
   npm install
   ```
4. Create a file named `.env` by copying `.env.example`.
5. Create a free MongoDB Atlas database and replace `MONGODB_URI` in `.env` with your connection string. In Atlas, create a database user and allow network access for your deployment (for a student demo, Atlas' network access instructions explain the options).
6. Start the website:
   ```bash
   npm start
   ```
7. Open `http://localhost:3000`.

Without `MONGODB_URI`, the portfolio page still opens, but database-backed project loading and message saving will not work.

## Publish it online (Render)
This project is configured as one Node web service, so the frontend and backend use the same public URL.

1. Create a GitHub repository and upload all files in this folder (do not upload `.env` or `node_modules`).
2. Create a MongoDB Atlas database and copy its connection string.
3. Sign in to Render and choose **New → Web Service**. Connect your GitHub repository.
4. Use these settings:
   - Runtime: Node
   - Build command: `npm install`
   - Start command: `npm start`
5. In Render's Environment settings, add:
   - Key: `MONGODB_URI`
   - Value: your MongoDB Atlas connection string
6. Deploy. Render will provide a public URL ending in `onrender.com`. Open that URL and test the contact form.
7. Submit that public Render URL as your project link.

## Before submitting
- Confirm the public page opens on a phone and laptop.
- Test the navigation links.
- Submit a test contact message and check the Render logs / MongoDB collection.
- Replace or update any skills, college details, or project descriptions so they exactly match your real work.
- Do not share your `.env` file or database password.

## Important
The source project is ready, but it is not hosted by this package. A live public URL is created only after you deploy it to a hosting provider such as Render and connect MongoDB.
