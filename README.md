# AgoraAI: A Multi-Agent Conversational Framework

[![GitHub Repository](https://img.shields.io/badge/GitHub-skgadi%2Fagora--ai-blue)](https://github.com/skgadi/agora-ai)
[![Docker Pulls](https://img.shields.io/docker/pulls/skgadi/sigrama-agora-ai?color=orange)](https://hub.docker.com/r/skgadi/sigrama-agora-ai)
[![License](https://img.shields.io/badge/License-Open--Source-green)](LICENSE)

## 🌟 Overview

**AgoraAI** is an open-source platform designed to overcome the limitations of single-persona Large Language Model (LLM) interactions. AgoraAI enables users to configure and deploy multiple distinct AI agents capable of simultaneous communication within a shared environment, interacting both with each other and with multiple human participants.

This multi-agent architecture facilitates more fluid and enriched discussions, allowing users to explore topics from diverse perspectives by leveraging the versatility of concurrent AI personas. The entire application is delivered as a **full-stack solution**.

## ✨ Key Features

*   **Multi-Agent Deployment:** Supports the configuration and simultaneous deployment of distinct AI personas within a single conversational event.
*   **Context-Aware Generation:** AI participants generate responses based on a comprehensive, dynamically constructed prompt.
*   **Comprehensive State Management:** The back-end maintains a complete state of the simulated event, serving as the single source of truth.
*   **Post-Event Reporting and Transcript Management:** The administrative interface allows users to:
    *   Generate a **Full Event Report** that includes event details, defined roles, participant information, and the full transcript.
    *   **Download Transcript:** Download the conversation history (including Speech-to-Text results and AI-generated responses) for backup.
    *   **Upload Transcript:** Restore a previously downloaded transcript history, replacing the existing conversational history.
*   **Conversational State Transition:** The system transitions from the Setup State to the Conversational State upon transmitting configured event data to the server.
*   **Control Mechanisms:** Includes features to forcibly interrupt AI speech or trigger a response.

## 💻 Technology Stack

AgoraAI leverages modern generative AI capabilities and robust state management.

### Front-end (`/client`)

The user interface is built upon a modern, robust technology stack chosen to ensure performance, maintainability, and a rich user experience.

*   **Core Framework:** The application is developed using **Vue.js 3** with the Composition API, enhanced by the **Quasar Framework**.
*   **Deployment:** Quasar provides out-of-the-box support for **Progressive Web Applications (PWA)**.
*   **Language:** **TypeScript** is used throughout the project to enforce static typing, improving code quality and long-term maintainability.
*   **Source Location:** The frontend source code is available in the `/client` directory and uses **Yarn** as its package manager.

### Back-end (`/server`)

The back-end focuses on reliable state management and real-time communication.

*   **Core Technology:** **Node.js** along with **Socket.IO** was selected to handle high scalability and real-time, bi-directional communication via web-sockets.
*   **Language:** The back-end is implemented using **TypeScript**.
*   **LLM Integration:** Handles centralized API key initialization and interaction with the generative model.
*   **Source Location:** The backend source code resides in the `/server` directory.

## 🚀 Getting Started

The easiest way to deploy AgoraAI is using Docker.

### Prerequisites

*   Docker installed on your system.
*   A Google Generative AI API Key (required to utilize the LLM model).

### Installation via Docker Hub

You can pull the latest stable image from our Docker Hub repository:

```bash
docker pull skgadi/sigrama-agora-ai
```

### Running the Container

```bash
# Example Startup (Requires setting the MY_PAI_GEMINI_API_KEY environment variable)
docker run -d -p 3000:3000 -e MY_PAI_GEMINI_API_KEY="YOUR_API_KEY" skgadi/sigrama-agora-ai
```

Access the application in your browser at `http://localhost:3000` and admin page at `http://localhost:3000/admin`. The admin page needs a password. The password can be set by congiuring the environment variable `MY_PAI_ADMIN_PASSWORD`. 

A possible example for `docker-compose.yml` is:

```yaml
version: '3.8' # Specify the Docker Compose file format version

services:
  agora-ai: # Define a service named 'agora-ai'
    image: skgadi/sigrama-agora-ai:latest # Specify the Docker image to use
    container_name: temp-suresh-agora-ai # Optional: Assign a custom name to the container
    restart: unless-stopped # Ensure the container restarts automatically unless explicitly stopped

    # Define environment variables for the container
    environment:
      MY_PAI_GEMINI_API_KEY: "AaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaAaA" # Replace with your actual Gemini API key
      MY_PAI_ADMIN_PASSWORD: "1234" # Replace with your desired admin password
    # it will now be accessible on port 8080 of your host machine.
    ports:
      - "8080:3000" # Host port 8080 mapped to container port 3000
```

## 📚 Repository Structure and Sources

The source code is fully open and available here:

**GitHub Repository:**
`https://github.com/skgadi/agora-ai`

**Docker Hub:**
`https://hub.docker.com/r/skgadi/sigrama-agora-ai`

## 🔬 Scientific Contribution

The underlying design and architecture of the AgoraAI framework have been submitted to a scientific journal for formal peer review and publication.
