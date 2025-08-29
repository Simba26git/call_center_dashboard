# Call Center Management System

A modern, production-grade call center frontend application built with Next.js 15, React, and TypeScript. This comprehensive system provides tools for agents, supervisors, and administrators to manage customer interactions, tickets, orders, and analytics.

## 🚀 Features

### 📞 Core Call Center Functionality
- **Softphone Integration**: Built-in softphone panel with dial pad and call controls
- **Customer Management**: Complete customer profiles with interaction history
- **Ticket Management**: Create, track, and resolve customer support tickets
- **Order Management**: View and manage customer orders
- **Real-time Dashboard**: Live metrics and analytics for performance monitoring

### 👥 User Management System
- **Role-based Access Control**: Root, Manager, and Employee roles with specific permissions
- **Employee Self-Service**: Profile management, password changes, and customization
- **Manager Dashboard**: Team oversight and employee management tools
- **Permission Management**: Granular control over application access

### 🎨 Customization & Theming
- **Theme Support**: Light, Dark, and System themes
- **Responsive Design**: Optimized for desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

### 🔗 Integrations
- **Microsoft Azure Authentication**: Secure login with Microsoft accounts
- **Third-party Integrations**: Slack, Asana, HubSpot, Salesforce support
- **n8n Workflow Automation**: Built-in automation capabilities
- **REST API**: Complete backend API for all operations

### 📊 Analytics & Reporting
- **Interactive Charts**: Built with Recharts for data visualization
- **Performance Metrics**: Real-time agent and team performance tracking
- **Custom Reports**: Generate detailed analytics reports
- **Export Capabilities**: Data export for external analysis

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.2.4**: React framework with App Router
- **React 19**: Latest React features and improvements
- **TypeScript**: Type-safe development
- **Tailwind CSS v4**: Utility-first CSS framework
- **shadcn/ui**: Modern React component library

### UI Components
- **Radix UI**: Accessible component primitives
- **Lucide React**: Beautiful icon library
- **Recharts**: Interactive chart library
- **Framer Motion**: Animation library

### Authentication & Security
- **Microsoft Authentication Library (MSAL)**: Azure AD integration
- **JWT**: Secure token-based authentication
- **Role-based permissions**: Granular access control

### Development Tools
- **ESLint**: Code linting and quality
- **PostCSS**: CSS processing
- **Geist Font**: Modern typography

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd call_center
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   Configure your environment variables:
   - Azure AD credentials
   - API endpoints
   - Database connections

4. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🚦 Usage

### Getting Started
1. **Login**: Use your Microsoft account or configured authentication
2. **Dashboard**: Access the main dashboard for overview metrics
3. **Navigation**: Use the sidebar to access different modules
4. **Settings**: Customize your experience in the settings panel

### User Roles

#### Root Account (System Administrator)
- Full system access and user management
- Subscription and billing management
- Global settings and configuration
- Manager account creation

#### Manager Account
- Team management and oversight
- Employee account creation
- Permission assignment
- Department analytics

#### Employee Account
- Customer interaction tools
- Ticket and order management
- Personal settings and customization
- Assigned application access

## 📁 Project Structure

```
call_center/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── customers/         # Customer management
│   ├── orders/            # Order management
│   ├── tickets/           # Ticket system
│   ├── reports/           # Analytics & reports
│   └── settings/          # User settings
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── auth/             # Authentication components
│   ├── customers/        # Customer components
│   ├── orders/           # Order components
│   ├── tickets/          # Ticket components
│   ├── reports/          # Report components
│   └── softphone/        # Softphone components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── types/                # TypeScript definitions
├── styles/               # Global styles
└── public/               # Static assets
```

## 🔧 Configuration

### Theme Customization
The application supports extensive theming through CSS custom properties and Tailwind CSS configuration.

### Environment Variables
Required environment variables:
- `NEXT_PUBLIC_AZURE_CLIENT_ID`: Azure AD application ID
- `NEXT_PUBLIC_AZURE_TENANT_ID`: Azure AD tenant ID
- `API_BASE_URL`: Backend API base URL

### API Integration
The application includes a comprehensive API layer for:
- User authentication and management
- Customer data operations
- Ticket and order management
- Analytics and reporting
- Integration with external services

## 🧪 Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Code Quality
- TypeScript for type safety
- ESLint configuration for code quality
- Component-based architecture
- Responsive design principles

## 📈 Performance

- **Server-side Rendering**: Optimized initial page loads
- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: Intelligent caching strategies

## 🔒 Security

- **Authentication**: Microsoft Azure AD integration
- **Authorization**: Role-based access control
- **Data Protection**: Secure API communication
- **Session Management**: Secure token handling

## 🌟 Key Features Highlight

### Customer Management
- Complete customer profiles with contact information
- Interaction history tracking
- Customer verification tools
- Integrated communication tools

### Ticket System
- Create and track support tickets
- Priority and status management
- Assignment and routing
- Resolution tracking

### Analytics Dashboard
- Real-time performance metrics
- Interactive charts and graphs
- Custom date range filtering
- Export capabilities

### Integrations
- Slack notifications
- Asana task management
- HubSpot CRM integration
- Salesforce connectivity

## 📞 Support & Contact

**Developer**: Simabarashe Gunundu  
**Phone**: +263778142466  
**Email**: s.gunundu00@gmail.com

For technical support, feature requests, or customization inquiries, please contact the developer directly.

## 📄 License

This project is proprietary software developed by Simabarashe Gunundu. All rights reserved.

---

**Built with ❤️ by Simabarashe Gunundu**

*A modern call center solution designed for efficiency, scalability, and user experience.*
