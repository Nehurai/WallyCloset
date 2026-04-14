# WallyCloset

WallyCloset is a smart wardrobe web app built with React, TypeScript, Vite, and Firebase. It helps users manage their closet, upload clothing items, request swaps, and discover outfit recommendations.

## Features

- Firebase authentication and protected routes
- Closet gallery with search and category filters
- Clothing upload with image preview
- Profile page with editable user details
- Swap request flow and swap tracking
- Wishlist and coupons pages
- Toast notifications for key actions
- Content-based outfit and swap recommendations
- Gen AI-ready clothing description generation

## ML / Recommendation Side

The app uses a content-based recommendation system for suggesting outfits and swaps.

Each clothing item is represented as a feature vector made from:

- Category, such as shirt, jeans, dress, or winter wear
- Color, such as blue, black, white, or green
- Tags, such as casual, denim, formal, or party

The recommendation engine compares items using similarity matching:

- Category compatibility, such as Top with Bottom
- Color matching rules
- Shared tag similarity

For example:

```text
Blue casual shirt -> [tops, blue, casual]
Black casual jeans -> [bottoms, black, casual]
```

The app ranks matching items by score and displays the best outfit or swap suggestions in the closet UI.


Short answer:

```text
I used a content-based recommendation system for suggesting outfits and swaps.
```

Detailed answer:

```text
Each clothing item is represented as a feature vector using category, color, and tags.
For example, a blue casual shirt becomes [tops, blue, casual]. I compare these
feature vectors using similarity matching, then rank items based on category
compatibility, color pairing, and shared tags.
```

System design:

- Data representation: category, color, and tags are converted into a feature vector
- Similarity calculation: items receive scores from category compatibility, color rules, and tag overlap
- Outfit recommendation: the app selects a base item, filters compatible categories, and ranks suggestions
- Swap recommendation: the same approach can compare items across users by preference and item attributes
- Future upgrade: one-hot encoding and cosine similarity can replace the current scoring function

## Gen AI Description Feature

When a user uploads a clothing item, the app can generate a stylish description automatically from the item name, category, color, and tags.

The frontend uses a Gen AI service wrapper:

- If `VITE_GENAI_DESCRIPTION_ENDPOINT` is configured, the app sends the item metadata to that backend endpoint.
- If no endpoint is configured, the app uses a local demo generator so the feature still works during demos.
- The generated description is saved as the clothing item's `notes` and appears in the item detail modal.

Interview explanation:

```text
I integrated a Gen AI-ready description generator. When a user uploads an item,
the app builds a prompt from item metadata like name, category, color, and tags.
In production, this prompt should be sent to a secure backend API connected to a
Gen AI model. The frontend does not expose any API key.
```

## Tech Stack

- React 19
- TypeScript
- Vite
- Firebase Authentication
- Firebase Firestore
- React Router
- React Hot Toast
- ESLint

## Setup

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Run lint checks:

```bash
npm run lint
```

Build the app:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Main Folders

```text
src/components   Reusable UI components
src/context      Auth, clothing, and swap state providers
src/pages        App pages
src/styles       CSS files
src/utils        Recommendation and Gen AI helper logic
functions        Firebase Cloud Functions
```

## Author

Neha Kumari Rai
