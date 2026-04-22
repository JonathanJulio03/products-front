# Product Management System (Angular 19)

This project is an advanced product management application built with **Angular 19**, following **Clean Architecture** principles and utilizing **Signals** for high-performance, reactive state management.

## Key Features

* **Clean Architecture**: Strict separation of concerns across layers (Domain, Infrastructure, and Application).
* **Signals State Management**: Lightweight and reactive state handling without the overhead of heavy external libraries.
* **Global Error Interceptor**: Centralized middleware to capture HTTP exceptions and notify the user via `MatSnackBar`.
* **Weather Integration**: Real-time widget consuming an external weather API to provide contextual information.
* **Professional UI**: A polished interface built with Angular Material components and optimized SCSS.

---

## Project Structure

The project follows a hexagonal/clean architecture pattern:

* **Domain**: Contains Models, Ports (Repository Interfaces), and Use Cases.
* **Infrastructure**: HTTP Adapters, Interceptors, and environment configurations.
* **Presentation**: UI Components, Pages, and shared widgets (Menu, Forms).

---

## Environment Configuration

The project uses Angular's **File Replacement** strategy to manage different execution environments.

* **Development**: Located in `src/environments/environment.ts` (Points to `localhost:8080`).
* **Production**: Located in `src/environments/environment.prod.ts` (Points to the live production API).

---

## Getting Started

### To run locally:

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Start the server:**
    ```bash
    npm start
    ```

## Note

To search for the city, it’s in the upper right corner—just click and press Enter.
Default London, Ex: Houston