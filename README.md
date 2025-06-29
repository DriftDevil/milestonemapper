# Milestone Mapper

Welcome to Milestone Mapper, a web application designed to help you track your travels and adventures across the globe. From countries and U.S. states to national parks and sports stadiums, visualize your journey and plan your next destination.

## Features

-   **Interactive Maps**: Visualize your visited locations on beautiful, interactive maps for each category.
-   **Comprehensive Tracking**:
    -   Countries of the World
    -   U.S. States & Territories
    -   U.S. National Parks
    -   MLB Ballparks
    -   NFL Stadiums
-   **User Authentication**: Secure user accounts with password-based login.
-   **Profile Management**: View your user profile and change your password.
-   **Light & Dark Mode**: A sleek interface that adapts to your preferred theme.
-   **Responsive Design**: A seamless experience across desktop and mobile devices.

## Tech Stack

This project is built with a modern web stack, including:

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI**: [React](https://reactjs.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
-   **Authentication**: Custom cookie-based authentication forwarding to a backend service.
-   **Generative AI**: [Google Genkit](https://firebase.google.com/docs/genkit) (for potential future AI features)
-   **Containerization**: [Docker](https://www.docker.com/)

## Getting Started

This project is designed to be run with Docker and Docker Compose.

### Prerequisites

*   Docker
*   Docker Compose

### Setup

1.  **Set Environment Variables**:
    Create a `.env` file in the root of the project. At a minimum, you must provide the base URL for the external backend API:
    ```
    EXTERNAL_API_BASE_URL=http://your-backend-api-url.com
    ```

2.  **Run with Docker Compose**:
    From the root of the project, run the following command to build and start the application in the background:
    ```bash
    docker compose up -d --build
    ```

3.  **Accessing the Application**:
    The application is configured to be served by a Traefik reverse proxy at `https://milestonemapper.huangtechhub.dev`. You will need to have your local environment configured to resolve this domain to your Docker host.

    To stop the application, run:
    ```bash
    docker compose down
    ```
