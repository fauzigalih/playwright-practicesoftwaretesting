# Playwright E2E Testing Project

End-to-end testing project using Playwright with TypeScript for testing the demo application:

🌐 https://practicesoftwaretesting.com/

---

# 📦 Tech Stack

- Node.js `v24.11`
- Playwright `v1.60`
- TypeScript

---

# 📁 Project Structure

```bash
.
├── tests/                # Test files
├── data/                 # User Auth
├── fixtures/             # Dependency Injection
├── pages/                # Page Object Model
├── utils/                # Helper functions
├── playwright.config.ts  # Playwright configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🚀 Installation

Clone repository:

```bash
git clone https://github.com/fauzigalih/playwright-practicesoftwaretesting.git
cd playwright-practicesoftwaretesting
```

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

# ▶️ Run Test

Run all tests:

```bash
npx playwright test
```

Run test with UI mode:

```bash
npx playwright test --ui
```

Run test in headed mode:

```bash
npx playwright test --headed
```

Run specific test:

```bash
npx playwright test tests/example.spec.ts
```

---

# 📊 Generate Report

```bash
npx playwright show-report
```

---

# 🔐 Demo Test Accounts

| Name       | Role  | Email                                 | Password   |
|------------|-------|---------------------------------------|------------|
| John Doe   | Admin | admin@practicesoftwaretesting.com     | welcome01  |
| Jane Doe   | User  | customer@practicesoftwaretesting.com  | welcome01  |
| Jack Howe  | User  | customer2@practicesoftwaretesting.com | welcome01  |
| Bob Smith  | User  | customer3@practicesoftwaretesting.com | pass123    |

> These accounts are publicly available demo credentials from the Practice Software Testing website and should only be used for testing and educational purposes.

---

# ⚙️ Additional Config Script

Add these scripts into `playwright.config.ts`:

```json
use: {
  baseURL: 'https://practicesoftwaretesting.com',
  testIdAttribute: 'data-test'
},
```

---

# 📜 License

## Custom Educational & Internal Use License (CEIUL)

Copyright (c) 2026

Permission is granted to use this project for:

- Educational purposes
- Internal company testing
- Learning Playwright and automation testing
- Personal portfolio and experimentation

Restrictions:

- Commercial resale is prohibited
- Republishing without attribution is prohibited
- Using this project for malicious activity, credential abuse, spam, scraping abuse, or attacking systems is strictly prohibited
- Public redistribution of modified versions must include original attribution

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

---

# ⚠️ Disclaimer

This repository is intended only for learning, QA automation practice, and software testing experiments against publicly available demo environments.

Do not use this project against systems without proper authorization.