# 🌿 Seasons Change

A premium, characterful dashboard that dynamically transforms its atmosphere, colors, and content based on the current season and selected geographical location.

[![Built with React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Styled with Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Built with TanStack](https://img.shields.io/badge/TanStack_Router-FF4154?style=for-the-badge&logo=tanstack&logoColor=white)](https://tanstack.com/router)

## ✨ Features

- **🍂 Dynamic Seasonal Theming**: The entire UI automatically shifts its color palette (Spring, Summer, Autumn, Winter) using advanced OKLCH color spaces.
- **🌥️ Real-time Weather**: Integrated Tomorrow.io API providing live weather updates for the selected country's capital.
- **🗺️ Global Insights**: Instant access to country data including native names, population, timezones, and geographic area.
- **📅 Continuous Calendar**: A unique, scrollable year-view calendar with month quick-navigation and interactive day tiles.
- **🎨 Premium Aesthetics**:
  - **Glassmorphism**: Sophisticated backdrop blurs and subtle translucent borders.
  - **Mesh Backgrounds**: Animated, seasonal gradient textures that react to your presence.
  - **Motion Design**: Staggered entry animations and smooth micro-interactions.
- **🌏 Hemisphere Aware**: Automatically detects and adjusts the season definition based on the selected country's hemisphere (Northern vs. Southern).

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS)
- [pnpm](https://pnpm.io/) or [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/seasons-change.git
   cd seasons-change
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your Tomorrow.io API key:
   ```env
   VITE_WEATHER_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   pnpm dev
   ```

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) + [PostgreSQL](https://www.postgresql.org/)
- **State Management**: [React Context](https://react.dev/learn/passing-data-deeply-with-context)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linting & Formatting**: [Biome](https://biomejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/)

## 🤖 CI/CD and Automation

This project uses **GitHub Actions** for automated quality gates and **Dependabot** for dependency management.

- **Quality Pipeline**: On every pull request and push to `main`, the following checks are run:
  - **Linting**: Verified via Biome.
  - **Type Safety**: Verified via TypeScript `tsc --noEmit`.
  - **Unit Tests**: Executed via Vitest.
  - **Build Verification**: Ensures the production bundle can be successfully created.
- **Dependency Updates**: Weekly automated scanning via Dependabot.

## 📐 Development Standards

We adhere to the **Code Simplification** principle:
- **Clarity over Cleverness**: We prefer readable code over compact or "clever" implementations.
- **Chesterton's Fence**: We ensure we understand why code exists before refactoring it.
- **Automated Enforcement**: All standards are enforced via CI/CD.

## 🎨 Design Philosophy

*Seasons Change* is built on the principle of **Atmospheric UI**. Instead of a static interface, the application breathes with the natural world. 

- **Typography**: Uses **Syne** for impactful, characterful headings and **Outfit** for clean, modern readability.
- **Texture**: Subtle SVG noise overlays provide a tactile, high-end feel.
- **Color**: Leverages `oklch` for perceptually uniform colors that maintain consistent contrast across light and dark modes.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
