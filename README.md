# Inventory Management System

A modern inventory management system built with React, Vite, and Supabase. This application helps you track products, manage stock levels, and monitor inventory across multiple warehouses.

## Features

- **Product Management**: Add, view, and manage products
- **Stock Tracking**: Monitor stock levels and get low stock alerts
- **Warehouse Management**: Track inventory across multiple locations
- **User Authentication**: Secure login and logout functionality
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/inventory-system.git
   cd inventory-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Copy the contents from `.env.example` to `.env`
   - Fill in your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The app will be available at `http://localhost:5173`

## Tech Stack

- **Frontend**: React 18
- **Styling**: CSS Modules
- **Build Tool**: Vite
- **Authentication & Database**: Supabase
- **Icons**: React Icons

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── supabase/      # Supabase configuration
└── App.jsx        # Main application component
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
