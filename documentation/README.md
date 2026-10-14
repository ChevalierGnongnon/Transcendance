# ft_transcendence

*This project has been created as part of the 42 curriculum by choflack, oklimov, nmagomad, mknoll.*

## Description 
**ft_transcendence** is a desktop-based messaging and social networking application inspired by modern mobile messenger apps. The project extends the core messaging experience with additional social, AI, gaming, and analytics features.
The main goal was to create a central platform where users can communicate with each other, interact through social network features, use an integrated Google Gemini chatbot, and play multiplayer games directly within chats.
Key Features
- Real-time messaging between users
- Social networking features for user interaction
- Multiplayer games integrated into chats
- AI chatbot powered by Google Gemini
- Analytics dashboards for monitoring AI usage and viewing detailed game history

The project combines these features into a single application, with the goal of providing a more interactive experience than a traditional messaging platform.

## Instructions

### Prerequisites

The project runs entirely using Docker. Before starting the application, make sure the following is installed and available:

* **Docker Engine**
* **Docker Compose**

Make sure the **Docker Engine is running** before starting the project.

### Installation & Execution

Clone the repository and navigate into the project directory:

```bash
git clone <repository-url>
cd ft_transcendence
```

Start the application using the provided Makefile:

```bash
make
```

Once the containers have been built and started, the application is available at:

```text
https://localhost:8443
```

Open the URL in your browser to access the application.

### Configuration

The application is configured through Docker and the project's environment configuration. If required, create and configure the `.env` file before running `make`.

All required environment variables and their purpose are documented in the project's `.env.example` file.


## Resources 
- https://expressjs.com/en/5x/guide/error-handling/?utm_source=chatgpt.com
- https://ai.google.dev/gemini-api/docs/rate-limits?hl=en&utm_source=chatgpt.com

## Team Information

| Team Member | Role(s)                    | Responsibilities                                                                                                                                  |
| ----------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Choflack**  | Product Owner, Developer   | Responsible for defining the project requirements, coordinating the team's priorities, and contributing to the implementation of the application. |
| **oklimov**  | Project Manager, Developer | Responsible for coordinating the development process, organizing tasks and milestones, and contributing to the implementation of the project.     |
| **nmagomad**  | Tech Lead, Developer       | Responsible for the overall technical architecture, technology decisions, code quality, and implementation of core features.                      |
| **mknoll**  | Developer                  | Responsible for implementing and maintaining assigned features, fixing bugs, and contributing to the overall development of the application.      |


## Project Management 

The team organized the project through a combination of regular meetings and continuous communication.

* **Weekly status meeting:** The team held one status meeting per week to discuss the current progress, review completed tasks, identify problems, and plan the next steps.
* **Task distribution:** Tasks were discussed and distributed among the team members based on the current project priorities and individual responsibilities.
* **Communication:** **Slack** was used for project communication and coordination, while **WhatsApp** was used for more informal and quick communication.


## Technical Stack 

### Frontend

The frontend is built with **React** and **TypeScript**, using **Vite** as the development and build tool.

* **React** – Component-based frontend architecture and UI development
* **TypeScript** – Static typing and improved maintainability
* **Vite** – Frontend development and build tooling
* **React Router** – Client-side routing
* **Bootstrap / Sass** – Styling and responsive UI
* **Socket.IO Client** – Real-time communication with the backend
* **Recharts** – Data visualization for analytics dashboards
* **i18next** – Internationalization and multilingual support

### Backend

The backend is built with **Node.js**, **Express**, and **TypeScript**.

* **Node.js** – Server-side JavaScript runtime
* **Express** – HTTP server and REST API
* **TypeScript** – Type-safe backend development
* **Socket.IO** – Real-time communication for messaging, games, and live dashboard interactions
* **Prisma** – Database ORM and migration management
* **JWT** – Authentication
* **bcrypt** – Secure password hashing
* **Zod / express-validator** – Input validation
* **Helmet / CORS / express-rate-limit** – Security and request protection
* **Multer / Sharp** – File and image upload and processing
* **node-cron** – Scheduled backend tasks

