# User Management System - Frontend (React)

This is the client-side application for the User Management System, built with **React** and powered by **Vite** for an optimized development experience.

##  Tech Stack
* **Framework:** React 18+
* **Build Tool:** Vite
* **HTTP Client:** Axios (for REST API communication)
* **Routing:** React Router DOM
* **Styling:** CSS3 / Tailwind CSS (Optional: mention if used)
* **Code Quality:** ESLint & Prettier

##  Key Features & Architecture
* **SPA (Single Page Application):** Provides a seamless, fast-loading user experience.
* **Component-Based Design:** Modular components (Forms, Tables, Navigation) for better maintainability.
* **Server-side Pagination Support:** Integrated with the Backend's `Pageable` API to handle data in chunks.
* **State Management:** Utilizes modern React Hooks (`useState`, `useEffect`, `useCallback`) for efficient state handling and performance optimization.
* **Form Validation:** Client-side validation for mandatory fields and data formats (e.g., Birthdate via Datepicker).



##  API Integration
Communication with the Spring Boot Backend is centralized in the `services/userApi.js` module.
* **Axios Instance:** Configured with a base URL and custom interceptors if needed.
* **Error Handling:** Centralized catch blocks to handle API errors and provide user feedback.
* **CORS Compatibility:** Works in tandem with the Backend's CORS policy.

##  Installation & Setup
1. **Prerequisites:** Ensure you have **Node.js** installed.
2. **Install Dependencies:**
   ```bash
   npm install
