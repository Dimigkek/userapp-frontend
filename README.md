# User Management System - Frontend (React)

This is the client-side application for the User Management System, built with **React** and powered by **Vite** for an optimized development experience.

## Tech Stack
* **Framework:** React 18+
* **Build Tool:** Vite
* **HTTP Client:** Axios (centralized API communication)
* **Routing:** React Router DOM (v6+)
* **Styling:** CSS3 with a focus on modern, dark-themed UI components.
* **Code Quality:** ESLint & Prettier

## Key Features & Architecture
* **SPA (Single Page Application):** Seamless navigation without page reloads.
* **Task Management Dashboard:** * **Dynamic Task Details:** Dedicated view for tracking task descriptions and statuses.
    * **Status State Machine:** Visual toggles for `OPEN`, `ONGOING`, and `COMPLETED` states.
    * **Assignee Management:** Ability to assign multiple users to specific tasks.
* **Component-Based Design:** Modular structure (Cards, Pagination, Forms) for high maintainability.
* **Smart Pagination:** Integrated with the Backend's `Pageable` API for efficient data fetching.
* **State Management:** Uses React Hooks (`useState`, `useEffect`, `useCallback`) for performance optimization and stable data flow.



## API Integration
All communication with the Spring Boot Backend is centralized in the `src/api/` modules:
* **userApi.js:** Handles user profiles, address management, and search.
* **taskApi.js:** Manages task creation, status updates, user assignments, and deletion.
* **Axios Instance:** Pre-configured base URL with standardized error handling and request interception.


##  Installation & Setup
1. **Prerequisites:** Ensure you have **Node.js** installed.
2. **Install Dependencies:**
   ```bash
   npm install


##  Environment Configuration: 
* **Ensure the Backend is running at http://localhost:8080


##  Run Development Server:
* **npm run dev****

##  Build for Production:
* **npm run build
