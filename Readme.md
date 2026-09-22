# Research Networking Platform

## Overview

Researchers working on related topics often remain unaware of potential collaboration opportunities within their own institutions. This leads to duplicated efforts, missed interdisciplinary partnerships, and slower innovation.

The **Research Networking Platform** is designed to bridge this gap by connecting researchers, faculty members, scholars, and students based on their research interests, publications, expertise, and ongoing projects. The platform helps users discover potential collaborators, explore research activities across departments, and encourage interdisciplinary innovation.

---

## Problem Statement

In many universities and research institutions, researchers operate within departmental silos. As a result:

- Researchers are unaware of similar work happening in other departments.
- Collaboration opportunities are often missed.
- Interdisciplinary research projects are difficult to initiate.
- Research resources and expertise remain underutilized.
- Duplicate research efforts may occur due to lack of visibility.

A centralized platform is needed to improve research discoverability and collaboration.

---

## Proposed Solution

The Research Networking Platform provides a centralized environment where researchers can:

- Create and manage professional research profiles.
- Showcase research interests, publications, and projects.
- Discover researchers with similar or complementary expertise.
- Search research topics across departments.
- Receive collaboration recommendations.
- Connect and communicate with potential collaborators.

By making institutional research more visible and accessible, the platform promotes innovation and knowledge sharing.

---

## Objectives

- Increase awareness of ongoing research within institutions.
- Promote interdisciplinary collaboration.
- Reduce duplication of research efforts.
- Facilitate networking among researchers.
- Provide intelligent recommendations for potential partnerships.
- Improve accessibility to research information.

---

## Key Features

### Researcher Profiles
- Personal and academic information.
- Research interests and areas of expertise.
- Publications and achievements.
- Current and completed projects.

### Smart Research Discovery
- Search researchers by keywords, domain, department, or expertise.
- Browse ongoing and completed research projects.

### Collaboration Recommendations
- Suggest potential collaborators based on:
  - Research interests
  - Keywords
  - Publication topics
  - Skills and expertise

### Project Showcase
- Display active and completed research projects.
- Highlight project goals, outcomes, and contributors.

### Communication System
- Send collaboration requests.
- Connect with researchers across departments.

### Research Analytics Dashboard
- Track collaboration trends.
- View research activity and engagement metrics.

---

## Target Users

- Researchers
- Faculty Members
- PhD Scholars
- Postgraduate Students
- Research Administrators
- Academic Institutions

---

## Technology Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL / MongoDB

### Authentication
- JWT Authentication
- Role-Based Access Control

### Additional Tools
- Git & GitHub
- REST APIs

## Backend setup

1. Install dependencies in `backend` with `npm install`.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` to a MongoDB Atlas connection string.
3. Start the API with `npm start` or `npm run dev`.

Start the frontend in a second terminal with `cd frontend`, `npm install`, and `npm run dev`. The page first reads existing users and projects. Use **Add a researcher** to write a user, then select that researcher in **Publish a project** to write a project. The project list is then refreshed from the API on the next page load.

For a quick API demonstration, create a user, use its returned `_id` as the project `owner`, and then call `GET /api/users` and `GET /api/projects` to show both persisted records. Passwords are hashed before users are saved and are never returned by the API.

The backend models users, research projects, and collaboration requests. References connect project owners and collaborators, while each collaboration request stores its sender, recipient, optional project, message, and status.

### Database read/write API

- `GET /api/users` reads users for selecting a project owner.
- `POST /api/users` writes a user. Required fields: `name`, `email`, and `password`.
- `GET /api/projects` reads projects, with optional `status` and `researchArea` filters.
- `POST /api/projects` writes a project. Required fields: `title`, `description`, `owner` (a User `_id`), and a non-empty `researchAreas` array.
- `GET /api/collaboration-requests` reads collaboration requests with populated sender, recipient, and project details. It supports optional `status`, `sender`, `recipient`, and `project` filters.

Example workflow after starting MongoDB and the backend:

```powershell
$user = Invoke-RestMethod -Method Post http://localhost:5000/api/users -ContentType 'application/json' -Body '{"name":"Asha Researcher","email":"asha@example.com","password":"secret123"}'
Invoke-RestMethod -Method Post http://localhost:5000/api/projects -ContentType 'application/json' -Body (@{title='Climate Signals';description='Studying local climate patterns.';owner=$user._id;researchAreas=@('Climate','Data Science')} | ConvertTo-Json)
Invoke-RestMethod http://localhost:5000/api/projects
```

---

## System Workflow

1. User registers and creates a research profile.
2. Research interests and expertise are added.
3. Research data is stored in the database.
4. Users search for researchers or projects.
5. Recommendation engine identifies potential collaborators.
6. Users connect and initiate collaborations.
7. Research outcomes and projects are shared on the platform.

---

## Expected Outcomes

- Increased interdisciplinary research collaborations.
- Better visibility of institutional research activities.
- Improved knowledge sharing among researchers.
- Enhanced innovation through cross-domain partnerships.
- Stronger research ecosystem within institutions.

---

## Future Enhancements

- AI-powered collaboration recommendations.
- Integration with Google Scholar and ORCID.
- Publication citation analysis.
- Research funding opportunity recommendations.
- Real-time messaging and discussion forums.
- Research event and conference tracking.

---

## Conclusion

The Research Networking Platform aims to create a collaborative research ecosystem by connecting researchers with shared interests and complementary expertise. By improving visibility, communication, and collaboration opportunities, the platform can help institutions unlock greater innovation and research impact.  