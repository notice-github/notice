# Notice

**Your platform for creating blogs, docs, portfolios, and more.**

Notice is a versatile content creation and publishing platform, now available for you to self-host. Take full control of your content and infrastructure. This monorepo contains everything you need to get started.

## ✨ Key Features

*   📝 **Collaborative Editor:** Work together in real-time.
*   🌍 **Auto-Translate:** Reach a global audience (100+ languages).
*   🤖 **AI Writing Assistant:** Enhance your content creation.
*   🔗 **Embed Anywhere:** Integrate content across the web.
*   📄 **Templates:** Quick start for blogs, docs, portfolios, etc.
*   🔍 **SEO Friendly:** Optimize for discoverability.

## 🛠 Prerequisites

*   Node.js 18+ ([download](https://nodejs.org/en/download/))
*   Docker ([get Docker](https://docs.docker.com/get-docker/))
*   Doppler CLI ([install](https://docs.doppler.com/docs/install-cli)) & logged in (`doppler login`)
*   PNPM v8.5 ([install](https://pnpm.io/installation))

## 🔐 Environment variables

Notice uses [Doppler](https://doppler.com) to manage environment variables. You can find the list of variables you need to set in each app's `README.md` file.

## 🚀 Quick Start

1.  **Install Dependencies:**
    ```sh
    pnpm install
    ```
2.  **Start Docker Containers:**
    ```sh
    pnpm run docker:up
    ```
3.  **Start Development Server:**
    ```sh
    pnpm run dev
    ```

    Access your instance, typically at `http://localhost:3000` (confirm port if different).

## 🛑 Troubleshooting

*   **Issue?** First try: `pnpm install`
*   **HMR Infinite Reload?** Likely a recursive import. Check your code.
*   **Other Issues?** Please report on [GitHub Issues](https://github.com/YOUR_REPO_HERE/issues) (Replace with your actual repo link).

## 💳 Stripe Integration

For testing monetization features:

1.  Install Stripe CLI & login: `stripe login`
2.  Listen for webhooks: `stripe listen --forward-to localhost:3001/webhooks/stripe` (adjust port if needed)
3.  Use test card: `4242 4242 4242 4242`

## 📜 License

Notice is distributed under a license designed to protect project IP while allowing self-hosting and community use (inspired by fair-code principles).

➡️ Please see the full `LICENSE` file in this repository for complete terms.

## 💬 Support & Community

*   **GitHub Issues:** For bug reports, feature requests, and questions. (Replace with your actual repo link)

We encourage a respectful and collaborative community!

