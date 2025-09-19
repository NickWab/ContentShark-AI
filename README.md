🦈 Content Shark AI

An AI-powered SaaS platform designed to automate and supercharge content marketing workflows.

Content Shark AI is a comprehensive, full-stack application built to showcase modern software development practices. It leverages the power of Large Language Models (LLMs) via Spring AI to assist content creators with brainstorming, drafting, and repurposing their work across multiple platforms.
✨ Key Features

    AI-Powered Idea Generation: Enter a topic or a theme and let the AI brainstorm a list of engaging content ideas, titles, and angles.

    Automated Content Drafting: Select an idea and have the AI generate a full-length draft of an article or blog post.

    Multi-Platform Repurposing: Instantly transform a finished article into a series of tweets, a LinkedIn post, and an email newsletter.

    User & Project Management: (Backend In-Progress) A secure system for user authentication and project organization.

    Event-Driven Architecture: (Backend In-Progress) Built with Apache Kafka to ensure a scalable and resilient system that can handle complex, asynchronous AI workflows.

🛠️ Tech Stack

This project is a polyglot microservices application, demonstrating a wide range of modern technologies.

    Frontend:

        React (with Vite)

        Tailwind CSS for styling

    Backend (In-Progress):

        Spring Boot 3 & Java 17

        Spring AI for LLM integration (Google Gemini)

        Spring Cloud Gateway for routing

        Spring Security for authentication/authorization

    Messaging:

        Apache Kafka for asynchronous, event-driven communication

    DevOps & Deployment (Planned):

        Docker & Docker Compose for containerization

        CI/CD pipeline using GitHub Actions

        Deployment to a cloud provider (e.g., AWS, GCP) using Kubernetes

🏁 Getting Started (Frontend)

To get the frontend of the application running on your local machine, please follow these steps.

    Clone the repository:

    git clone [https://github.com/](https://github.com/)<Your-GitHub-Username>/contentshark-ai.git

    Navigate to the project directory:

    cd contentshark-ai

    Install the dependencies:

    npm install

    Run the development server:

    npm run dev

    Open your browser and navigate to http://localhost:5173.

📝 Project Status

Currently, the frontend is operational with live calls to the Gemini API. The backend microservices and event-driven architecture are under active development. This project is being built as a portfolio piece to demonstrate a comprehensive understanding of full-stack, AI-integrated software development.