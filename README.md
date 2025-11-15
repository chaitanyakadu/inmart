# Inmart - An Open Source Automation Software for IndiaMart

## Table of Contents
- [Description](#description)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Creating Strategies](#creating-strategies)
- [Quick FAQs](#quick-faqs)
- [Future Plans](#future-plans)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Summary](#summary)

---

## Description

Inmart is a free and open-source software designed to automate the process of purchasing leads and messaging the customer on IndiaMart. It helps businesses and individuals save up to 90% of their time by handling repetitive lead management tasks automatically.

With Inmart, you can create smart strategies to decide which leads to handle and which to ignore. These strategies are defined using simple filters such as allowed country, allowed medicine, and so on. Once you create custom filter you can turn on the service, this will lead to handling of leads and notifying you about purchases via Gmail.

Inmart provides a clean, dark-themed web interface designed for simplicity, so even people without technical knowledge can easily manage their leads and automation filters.

---

## Key Features

### 1. Lead Automation

Automates the entire process of buying and handling IndiaMart leads based on custom filters and strategies.

### 2. Smart Strategies

You can create strategies that define how and when leads are handled. These are customizable and can be adjusted anytime.

### 3. Gmail Notifications

Once a lead is successfully handled, you receive an notification in your Gmail inbox.

### 4. Minimal UI

A simple dark-themed dashboard makes it easy to monitor and manage automation without needing any technical expertise.

---

## How It Works

Inmart automates the workflow in three steps:

1. **Filter Leads:**  
   Decide which leads should be handled using filters and strategies.

2. **Automate Actions:**  
   The software automatically purchases, messages, and manages the filtered leads.

3. **Get Notifications:**  
   You are notified once your leads have been processed or responded to.

---

## Creating Strategies

When setting up Inmart, you can define your own strategies. These determine which leads are handled or rejected.

### Required Filters

1. **Allowed Countries**  
   List of countries whose leads should be accepted.

2. **Restricted Medicines**  
   List of medicines or products that should always be rejected.

3. **Allowed Medicines**  
   Only these medicines or products will be considered for handling.

### Points System

Each lead can be assigned points based on different parameters:

1. WhatsApp Active
2. Mobile Verified
3. Email Verified
4. Buyer Replies
5. Buyer Calls
6. Seconds (lead is less than 1 minute old)

You can use these to set a minimum quality threshold for leads.

### Fundamental Settings

1. **Minimum Points Required**  
   The least score a lead must have to be handled automatically.

2. **Maximum Leads Handled (1–10 only)**  
   The number of leads Inmart will process in a single batch.

---

## Quick FAQs

1. Who is inmart for?
Inmart is ideal for anyone who wants to automate buying leads and messaging customers via IndiaMart in the niche of medicines.
2. What problem does it solve?
It solves the repetitive, long and boring task of looking at the screen and purchasing the leads based on fixed parameters by automating it and letting inmart handle it for you. When inmart purchases the lead it sends you a notification email, this is where you could continue the interaction with the customers.
3. Can a non-technical person use it?
The installation could be a bit tedious, still stick to the documentation. Once the installation is completed the software is pretty easy to run/handle.

---

## Future Plans

In future versions, Inmart aims to include:

1. **AI Instructions** – Use natural language to describe AI generated messages.
2. **Allowed Categories** – Define which categories of products should be handled.

---

## Tech Stack

- Backend - TypeScript + NodeJS
- Frontend - TypeScript + NextJs
- Socket - TypeScript + NodeJS
- Task-Handler - TypeScript + NodeJS
- Task-Scheduler - TypeScript + NodeJS
- Caching - Redis
- Database - PostgreSQL (Prisma ORM)
- Monitoring - Prometheus
- Containerization - Docker
- CI - Github Actions

---

## Installation

Below are the steps to install and run Inmart using Docker. No technical background is needed — simply follow these instructions carefully.

### Step 1: Install Docker
You need to install Docker on your system before running Inmart.

```
- **Windows:**  
  [Install Docker for Windows](https://docs.docker.com/desktop/setup/install/windows-install/)
- **Mac:**  
  [Install Docker for Mac](https://docs.docker.com/desktop/setup/install/mac-install/)
- **Linux:**  
  [Install Docker for Linux](https://docs.docker.com/desktop/setup/install/linux/)
```
### Step 2: Clone the Codebase
Open a terminal or command prompt and run the following command:

```
git clone https://github.com/chaitanyakadu/inmart.git
```

This will download the entire Inmart project onto your computer.
### Step 3: Run Setup Script
Before starting Inmart, you need to provide your API credentials for Google, MailJet, and Gemini.

1. **Get Google Credentials:**  
   [Create Google Credentials](https://developers.google.com/workspace/guides/create-credentials)

2. **Get MailJet API Keys:**  
   [MailJet API Keys](https://app.mailjet.com/account/api_keys)

3. **Get Gemini API Key:**  
   [Gemini API Key](https://ai.google.dev/gemini-api/docs/api-key)

Once you have them ready, run the following commands:

```
./scripts/environment.sh

./scripts/setup.sh
```

These will configure the environment for your Inmart installation.
### Step 4: Start Inmart Using Docker
To start the Inmart system, run:

```
docker compose up --scale task_handler=3 -d
```

This will download all necessary containers and start the automation software where the task handler worker are 3 at total.
### Step 5: Stopping and Managing Inmart
You can manage Inmart using the following commands:

```
#### To start Inmart

docker compose start

#### To stop Inmart

docker compose stop

#### To remove all containers

docker compose down
```

When you are done using Inmart, you can safely stop it with `docker compose down`.
---

## Summary

Inmart is built to make IndiaMart automation simple, efficient, and free for everyone. With minimal setup and no technical knowledge required, you can automate lead handling, apply business logic, and stay informed—all from a clean and easy-to-use dashboard.
