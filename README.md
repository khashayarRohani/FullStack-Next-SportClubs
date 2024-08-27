This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## About Project

I actually do not have any authentication but I used som Authorisatuon as it was possible

each users have a dashboard an there, they can delete account , edit account or create posts. also some Info about user like name, bio and profile picture and also count of posts that user created.

posts are editable but only the creator can edit it.
users can delete or like or add comment on the posts
for commenting , i check if the user is registered , then user can leave a comment

for getting image as URL , there is a client side component which interact with supabase storage to insert or select images.
in my serverside a put a input tag which is type hidden to get the value from my clientside ImageUploading component.

navigation bar is dynamically change due to screen size, items moves into select tag when screen size is reduced.

in localhost envoirment everything works in the best way it can be, but after deploying on vercel , my posts pages on desktop Chrome looks weird and the CSS which is related to this page was damaged, part of CSS works with no issues but other part faced damaged and changes.

other challenge which made me learn so many things was Images, I learn so much things about Images's attribute in Next.js even I learn how to recognise the type of browser for dep;oying different type of classes or anything else.

in this project I start to write comments and docummentaion for better understanding and make the code more clean.

##Tables:

here is my tables creating cpmmands:
CREATE TABLE IF NOT EXISTS Users (
id SERIAL PRIMARY KEY,
username VARCHAR(50) UNIQUE NOT NULL,
profile_picture_url TEXT,
bio TEXT
);

    CREATE TABLE IF NOT EXISTS Categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT
    );

    CREATE TABLE IF NOT EXISTS UserCategories (
        user_id INT REFERENCES Users(id) ON DELETE CASCADE,
        category_id INT REFERENCES Categories(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, category_id)
    );

    CREATE TABLE IF NOT EXISTS Posts (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES Users(id) ON DELETE CASCADE,
        category_id INT REFERENCES Categories(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        content_picture_url VARCHAR(255),
        like_count INT DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS Comments (
        id SERIAL PRIMARY KEY,
        post_id INT REFERENCES Posts(id) ON DELETE CASCADE,
        user_id INT REFERENCES Users(id) ON DELETE CASCADE,
        content TEXT NOT NULL
    );
