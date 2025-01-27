# AlfaBeta - Link Shortener

Welcome to the Link Shortener project! This application allows you to shorten long URLs, manage your shortened links, and view detailed statistics about their usage.

The Link Shortener is hosted at [alfabeta.dk](https://alfabeta.dk).

## Table of Contents

- [AlfaBeta - Link Shortener](#alfabeta---link-shortener)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Usage](#usage)
    - [Shortening a URL](#shortening-a-url)
    - [Managing Links](#managing-links)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
    - [Viewing Statistics](#viewing-statistics)
  - [Development](#development)
    - [Folder Structure](#folder-structure)
    - [Adding New Features](#adding-new-features)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **URL Shortening**: Convert long URLs into short, easy-to-share links.
- **Custom Slugs**: Create custom slugs for your shortened URLs.
- **Expiry Dates**: Set expiry dates for your links.
- **QR Code Generation**: Generate QR codes for your shortened URLs.
- **Link Management**: Enable, disable, and delete your links.
- **Statistics**: View detailed statistics about link usage, including total clicks, desktop vs. mobile clicks, and daily click data.

## Usage

### Shortening a URL

1. **Enter the long URL**: In the "Shorten URL" tab, enter the URL you want to shorten.
2. **Select a domain**: Choose a domain for your short link.
3. **Custom slug (optional)**: Enter a custom slug for your short link.
4. **Set expiry date (optional)**: Pick an expiry date for your link.
5. **Click "Shorten URL"**: Your short link will be generated and displayed.

### Managing Links

1. **View your links**: Navigate to the "History & Stats" tab to see all your shortened links.
2. **Enable/Disable links**: Use the switch to enable or disable a link.
3. **Copy link**: Click the copy button to copy the short link to your clipboard.
4. **Delete link**: Click the trash icon to delete a link.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) (v6 or higher)
- [Supabase](https://supabase.io/) account and project

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/link-shortener.git
   cd link-shortener
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   Create a `.env.local` file in the root directory and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to see the application in action.

### Viewing Statistics

1. **Navigate to the "History & Stats" tab**: Here, you can see detailed statistics for each link.
2. **View click data**: See total clicks, desktop vs. mobile clicks, and daily click data.

## Development

### Folder Structure

```
link-shortener/
├── components/       # Reusable UI components
├── pages/            # Next.js pages
├── public/           # Static assets
├── styles/           # Global styles
├── utils/            # Utility functions
├── .env.local        # Environment variables
├── package.json      # Project dependencies
└── README.md         # Project documentation
```

### Adding New Features

1. **Create a new branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Implement your feature**: Add your code and tests.
3. **Commit your changes**:

   ```bash
   git commit -m "Add feature: your feature name"
   ```

4. **Push your branch**:

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a pull request**: Open a pull request on GitHub to merge your changes.

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.