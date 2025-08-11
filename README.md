# Todo App System

This is a complete system for a todo list application, developed as a technical challenge. It includes two backend services, a simple frontend, and a reverse proxy, all containerized and orchestrated with Docker Compose. The system is designed to demonstrate skills in authentication, API design, containerization, and inter-service communication[cite: 2, 3].

***

## 🚀 Getting Started

To run the system, you'll need **Docker** and **Docker Compose** installed.

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Shahzeb-99/aici-todo-challenge.git
    cd aici-todo-challenge
    ```

2.  **Create a `.env` file:**
    Copy the `.env.example` file and fill in the required environment variables for the databases and the JWT secret. A sample file would look like this:
    ```env
    # User DB
    USER_DB_USER=postgres
    USER_DB_PASSWORD=userpass123
    USER_DB_NAME=user_db
    USER_DB_PORT=5433
    
    # Todo DB
    TODO_DB_USER=postgres
    TODO_DB_PASSWORD=todopass123
    TODO_DB_NAME=todo_db
    TODO_DB_PORT=5434
    
    # Service ports (internal container ports can be same; mapped ports differ)
    USER_SERVICE_PORT=3001
    TODO_SERVICE_PORT=3002
    
    # JWT secrets
    USER_JWT_SECRET=your_user_jwt_secret
    TODO_JWT_SECRET=your_todo_jwt_secret
    ```

3.  **Build and run the containers:**
    This command will build the images for each service and start all the containers.
    ```sh
    docker-compose up --build
    ```

The system will be accessible at `http://localhost:8080`.

***

## 📂 Project Structure

The project is organized into several directories, each representing a different service or configuration:

* `user-service/`: Contains the Node.js backend for user registration and login.
* `todo-service/`: Contains the Node.js backend for managing todo items.
* `frontend-service/`: Contains the simple frontend for interacting with the services.
* `nginx/`: Holds the Nginx configuration file for the reverse proxy.
* `docker-compose.yml`: The main file for orchestrating all the services.

***

## 🛠️ System Components

The system is composed of the following services:

### 1. User Service Backend

This service acts as a centralized login/sign-up endpoint.

* **Technology Stack**: Node.js with TypeScript and PostgreSQL.
* **API Endpoints**:
    * `POST /register`: Registers a new user with an email and password.
    * `POST /login`: Logs in an existing user and returns a JSON Web Token (JWT).
* **Database**: Uses a PostgreSQL database with a `User` table to store user details, including a hashed password and a unique UUID.
* **Authentication**: Upon successful login, it issues a JWT that must be used to authenticate requests to the Todo service.

### 2. Todo List Backend

This service manages the user's personal todo list.

* **Technology Stack**: Node.js with TypeScript and PostgreSQL.
* **API Endpoints**:
    * `POST /todos`: Creates a new todo item for the authenticated user.
    * `GET /todos`: Retrieves all todo items belonging to the authenticated user.
    * `PUT /todos/:id`: Updates a specific todo item.
    * `DELETE /todos/:id`: Deletes a specific todo item.
* **Database**: Uses a PostgreSQL database with a `Todo` table that includes a `user_uuid` field to link each todo item to a specific user via a foreign key relationship.
* **Authorization**: It validates the JWT received from the User service to ensure that only the authenticated user can access their own todo items.

### 3. Frontend

A minimal user interface to demonstrate the system's functionality.

* **Functionality**: Allows users to register, log in, and then create, view, update, and delete their todo items.
* **Interaction**: Communicates with the backend services via the reverse proxy.

### 4. Reverse Proxy

An Nginx container that acts as a single entry point for all incoming requests.

* **Routing**: It routes requests to the appropriate backend service based on the URL path. For example, requests to `localhost/user/*` are forwarded to the User service, while requests to `localhost/api/todo/*` are forwarded to the Todo service .

***

## 📝 API Documentation

For detailed information about each API endpoint, including request and response formats, please refer to the API documentation provided in the project (e.g., Postman/bruno collection or OpenAPI documents)[cite: 25].

***

## 🧪 Testing

Unit tests have been included for the user stories of both the User and Todo services to ensure functionality and reliability. To run the tests, execute the following command in each service's directory:

```sh
npm test
```
