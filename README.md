## Restify Microservice Boilerplate
Microservice boilerplate based on [Restify](http://restify.com)
## Installation

To get started with this microservice boilerplate, follow these steps:

1. **Clone the repository:**
  ```sh
  git clone https://github.com/yourusername/restify-microservices.git
  cd restify-microservices
  ```

2. **Run the application using Docker Compose:**
  ```sh
  docker-compose up --build
  ```

This will build the Docker images and start the services defined in the `docker-compose.yml` file.

3. **Access the service:**
  Open your browser and navigate to `http://localhost:PORT` (replace `PORT` with the actual port number defined in your service configuration).

For more detailed information, refer to the documentation or the comments within the configuration files.

## Example HTTP Request

Here is an example of an HTTP request to one of the routes defined in `src/routes`:

### GET /v1/example

```http
GET /v1/products HTTP/1.1
Host: localhost:PORT
Content-Type: application/json
```

Replace `PORT` with the actual port number defined in your service configuration.

For more examples and detailed information on the available routes, refer to the `src/routes` directory.