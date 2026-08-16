# 🌾 Agri Sathi Hub

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Socket.IO-Real--Time-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO" />
</p>

<p align="center">
  <strong>A modern agricultural service platform connecting farmers with local agricultural resources, workers, machinery and services.</strong>
</p>

<p align="center">
  <a href="https://github.com/Rohit3920/Agri-sathi-hub__client">Frontend Repository</a>
  •
  <a href="https://github.com/Rohit3920/Agri-sathi-hub_server">Backend Repository</a>
</p>

---

## 📖 About The Project

**Agri Sathi Hub** is a full-stack web application designed to help farmers easily discover and access agricultural services in their local area.

The platform focuses on connecting farmers with useful agricultural resources such as:

* 👷 Agricultural workers and labor
* 🚜 Farming machinery and equipment
* 📍 Local agricultural services
* 🌱 Crop-related information
* 🌦️ Weather and environmental information
* 💬 Communication between users
* 🏪 Agricultural marketplace and service opportunities

The goal of the project is to provide a centralized digital platform that makes agricultural services easier to discover, access and manage.

---

## 🎯 Problem Statement

Farmers often depend on local contacts and traditional methods to find agricultural workers, machinery and other farming-related services.

This can make it difficult to:

* Find available workers quickly
* Locate suitable agricultural machinery
* Discover nearby services
* Communicate with service providers
* Access useful agricultural information
* Compare available services

**Agri Sathi Hub** aims to solve these problems by bringing these services together in one easy-to-use web platform.

---

## ✨ Key Features

### 👨‍🌾 Farmer Services

* Farmer-focused dashboard
* Agricultural service discovery
* Local service exploration
* Worker/labor requirements
* Machinery rental services
* Service provider interaction

### 👷 Labor Hiring

* Find agricultural workers
* View worker/service information
* Connect farmers with available labor
* Manage service requirements

### 🚜 Machinery Rental

* Browse agricultural machinery
* View available equipment
* Find machinery based on requirements
* Connect farmers with machinery providers

### 📍 Location-Based Services

* Explore agricultural services based on location
* Map-based service discovery
* Location-aware agricultural resources

### 🌱 Agricultural Information

* Crop-related information
* Agricultural recommendations
* Useful farming resources
* Weather-related information

### 💬 Communication

* Real-time communication using Socket.IO
* User interaction
* Service-related communication

### 🌐 Multi-Language Support

The frontend includes internationalization support using:

* i18next
* react-i18next

This allows the application to support multiple languages and makes the platform more accessible to different users.

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript (ES6+)
* Vite
* Tailwind CSS
* React Router
* Axios

### UI & Animation

* Framer Motion
* GSAP
* Lucide React
* SweetAlert2
* React Toastify

### Maps & Location

* React Leaflet
* Leaflet

### Real-Time Communication

* Socket.IO Client

### Internationalization

* i18next
* react-i18next

### Storage / Backend Services

* Supabase

### Backend

* Node.js
* Express.js
* Socket.IO
* REST APIs

> Update the backend list if your server repository uses additional technologies.

---

## 🏗️ Project Architecture

```text
Agri Sathi Hub
│
├── Frontend
│   ├── React.js
│   ├── Vite
│   ├── Tailwind CSS
│   ├── React Router
│   ├── Axios
│   ├── React Leaflet
│   └── Socket.IO Client
│
└── Backend
    ├── Node.js
    ├── Express.js
    ├── REST APIs
    ├── Socket.IO
    └── Database
```

---

## 📂 Frontend Repository Structure

```text
Agri-sathi-hub__client/
│
├── public/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── assets/
│   ├── hooks/
│   ├── services/
│   └── ...
│
├── .env
├── .gitignore
├── package.json
├── vite.config.js
├── eslint.config.js
├── tailwind.config.cjs
└── README.md
```

> Adjust the `src` structure above to exactly match your current folders if some of these directories have different names.

---

## 🚀 Getting Started

### 1. Clone the Frontend Repository

```bash
git clone https://github.com/Rohit3920/Agri-sathi-hub__client.git
```

### 2. Navigate to the Project

```bash
cd Agri-sathi-hub__client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root.

Example:

```env
VITE_API_URL=your_backend_api_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Never commit private API keys, passwords or secret credentials to GitHub.

### 5. Start Development Server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

---

## 🔗 Project Repositories

### Frontend

[Agri Sathi Hub — Client](https://github.com/Rohit3920/Agri-sathi-hub__client)

### Backend

[Agri Sathi Hub — Server](https://github.com/Rohit3920/Agri-sathi-hub_server)

> Make sure the backend repository is public and the repository name is exactly correct before publishing this link.

---

## 🌐 Live Demo

### Frontend

**Add your deployed frontend URL here**

```text
https://your-agri-sathi-hub-frontend-url.com
```

### Backend API

**Add your deployed backend API URL here**

```text
https://your-agri-sathi-hub-backend-url.com
```

---

## 📸 Screenshots

Add screenshots of your main application pages here.

### 🏠 Home Page

```text
Add Home Page Screenshot
```

### 👨‍🌾 Farmer Dashboard

```text
Add Farmer Dashboard Screenshot
```

### 🚜 Machinery Services

```text
Add Machinery Screenshot
```

### 👷 Labor Services

```text
Add Labor Screenshot
```

### 🗺️ Location-Based Services

```text
Add Map Screenshot
```

---

## 🔐 Security & Environment Variables

This project uses environment variables for configuration.

Sensitive information should be stored inside `.env` files and should **never be committed to GitHub**.

Recommended `.gitignore`:

```gitignore
node_modules/
dist/
.env
.env.local
.env.production
```

---

## 📈 Future Enhancements

Some possible future improvements include:

* 🤖 AI-powered crop recommendations
* 🌦️ Advanced weather forecasting
* 📱 Progressive Web App / mobile support
* 💳 Online payment integration
* ⭐ Service provider ratings and reviews
* 🔔 Push notifications
* 📊 Farmer analytics dashboard
* 🛒 Agricultural product marketplace
* 🗣️ Voice-based agricultural assistance
* 🌐 Additional regional languages

---

## 👨‍💻 Developer

### Rohit Nittawadekar

**B.Tech Computer Science and Engineering — 2026**

React.js & MERN Stack Developer | Java & Spring Boot Developer

* GitHub: https://github.com/Rohit3920
* LinkedIn: https://www.linkedin.com/in/rohit-nittawadekar-922984265/
* Portfolio: https://rohit3920.github.io/my-portfolio-2.O/
* Email: [rohitnittawadekar07@gmail.com](mailto:rohitnittawadekar07@gmail.com)

---

## ⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.

Your feedback and suggestions are welcome!

---

## 📄 License

This project is developed for educational and project purposes.
