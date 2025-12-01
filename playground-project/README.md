# Automation Test Playground

This project aims to provide a set of web pages so that test automation can be practiced.  
In this monorepository, it is also used as the sample application under test for my Playwright end-to-end tests.

<img src="https://res.cloudinary.com/dtglidvcw/image/upload/v1722117148/BUGBUSTER/oxppkv2auqy48lj5vbjn.png" alt="Site Preview" width="600" />

## Developers

This project was originally developed by **Bruno Machado** from the **Bug Busters Mentoria** page.

## Technologies Used

This project was built using the following technologies:

- [Next.js](https://nextjs.org/) – A React framework for building web applications.
- [React](https://reactjs.org/) – A JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/) – A superset of JavaScript that adds static typing to the language.
- [Tailwind CSS](https://tailwindcss.com/) – A utility-first CSS framework for fast and efficient styling.
- [ESLint](https://eslint.org/) – A tool for identifying and fixing problems in JavaScript/TypeScript code.
- [Prettier](https://prettier.io/) – An opinionated code formatter.
- [Jest](https://jestjs.io/) – A JavaScript testing framework.
- [Testing Library](https://testing-library.com/) – A set of utilities for testing React components.
- [Vercel](https://vercel.com/) – A deployment platform for frontend applications.
- [Harry Potter API](https://hp-api.onrender.com/) – An API for retrieving information about characters, spells, and houses from the Harry Potter universe.
- [Cloudinary](https://cloudinary.com/) – An image management and hosting service used to store and serve the site images.

## How to Run the Project

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/), or [bun](https://bun.sh/)

### Steps to Run

1. **Clone the repository:**

```bash
git clone https://github.com/brunomachadors/playground.git
cd playground
```

2. **Install the dependencies:**

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Start the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. **Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.**

You can start editing the page by modifying `app/page.tsx`. The page will automatically update as you edit the file.

### Additional Commands

- **Run ESLint:**

```bash
npm run lint
```

- **Run Prettier:**

```bash
npm run format
```

- **Run tests:**

```bash
npm run test
```

## Test Accounts

To make test automation easier, you can use the following test accounts:

### Regular Account

- **Login:** teste
- **Password:** password123

### Blocked Account

- **Login:** testeblock
- **Password:** password123

## Harry Potter API

This project uses the [Harry Potter API](https://hp-api.onrender.com/) to retrieve data about characters, spells, and houses from the Harry Potter universe. For more information on how to use this API, check the [official API documentation](https://hp-api.onrender.com/).

## Image Hosting

The images used in this project are hosted on [Cloudinary](https://cloudinary.com/). To learn more about using Cloudinary for image management and hosting, see the [official Cloudinary documentation](https://cloudinary.com/documentation).

## Learn More

To learn more about the technologies used in this project, see the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ESLint Documentation](https://eslint.org/docs/user-guide/getting-started)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Documentation](https://testing-library.com/docs/)

## Deploy on Vercel

The easiest way to deploy your Next.js application is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), created by the developers of Next.js.

Check the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Final Considerations

This project was originally developed with the goal of helping people who are starting in the testing field.  
In my setup, I am also using it as a practice application to run and experiment with **Playwright** automated tests.  
If you have any suggestions, feel free to get in touch with the original author or contribute via pull requests.
