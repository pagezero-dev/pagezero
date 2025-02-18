# PageZERO

An open-source TypeScript starter for full-stack web development on Cloudflare.

Guiding principles:

- Easy to learn
- Fast to build
- Pleasure to develop
- Cheap to maintain

## ⚡️ Quick start

In 4 steps:

1. `git clone --depth 1 https://github.com/pagezero-dev/pagezero.git <your-project-name>`
1. `cd <your-project-name>`
1. `npm run setup`
1. `npm run dev`

You should be able to access http://localhost:3000/ development page now.

If you wish to start a new GitHub repository based on PageZero:

```
gh repo create <your-project-name> -c --template pagezero-dev/pagezero
```

> ℹ️ Above command requires [GitHub CLI](https://cli.github.com/)

## 🧑‍💻 The stack

Building on strong foundations:

- [Vite](https://vite.dev/)
- [React](https://react.dev/)
- [Cloudflare Pages (hosting)](https://pages.cloudflare.com/)
- [Cloudflare D1 (database)](https://www.cloudflare.com/en-au/developer-platform/products/d1/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Router v7](https://reactrouter.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Github Actions](https://GitHub.com/features/actions)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Storybook](https://storybook.js.org/)
- [MDX](https://mdxjs.com/)

## ✨ Scripts

Essential npm scripts:

- `npm run setup` - performs npm install, setups basic env vars, database and playwright browser drivers
- `npm run dev` - boots development server
- `npm run build` - builds the app
- `npm start` - runs built app; this is how your app will be run on production
- `npm test` - executes unit tests
- `npm run test:types` - typescript types check
- `npm run test:e2e:ui` - executes browser tests in UI mode, perfect for development
- `npm run lint` - eslint check
- `npm run format` - prettier check
- `npm run storybook` - boots Storybook
- `npm run doctor` - runs all basic sanity checks: format, lint, types check and unit tests

## 🚀 Deployment

Deployment in PageZERO happens through the GitHub Actions CI/CD pipeline. That means once the pipeline is set,
every merge to the `main` branch will trigger deployment to Cloudflare Pages and database migration for Cloudflare D1.

Additionally, every PR will trigger "preview deployment", so you can access the version of your app for every PR. More about preview deployments: https://developers.cloudflare.com/pages/configuration/preview-deployments/.

The database for preview deployments is shared. If you wish to reset it, you can manually trigger the "Reset preview database" workflow in GitHub Actions.

However, to make it all work, we must go through a few setup steps...

### Cloudflare services setup

1. If you don't have [Cloudflare](https://www.cloudflare.com/) account yet, create one
1. In the Cloudflare dashboard, go to "Storage & Databases / D1 SQL Database"
1. Create 2 databases: `<project-name>_production` and `<project-name>_preview`
1. In the Cloudflare dashboard, go to "Compute (Workers) / Workers & Pages"
1. Create a new "Pages" project through "Create using direct upload" method; however, do not upload any assets
1. Once the "Pages" project is created, open up the project from the "Workers & Pages" list
1. In the "Settings" section, for the "production" environment, create:
   - The following variables:
     - `APP_ENV=production`
     - `DB_BINDING=DB_PRODUCTION`
   - Bindings:
     - [D1 database] `DB_PRODUCTION=<project-name>_production`
1. In the "Settings" section, for the "preview" environment, create:
   - The following variables:
     - `APP_ENV=preview`
     - `DB_BINDING=DB_PREVIEW`
   - Bindings:
     - [D1 database] `DB_PREVIEW=<project-name>_preview`

### GitHub actions setup

The only thing we need to do on the GitHub side is to set proper secrets and variables in your GitHub project "Settings". This will allow GitHub actions to perform deploys to Cloudflare Pages and migrations for your Cloudflare D1 database.

In "Settings / Secrets and variables / Actions", set the following VARIABLES:

| Variable name                     | Value                                |
| --------------------------------- | ------------------------------------ |
| CLOUDFLARE_PROJECT_NAME           | Your Cloudflare Pages project name   |
| DB_NAME_PRODUCTION                | `<project-name>_production`          |
| DB_NAME_PREVIEW                   | `<project-name>_preview`             |
| CLOUDFLARE_DATABASE_ID_PRODUCTION | Cloudflare D1 production database ID |
| CLOUDFLARE_DATABASE_ID_PREVIEW    | Cloudflare D1 preview database ID    |
| CLOUDFLARE_ACCOUNT_ID             | Your Cloudflare account ID           |

> ℹ️ Database IDs can be obtained through the Cloudflare dashboard under "Storage & Databases / D1 SQL Database"

> ℹ️ Cloudflare account ID can be obtained through the Cloudflare dashboard under "Compute (Workers) / Workers & Pages" in the right sidebar

In "Settings / Secrets and variables / Actions", set the following SECRETS:

| Variable name        | Value                |
| -------------------- | -------------------- |
| CLOUDFLARE_API_TOKEN | Cloudflare API token |

> ℹ️ Cloudflare API token can be obtained through the Cloudflare dashboard under "Manage account / Account API Tokens". You have to create the token there. The token will require the following permissions: D1:Edit, Cloudflare Pages:Edit.

In "Settings / Secrets and variables / Dependabot", set the following SECRETS:

| Variable name        | Value                |
| -------------------- | -------------------- |
| CLOUDFLARE_API_TOKEN | Cloudflare API token |

> ℹ️ Dependabot has a separate set of secrets, so to make preview deployments work for Dependabot PR's, you will need to set the `CLOUDFLARE_API_TOKEN` secret for Dependabot as well.

### Test everything out

Now, you can test everything out. Create a PR in your project GitHub repository. You should notice an action in the "Actions" section being triggered. If the basic checks pass, the workflow will perform preview deployment to GitHub pages and database migration on your preview database. After deployment, the "View deployment" button should show up in your PR, with a link to your PR "preview" deployment.

When you merge PR to "main", production deployment will happen, and database migration will be performed on your production DB.
