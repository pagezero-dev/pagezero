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

If you wish to start new Github repository based on PageZero:

```
gh repo create <your-project-name> -c --template pagezero-dev/pagezero
```

> ℹ️ Above command requires [Github CLI](https://cli.github.com/)

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
- [Github Actions](https://github.com/features/actions)
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
- `npm start` - runs builded app, this is how your app will be run on producion
- `npm test` - executes unit tests
- `npm run test:types` - typescript types check
- `npm run test:e2e:ui` - executes browser tests in UI mode, perfect for development
- `npm run lint` - eslint check
- `npm run format` - prettier check
- `npm run storybook` - boots Storybook
- `npm run doctor` - runs all basic sanity checks: format, lint, types check and unit tests

## 🚀 Deployment

Deployment in PageZERO happens through Github Actions CI/CD pipeline. That means once pipeline is setup,
every merge to `main` branch will trigger deploy to Cloudflare Pages and database migration for Cloudflare D1.

Additionally, every PR will trigger "preview deployment", so you would be able to access version of your app, for every PR. More about preview deployments: https://developers.cloudflare.com/pages/configuration/preview-deployments/.

Database for preview deployments is shared. If you wish to reset it, you can manually trigger "Reset preview database" workflow in Github Actions.

However, to make it all work, we need to go through a few setup steps...

### Cloudflare services setup

1. If you don't have [Cloudflare](https://www.cloudflare.com/) account yet, create one
1. In Cloudflare dashboard, go to "Storage & Databases / D1 SQL Database"
1. Create 2 databases: `<project-name>_production` and `<project-name>_preview`
1. In Cloudflare dashboard, go to "Compute (Workers) / Workers & Pages"
1. Create new "Pages" project, through "Create using direct upload" method, however do not upload any assets
1. Once "Pages" project is created, open up the project from "Workers & Pages" list
1. In "Settings" section, for "production" environment, create:
   - The following variables:
     - `APP_ENV=production`
     - `DB_BINDING=DB_PRODUCTION`
   - Bindings:
     - [D1 database] `DB_PRODUCTION=<project-name>_production`
1. In "Settings" section, for "preview" environment, create:
   - The following variables:
     - `APP_ENV=preview`
     - `DB_BINDING=DB_PREVIEW`
   - Bindings:
     - [D1 database] `DB_PREVIEW=<project-name>_production`

### Github actions setup
