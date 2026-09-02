# Astro Starter Kit: Minimal

```sh
bun create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun dev`             | Starts local dev server at `localhost:4321`      |
| `bun build`           | Build your production site to `./dist/`          |
| `bun preview`         | Preview your build locally, before deploying     |
| `bun astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help` | Get help using the Astro CLI                     |
| `npm run cf:deploy`   | Build and publish to production                  |

## 🚀 Deploying

The site is a Cloudflare Pages project named `mone`, served at
`mone-cqe.pages.dev`.

**Pushing to GitHub does not deploy anything.** The Pages project is not
connected to a Git provider (`wrangler pages project list` shows
`Git Provider: No`), so every release is published directly with wrangler.
`git push` only backs the code up.

**Production is the `mediaone` branch, not `main`.** Cloudflare decides whether
a deployment is Production or Preview by comparing the `--branch` flag against
the project's production branch. Left off, wrangler infers the *current git
branch* — so running a bare `wrangler pages deploy dist/` from `main` publishes
a **preview**: it prints a URL and looks like it worked, while the live site
stays on the previous release. That is why `cf:deploy` pins the flag:

```
wrangler pages deploy dist/ --project-name=mone --branch=mediaone
```

Do not remove `--branch=mediaone` — it is the whole difference between shipping
and appearing to ship. Note that no local `mediaone` branch exists or is needed;
the flag is just the label wrangler sends to Cloudflare.

Check what is actually live with:

```
npx wrangler pages deployment list --project-name mone
```

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
