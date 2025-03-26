# nestjs-todo-app

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

<p align="center">A simple todo app built using NestJS, GraphQL and Mongodb.</p>

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

## Deployment

This todo app is confiugured with Github actions with Docker.
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

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

> > > > > > > 1c86421 (Initial commit)
