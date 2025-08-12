## 🚀 Getting Started

To run the system, you'll need **Docker** and **Docker Compose** installed.

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/Shahzeb-99/aici-todo-challenge.git
    cd aici-todo-challenge
    ```

2.  **Create `.env` files for each service:**
    You must copy the `.env.example` file to `.env` in both the `user-service` and `todo-service` directories:
    ```sh
    cp user-service/.env.example user-service/.env
    cp todo-service/.env.example todo-service/.env
    ```
    Fill in the required environment variables for each service.

3.  **Build and run the containers:**
    ```sh
    docker compose up --build
    ```

The system will be accessible at `http://localhost:8080`.

**API documentation:**  
A complete Postman collection is available in the root directory as `User Service Auth API.postman_collection.json`.

## 🧪 Testing

Unit tests are included for both the User and Todo services.

To run the tests, use the following command in each service directory:

```sh
npx jest
```

Or, if you have Jest installed globally:

```sh
npm test
```