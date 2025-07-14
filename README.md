<div align="center">
  <h1 align="center">
    HorariU
  </h1>
</div>

<p align="center">
  <a href="https://github.com/gqbo/Horariu/actions/workflows/deploy-api.yml">
    <img src="https://github.com/gqbo/Horariu/actions/workflows/deploy-api.yml/badge.svg" alt="Deploy API" />
  </a>
  <a href="https://github.com/UCR-Projects/Horariu/actions/workflows/deploy-client.yml">
    <img src="https://github.com/UCR-Projects/Horariu/actions/workflows/deploy-client.yml/badge.svg" alt="Deploy Client" />
  </a>
</p>

<p align="center">
  <a href="https://deepwiki.com/UCR-Projects/Horariu">
    <img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki" />
  </a>
</p>

## Introduction

Horariu is a university schedule generator that creates all possible timetable combinations for a given semester, allowing students to explore different options and choose their preferred schedule. This helps in planning efficiently before course registration.

## 💡 Features

- Add courses
- Add multiple groups for each course
- Add multiple time intervals for each group
- Download schedules as images or PDFs
- English and Spanish support
- Light and dark mode
- Mobile compatibility
- Schedule pagination
- Hide courses to exclude them from generation
- Hide specific groups to exclude them from generation
- Edit courses and groups

## 🛠️ Technologies Used

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Cloud & Deployment:** AWS, Github Actions

## 🚀 Installation & Running

### Backend

1. **Requirements:**  
   - Node.js (v18+ recommended)
   - AWS CLI
   - AWS SAM CLI
   - Access to AWS SSM parameters for database and environment config

2. **Install dependencies:**
   ```sh
   cd backend
   npm install
   ```

3. **Build and deploy to AWS (Dev by default):**
   ```sh
   ./deploy.sh
   ```
   - For production:  
     ```sh
     ./deploy.sh Prod
     ```
   - This script builds the project, fetches environment variables from AWS SSM, and deploys using AWS SAM.

---

### Frontend

1. **Requirements:**  
   - Node.js (v18+ recommended)
   - npm

2. **Install dependencies:**
   ```sh
   cd frontend
   npm install
   ```

3. **Run the development server:**
   ```sh
   npm run dev
   ```
   - The app will be available at `http://localhost:5173` by default.

---

## 🤝 Contributing

We welcome contributions to HorariU! Whether you're fixing bugs, adding new features, or improving documentation, your help is appreciated.

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```sh
   git clone https://github.com/UCR-Projects/Horariu.git
   cd Horariu
   ```
3. **Create a new branch** for your feature or bugfix:
   ```sh
   git checkout -b feature/your-feature-name
   ```
4. **Set up the development environment** following the installation instructions above
5. **Make your changes** and test them thoroughly
6. **Commit your changes** with clear, descriptive messages using Conventional Commits Format:
   ```sh
   git commit -m "feat: allow provided config object to extend other configs"
   ```
7. **Push to your fork**:
   ```sh
   git push origin feature/your-feature-name
   ```
8. **Create a Pull Request** on GitHub with a clear description of your changes

### What Can You Contribute?

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🌐 Translations
- 🎨 UI/UX improvements
- ⚡ Performance optimizations

### Guidelines

- Follow the existing code style and conventions
- Write clear commit messages
- Test your changes before submitting
- Update documentation when necessary
- Be respectful and constructive in discussions

For more detailed information about contributing, please see our [CONTRIBUTING.md](CONTRIBUTING.md) file.

## 📄 License

This project is licensed under the terms of the [LICENSE](LICENSE) file. Please see the LICENSE file for more details about permissions and limitations.

---
