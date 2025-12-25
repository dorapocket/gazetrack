# Gazetrack Web Experiment

This repository contains a Vite + Vue front end and an Express backend for an eye-tracking web experiment.

## Prerequisites

- Node.js 18+
- npm or yarn
- Serverless Devs CLI (`s`) with an Aliyun account

## Frontend (local)

```bash
npm install
npm run dev
```

Open the dev server URL printed in the terminal.

## Backend (Aliyun Serverless)

The backend is designed to run on Aliyun Function Compute via Serverless Devs and sends experiment data by email.

1. Install Serverless Devs and configure access credentials:

```bash
npm install -g @serverless-devs/s
s config add
```

2. Review `s.yaml` and adjust the region/service settings if needed.

3. Set the email sender and recipient values in `backend/index.js`:
   - Replace `[hidden for peer review]` placeholders with your SMTP account and recipient addresses.
   - Update the SMTP host/port if your provider differs.

4. Deploy the backend:

```bash
cd backend
npm install
cd ..
s deploy
```

After deployment, use the generated HTTP trigger URL as the frontend `baseURL` in `src/components/Success.vue`.

## Notes

- The backend expects a POST to `/upload` with the experiment payload.
- Emails include the JSON payload as an attachment.
