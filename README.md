# Personal Finance Command Center

A completely serverless, highly responsive Personal Finance Dashboard that uses your personal Google Sheet as its database.

## Architecture
- **Frontend/Backend:** Next.js 15 (App Router), React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui, Lucide Icons
- **Database:** Google Sheets (via Google Apps Script Web App)
- **Deployment:** Vercel (or any Node.js hosting)

## Google Sheets Integration

This application connects to Google Sheets using a deployed Google Apps Script. This completely avoids Google Cloud Console service accounts while keeping your data perfectly secure.

### Configuration

**Your Active Google Apps Script Web App URL:**
`https://script.google.com/macros/s/AKfycbxyIH0l2o8d80S5o4IqVPTl8mHQAp1DKEEG6Na786Sk6eLfOFOy3P8G_RNIzTSVlaRwvg/exec`

*(This is saved in your `.env.local` as `GOOGLE_APPS_SCRIPT_URL`)*

### Setup Instructions (For New Deployments)

If you ever need to reconnect this or deploy it somewhere else:
1. Open the [Code.gs](./setup/Code.gs) file in this repository.
2. Open your Google Sheet, go to **Extensions > Apps Script**, paste the code, and save.
3. Click **Deploy > New deployment**, select **Web app**.
4. Set "Execute as" to **Me** and "Who has access" to **Anyone**.
5. Copy the **Web app URL** and place it in your `.env.local` file:
   ```env
   GOOGLE_APPS_SCRIPT_URL="YOUR_WEB_APP_URL"
   ```
6. Run `npm run dev` and navigate to `http://localhost:3000/api/setup` to automatically format the sheet with all required tabs.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Modules Included

- **Dashboard:** At-a-glance financial health, available balances, income vs expenses.
- **Expenses & Income:** Full CRUD operations for daily transactions.
- **Budgets:** Track spending against monthly limits.
- **Goals:** Savings progress trackers.
- **Insights:** Automated logic to calculate financial health.