### Database

The application uses **MariaDB** as its relational database, accessed through **Prisma**.

MariaDB was chosen because the team already had experience with **MariaDB/MySQL** and because the application's data model benefits from a relational database structure. The application contains many relationships between entities such as users, conversations, messages, and games, making a relational database a suitable choice.

**Prisma** was chosen because it provides strong TypeScript typing, simplifies database access, and provides convenient database migration management.

### Real-Time Communication

**Socket.IO** is used for bidirectional real-time communication between the frontend and backend.

It is used for features that require immediate updates, including **chat messages, multiplayer games, and live interactions within the analytics dashboards**.

### Artificial Intelligence

The application integrates **Google Gemini** through the `@google/genai` package. The AI functionality provides an integrated chatbot as an additional feature of the messaging platform.

### Containerization

The application is containerized using **Docker**.

Docker was chosen to provide a **consistent development and runtime environment** for the project and to simplify deployment. This allows the application's different components and their dependencies to be run in a controlled and reproducible environment.

## Database Schema 
- 

## Features List
- ## Features

The following table provides an overview of the implemented features, the team members responsible for their development, and a brief description of their functionality.

| Feature                              | Team Member(s) | Description                                                                              |
| ------------------------------------ | -------------- | ---------------------------------------------------------------------------------------- |
| **Authentication & User Management** | Name           | User registration, login, logout, password management, and account handling.             |
| **User Profiles**                    | Name           | Creation and management of user profiles and profile information.                        |
| **Messaging**                        | Name           | Real-time communication between users through individual or group conversations.         |
| **Social Features**                  | Name           | Social interactions between users, such as adding friends or managing connections.       |
| **AI Chatbot**                       | Name           | Integration of Google Gemini to provide an AI-powered chatbot within the application.    |
| **Multiplayer Game**                 | Name           | Real-time multiplayer gameplay integrated into the messaging platform.                   |
| **Game History**                     | Name           | Records and displays previous game results and statistics.                               |
| **Analytics Dashboard**              | Name           | Visualizes application data, including AI usage and game-related statistics.             |
| **File / Image Uploads**             | Name           | Allows users to upload and manage supported files or images.                             |
| **Internationalization**             | Name           | Provides support for multiple languages within the application.                          |
| **Notifications**                    | Name           | Provides users with notifications about relevant events and interactions.                |
| **Security**                         | Name           | Implements authentication, input validation, rate limiting, and other security measures. |                                                                        |

## Modules 

| Module            | Type  | Points | Team Member(s) | Brief Justification                                                |
| ----------------- | ----- | -----: | -------------- | ------------------------------------------------------------------ |
| **Module Name**   | Major |      2 | Name           | Short reason why this module was chosen.                           |
| **Module Name**   | Minor |      1 | Name           | Short reason why this module was chosen.                           |
| **Module Name**   | Major |      2 | Name           | Short reason why this module was chosen.                           |
| **Custom Module** | Major |      2 | Name           | Why this custom module was chosen and what it adds to the project. |

**Total: X points**


## Individual Contribution 

### Name 1

* **Role:** Role(s)
* **Contributions:** Short description of implemented features, modules, or components.
* **Challenges:** Short description of a relevant challenge and how it was solved.

### Name 2

* **Role:** Role(s)
* **Contributions:** Short description of implemented features, modules, or components.
* **Challenges:** Short description of a relevant challenge and how it was solved.

### Name 3

* **Role:** Role(s)
* **Contributions:** Short description of implemented features, modules, or components.
* **Challenges:** Short description of a relevant challenge and how it was solved.

### Name 4

* **Role:** Role(s)
* **Contributions:** Short description of implemented features, modules, or components.
* **Challenges:** Short description of a relevant challenge and how it was solved.
