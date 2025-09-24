
# **Leuma**  
Scalable E‑commerce Web App built with **React + Vite + Tailwind CSS** &nbsp;|&nbsp; Container‑ready with **Docker**

[![Build](https://img.shields.io/github/actions/workflow/status/Root-acess/leuma/ci.yml?label=CI)](../../actions)  
[![License](https://img.shields.io/github/license/Root-acess/leuma)](LICENSE)  
[![Docker Image Size](https://img.shields.io/docker/image-size/charon/leuma?label=image%20size)](https://hub.docker.com/r/charon/leuma)

---

## ✨ Features

- **⚡️ Vite** – lightning‑fast dev server & HMR  
- **⚛️ React 18** – modern component model  
- **💨 Tailwind CSS** – utility‑first styling  
- **🌊 Dockerized** – one small, production‑grade container (`~80 MB`)  
- **🔒 Zero‑config SSL‑ready** (when run behind a reverse proxy)  
- **📦 Ready for CI/CD** – build & publish image in a single command

---

## 📂 Project Structure

```
leuma/
├─ src/               # React code
├─ public/            # Static assets
├─ Dockerfile         # Multi‑stage build (explained below)
├─ .dockerignore
├─ vite.config.js
└─ package.json
```

---

## 🚀 Quick Start

### 1. Clone & install

```bash
git clone https://github.com/Root-acess/leuma.git
cd leuma
npm install
```

### 2. Run in development mode

```bash
npm run dev           # → http://localhost:5173
```

---

## 🐳 Running with Docker

### Why Docker?

Shipping the same container image everywhere (laptop, CI runner, cloud VM, K8s cluster) eliminates **“works‑on‑my‑machine”** bugs and shrinks deploy time to seconds.

### Dockerfile explained

| Stage           | What happens                                                                 | Result                                   |
| --------------- | ---------------------------------------------------------------------------- | ---------------------------------------- |
| **0 → builder** | `FROM node:18-alpine`<br>`npm ci`, `npm run build`                           | Produces static `dist/` bundle           |
| **1 → runner**  | `FROM node:18-alpine` (clean slate)<br>`npm i -g serve`<br>copy only `dist/` | 80 MB container that simply serves files |
| **CMD**         | `serve -s dist -l 3000`                                                      | Production server                        |

### Build & run locally

```bash
docker build -t leuma:latest .
docker run -p 3000:3000 leuma:latest
# → http://localhost:3000
```

### Hot‑reload development with Docker Compose

```yaml
version: "3.8"
services:
  app:
    build: .
    command: npm run dev
    ports: [ "5173:5173" ]
    volumes:
      - .:/app            # live code
      - /app/node_modules # keep host deps out
```

```bash
docker compose up
```

---

## 🌐 Deploying

1. **Push the image**

   ```bash
   docker tag leuma charon/leuma:latest
   docker push charon/leuma:latest
   ```
2. **Run on a server**

   ```bash
   docker run -d --name leuma \
     -p 80:3000 \
     --restart=unless-stopped \
     charon/leuma:latest
   ```

*Need SSL?*  
Put Nginx or Caddy in front, or deploy the image to any PaaS that provides HTTPS (Render, Railway, Fly.io, ECS + ALB, etc.).

---

## 🛠 Scripts

| Command                   | What it does                       |
| ------------------------- | ---------------------------------- |
| `npm run dev`             | Start Vite dev server with HMR     |
| `npm run build`           | Build production bundle to `dist/` |
| `npm run preview`         | Locally preview the prod build     |
| `docker build -t leuma .` | Create production Docker image     |
| `docker compose up`       | Dev container with hot reload      |

---

## 🤝 Contributing

1. Fork ➜ create feature branch ➜ commit ➜ open PR
2. Run `npm run lint` & make sure CI passes
3. Describe your change clearly – *docs welcome!*

---

# 🚀 CI/CD Pipeline with Jenkins & Vercel

This project demonstrates a **Dockerized full-stack application** with a complete **CI/CD pipeline** powered by **Jenkins**.  
The pipeline automates build, test, and deployment workflows, with seamless deployments to **Vercel** and rollback capability.

---

## 🔥 Features
- 🐳 **Dockerized Full-Stack App** (Frontend + Backend)
- ⚙️ **Automated CI/CD** pipeline using **Jenkins**
- 🌐 **Continuous Deployment** to **Vercel**
- 🔄 **Rollback support** to previous stable releases
- ✅ Automated build & test workflow

---

## 🏗️ Tech Stack
- **Frontend:** React / Next.js  
- **Backend:** Node.js / Express (example setup)  
- **Containerization:** Docker  
- **CI/CD:** Jenkins  
- **Hosting / Deployment:** Vercel  

---

## ⚙️ CI/CD Workflow (Jenkins)
1. **Code Push to GitHub**  
   - Developers commit & push changes to the repository.  

2. **Jenkins Pipeline Triggered**  
   - Jenkins listens for GitHub webhook events.  
   - Pipeline stages:  
     - 🔹 **Build**: Docker image build for frontend & backend  
     - 🔹 **Test**: Run unit/integration tests  
     - 🔹 **Package**: Create Docker artifacts  

3. **Deployment to Vercel**  
   - Jenkins pushes the latest build to **Vercel**.  
   - Automatic environment configuration applied.  

4. **Rollback Mechanism**  
   - If deployment fails, Jenkins can rollback to the **last stable version** on Vercel.  

---

## 📂 Project Structure

root/
│── frontend/ # React or Next.js app
│── backend/ # Node.js/Express API
│── Jenkinsfile # Pipeline definition
│── Dockerfile # Docker configuration
│── docker-compose.yml


---

## 🚀 Getting Started

### Prerequisites
- Docker installed  
- Jenkins server set up & running  
- Vercel account  

### Setup
1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo

    Build Docker containers

docker-compose up --build

Configure Jenkins Pipeline

    Add your repository to Jenkins

    Use the provided Jenkinsfile for pipeline definition

    Add environment variables (Vercel token, secrets)

Deploy

    On successful pipeline run, the app will auto-deploy to Vercel.

## 📄 License

Distributed under the MIT License. See **LICENSE** for details.

---

<h4 align="center">Made with 💙 by Hiralal Singh · Built for scale · Enjoy shipping!</h4>
