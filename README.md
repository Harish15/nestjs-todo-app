# nestjs-todo-app

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

<p align="center">A simple todo app built using NestJS, GraphQL and Mongodb.</p>

Below points are covered while developing this app.

1. CRUD API using NestJS + GraphQL
2. MongoDB integration (via Mongoose)
3. GraphQL Playground customization (with auto-generated query/mutation tabs)
4. Sorting, Filtering, and Pagination using MongoDB aggregation
5. Interceptor for consistent API responses
6. X-CSRF-Token
7. Linting rules for better code quality
8. Prometheus for monitoring.
9. Winston for logging
10. JEST test cases.
11. Docker support added.
12. Github actions
13. Connected GitHub action with docker, so anytime new commit is pushed to repository the docker build will be auto created and pushed to docker hub


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## docker playground

```bash
http://localhost:4000/playground
http://localhost:4000/csrf
```

## Prometheus profiling metrics

```bash
http://localhost:3000/metrics
```

## Deployment

This todo app is confiugured with Github actions with Docker.

```bash
# Build the Docker image
docker build -t nestjs-todo-app .

# Run the container
docker run -p 4000:3000 --env-file .env nestjs-todo-app

# to start everything
docker-compose up -d

# Stop and remove all containers + volumes
docker-compose down -v  
docker-compose up --build

docker pull harishshinde/nestjs-todo-app:latest
docker run -d -p 4000:3000 harishshinde/nestjs-todo-app:latest
```


Integrating Docker with GitHub Actions automates the process of building, testing, and deploying your Docker images.

Here’s why it’s useful:

🔹 1. Automate Docker Image Builds 🏗️
Every time you push changes to your repository, GitHub Actions can automatically build your Docker image.
Ensures that your image is always up to date with the latest code changes.

✅ Example:

A new feature is merged → GitHub Actions builds a new Docker image.

🔹 2. Push Docker Images to Docker Hub or AWS/GCP/Azure ☁️
Automatically push your images to Docker Hub or cloud registries (AWS ECR, GCP GCR, Azure ACR).
Ensures that your latest image is always available for deployment.

✅ Example:

You push code to main → GitHub Actions builds and pushes the image to Docker Hub.

🔹 3. Run Tests in a Dockerized Environment 🧪
Run unit tests, integration tests, and security scans inside a container before deployment.
Helps prevent "works on my machine" issues.

✅ Example:

Run tests inside a clean Docker container to ensure consistency across environments.

🔹 4. Deploy to Kubernetes, AWS, or Other Services 🚀
Automate CI/CD pipelines to deploy Docker containers to Kubernetes, AWS ECS, GCP Cloud Run, etc.
Supports zero-downtime deployments and rolling updates.

✅ Example:

After a successful image build, GitHub Actions deploys it to a Kubernetes cluster.

🔹 5. Improve Security 🔐
Automate security scans on Docker images using tools like Trivy or Snyk.
Detects vulnerabilities before deployment.

✅ Example:

Scan the Docker image for security issues before pushing it to production.

🔹 6. Reduce Manual Work & Human Errors 🤖
No need to manually run docker build or docker push.
Everything is automated with a workflow.

✅ Example:

Push code → GitHub Actions does everything (build, test, push, deploy) automatically.

🔹 7. Consistent Environment for All Developers 🏗️
Ensures that everyone is working with the same dependencies and environment.
Avoids problems like "it works on my machine, but not in production."

✅ Example:

A developer uses Windows, but the production server is Linux → Docker ensures consistency.

🚀 Summary: Why Use Docker with GitHub Actions?

Feature	Benefit

✅ Automates builds ->	No need to manually run docker build

✅ Pushes to Docker Hub ->	Ensures the latest image is always available

✅ Runs tests in Docker	-> Prevents environment-specific bugs

✅ Deploys automatically ->	Integrates with Kubernetes, AWS, GCP

✅ Improves security	-> Scans images for vulnerabilities

✅ Reduces manual errors ->	CI/CD ensures reliable deployments

