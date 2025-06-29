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

## Getting Started

To run this project locally, you will need to set up a `.env` file with the necessary environment variables, primarily the base URL for the external backend API.

1.  **Set Environment Variables**:
    Create a `.env` file in the root of the project and add the URL of your backend authentication and data service:
    ```
    EXTERNAL_API_BASE_URL=http://your-backend-api-url.com
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
