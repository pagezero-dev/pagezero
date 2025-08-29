# PageZERO

An open-source TypeScript starter for full-stack web development on Cloudflare.

Guiding principles:

- Easy to learn
- Fast to build with
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

_Core:_

- ⚡ [Vite](https://vite.dev/) + [React](https://react.dev/) + [React Router v7](https://reactrouter.com/)
- ☁️ [Cloudflare Workers](https://workers.cloudflare.com/) (hosting) + [Cloudflare D1](https://www.cloudflare.com/en-au/developer-platform/products/d1/) (database)
- 🏗️ [TypeScript](https://www.typescriptlang.org/) + [TailwindCSS](https://tailwindcss.com/) + [Drizzle ORM](https://orm.drizzle.team/)

_Tooling:_

- ✅ [GitHub Actions](https://github.com/features/actions) (CI/CD)
- ✨ [Prettier](https://prettier.io/) + [ESLint](https://eslint.org/) (code quality)
- 🧪 [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) (testing)
- 📖 [Shadcn](https://ui.shadcn.com/) + [Storybook](https://storybook.js.org/) (UI components)

## ✨ Scripts

Essential npm scripts:

- `npm run setup` - performs npm install, setups basic env vars, database and playwright browser drivers
- `npm run dev` - boots development server
- `npm run build` - builds the app
- `npm run preview` - runs built app; this is how your app will be run on production
- `npm test` - executes unit tests
- `npm run test:types` - typescript types check
- `npm run test:e2e:ui` - executes browser tests in UI mode, perfect for development
- `npm run lint` - eslint check
- `npm run format` - prettier check
- `npm run storybook` - boots Storybook
- `npm run doctor` - runs all basic sanity checks: format, lint, types check and unit tests

## 🚀 Deployment

Deployment in PageZERO happens through the GitHub Actions CI/CD pipeline. That means once the pipeline is set,
every merge to the `main` branch will automatically trigger deployment to Cloudflare Workers and database
migration for Cloudflare D1.

Additionally, every PR will trigger "preview deployment", so you can access the version of your app for every PR. More about preview urls: https://developers.cloudflare.com/workers/configuration/previews/.

The database for preview deployments is shared. If you wish to reset it, you can manually trigger the "Reset preview database" workflow in GitHub Actions.

OK, now to make it all work, we must go through a few setup steps...

### Cloudflare configuration

> [!IMPORTANT]
> Steps below require [Cloudflare](https://www.cloudflare.com/) account.

1. Login through `npx wrangler login`
1. Create production and preview database:
   ```
   npx wrangler d1 create <project-name>-production
   npx wrangler d1 create <project-name>-preview
   ```
1. Update `wrangler.json` with: project name, database names and returned `database_id`s
1. Perform manual deployments to create Cloudflare Workers:
   ```
   npm run deploy:production
   npm run deploy:preview
   ```

### Github configuration

> [!IMPORTANT]
> Steps below require [GitHub CLI](https://cli.github.com/).
> For Mac, you can setup it with: `brew install gh`.

1.  Create Github repo for the project and commit all changes

    ```
    gh repo create <project-name>
    git add .
    git commit -m "Init"
    git push
    ```

1.  Obtain Cloudflare Account ID

    > Cloudflare account ID can be obtained through the Cloudflare dashboard under "Compute (Workers) / Workers & Pages" in the right sidebar

1.  Obtain Cloudflare D1 databases id's

    ```
    npx wrangler d1 list
    ```

1.  Add following repository variables:

    ```
    gh variable set CLOUDFLARE_ACCOUNT_ID <your-cloudflare-account-id>
    gh variable set CLOUDFLARE_DATABASE_ID_PRODUCTION <your-production-database-id>
    gh variable set CLOUDFLARE_DATABASE_ID_PREVIEW <your-preview-database-id>
    ```

    > You can browse variables by going to Github UI "Settings / Secrets and variables / Actions" for your repo
    > or by executing `gh variable list`.

1.  Obtain Cloudflare API token

    > Cloudflare API token can be obtained through the Cloudflare dashboard under "Manage account / Account API Tokens". You have to create the token there. The token will require the following permissions: D1:Edit, Workers Scripts:Edit.

1.  Add following repository secret:

    ```
    gh secret set CLOUDFLARE_API_TOKEN <your-cloudflare-api-token>
    gh secret set CLOUDFLARE_API_TOKEN <your-cloudflare-api-token> --app dependabot
    ```

    > Secret for Dependabot needs to be set seperately. Otherwise Dependabot PR's will not perform preview deploys.

    > You can browse secrets by going to Github UI "Settings / Secrets and variables / Actions" for your repo
    > or by executing `gh secret list`.

### All done! 🎉

Now, you can test everything out. Create a PR in your project GitHub repository. You should notice an action in the "Actions" section being triggered. If the basic checks pass, the workflow will perform preview deployment to GitHub pages and database migration on your preview database. After deployment, the "View deployment" button should appear in your PR, with a link to your PR "preview" deployment.

When you merge PR to "main", production deployment will happen, and database migration will be performed on your production DB.
