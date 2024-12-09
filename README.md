# File Storage and Sharing Platform
![Project Logo](docs/images/filetrekker_200x202.png)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://app.gitter.im/#/room/#filetrekker:gitter.im)
## Overview

This project aims to create a modern file storage and sharing solution, inspired by Google Drive, 
focusing on flexibility, security, and scalability. The system is built using **Node.js**, **Express.js**, 
and **MongoDB**, and integrates advanced features like **attribute-based access control (ABAC)** 
and optional mail quota management via **WildDuck**.

## Features

- **Flexible File and Folder Management**: Support for nested folders, group folders, and shared access.
- **Quota Management**: Optional integration with WildDuck for shared mail and file storage quotas.
- **ABAC Permissions**: Attribute-based permissions for secure and granular access control.
- **Sharing**: Share files and folders within an organization or with external users.
- **Deployment Ready**: Runs seamlessly as a systemd service or in a Docker container.
- **Scalable Storage**: Designed to handle a large number of files and users.

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: ABAC integration with existing APIs
- **Deployment**: Dockerized setup with optional systemd support

## Installation and Setup

### Prerequisites
- Node.js (16.x or higher)
- MongoDB (5.0 or higher)
- Docker (optional for containerized deployment)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/TenforwardAB/fileTrekker.git
   cd fileTrekker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables in `.env`:
   ```plaintext
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/filesharing
   ```

4. Start the application:
   - Development mode:
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm run build
     npm start
     ```

5. Access the API at `http://localhost:4000`.

## Development Progress

| Feature                      | Status       |
|------------------------------|--------------|
| Project Initialization       | ✅ Completed |
| File and Folder Models       | ✅ Completed |
| Basic ABAC Middleware        | ✅ Completed |
| API Endpoints for File CRUD  | 🚧 In Progress |
| Group Folder Support         | 🚧 In Progress |
| Quota Management (WildDuck)  | ❌ Not Started |
| Docker and Systemd Support   | ❌ Not Started |

## Contributions

We welcome contributions! Feel free to submit issues or pull requests to improve the project.

---

## License

This project is licensed under the [EUPL v1.2](https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12).

