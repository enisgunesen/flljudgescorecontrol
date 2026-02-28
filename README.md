# FLL Judge Scores Viewer

A simple web tool to view FLL (FIRST LEGO League) judge scores grouped by team.

## Deploy to GitHub Pages

### Step 1: Create a GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click **+** → **New repository**
3. Name it (e.g., `fll-scores`)
4. Keep it **Public** (required for free GitHub Pages)
5. Click **Create repository**

### Step 2: Upload Files
1. On the repository page, click **uploading an existing file**
2. Drag and drop `index.html` into the page
3. Click **Commit changes**

### Step 3: Enable GitHub Pages
1. Go to repository **Settings** → **Pages** (left sidebar)
2. Under **Source**, select **Deploy from a branch**
3. Select **main** branch and **/ (root)** folder
4. Click **Save**

### Step 4: Access Your Site
After 1-2 minutes, your site will be live at:
```
https://YOUR-USERNAME.github.io/REPO-NAME/
```

Example: `https://johndoe.github.io/fll-scores/`

## Usage
1. Enter your Event ID
2. Enter your Bearer Token
3. Click **Fetch Scores**

The tool will display all team scores with:
- 🔴 Red highlight for missing scores
- 🟠 Orange highlight for scores of 4
