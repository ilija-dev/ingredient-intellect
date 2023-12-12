# Project Name

This is a Next.js project bootstrapped with `create-next-app`.

## Getting Started

Clone the repository and run the development server:

```bash
git clone 
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses `next/font` for font optimization. To learn more about Next.js, check the [documentation](https://nextjs.org/docs).

## Tech Stack

- Next.js
- Clerk Auth
- DrizzleORM + NeonDB
- Stripe
- AWS S3

## AI Tech Stack

- PineconeDB
- Langchain
- OpenAI
- Vercel AI SDK

## Steps

1. Obtain PDF
2. Split and segment (LangChain)
3. Vectorize and embed individual documents
4. Store the vectors (PineconeDB)

## Search

1. Embed the query
2. Query the PineconeDB for similar vectors
3. Extract metadata of similar vectors
4. Feed metadata into OpenAI prompt

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.