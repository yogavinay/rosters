# Andhra Rosters - Premium Livestock Marketplace

A comprehensive e-commerce platform for buying and selling livestock, built with modern web technologies. The marketplace specializes in premium quality roosters, hens, eggs, chicks, dogs, cows, buffalos, sheep, and goats.

## 🚀 Features

### Core Functionality
- **Multi-Role Authentication**: Support for Buyers, Sellers, and Admins
- **Product Listings**: Rich product pages with multiple images, descriptions, and pricing
- **Shopping Cart**: Persistent cart with localStorage integration
- **Secure Payments**: Razorpay integration for seamless transactions
- **Order Management**: Complete order lifecycle from placement to delivery
- **Commission System**: 5% platform commission on all sales

### User Dashboards
- **Buyer Dashboard**: Order history and tracking
- **Seller Dashboard**: Product management, sales analytics, earnings tracking
- **Admin Dashboard**: Platform oversight, commission tracking, order management

### Categories Supported
- 🐔 **Roosters** - Fighting cocks and breeding stock
- 🐔 **Hens** - Breeding hens and layers
- 🥚 **Eggs** - Fertile eggs for hatching
- 🐥 **Chicks** - Baby chicks for farming
- 🐕 **Dogs** - Working and companion dogs
- 🐄 **Cows** - Dairy and beef cattle
- 🐃 **Buffalos** - Water buffalos for milk/meat
- 🐑 **Sheep** - Wool and meat production
- 🐐 **Goats** - Meat and milk goats

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router for server-side rendering and routing
- **React 18** - UI library with modern hooks for building interactive components
- **TypeScript** - Type-safe JavaScript for improved code quality and developer experience
- **Tailwind CSS** - Utility-first CSS framework for responsive and efficient styling
- **Lucide React** - Modern icon library for consistent UI elements
- **clsx & tailwind-merge** - Utility libraries for conditional and merged CSS class handling

### Backend & Database
- **Firebase Authentication** - User authentication with custom claims for role-based access
- **Firestore** - NoSQL cloud database for storing users, products, orders, and notifications
- **Firebase Admin SDK** - Server-side Firebase operations for secure backend tasks
- **Next.js API Routes** - Serverless functions for handling API requests and business logic
- **NextAuth.js** - Authentication framework integrated with Firebase for session management

### Services & Integrations
- **Cloudinary** - Cloud-based image upload, storage, optimization, and delivery
- **Razorpay** - Payment gateway for secure Indian transactions and webhooks
- **bcryptjs** - Password hashing library for secure user credential storage
- **qrcode** - QR code generation library for payment verification or other features

### Development Tools
- **ESLint** - Code linting tool for maintaining code quality and consistency
- **PostCSS** - CSS processing tool for transforming stylesheets
- **Autoprefixer** - Tool for adding vendor prefixes to CSS rules automatically
- **TypeScript Compiler** - Type checking and compilation for TypeScript code

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── cart/              # Shopping cart page
│   ├── checkout/          # Payment checkout
│   ├── dashboard/         # Role-based dashboards
│   ├── products/          # Product listing and details
│   ├── sell/              # Product creation page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
├── context/               # React Context providers
├── lib/                   # Utility libraries
├── models/                # Data models (Firestore)
└── public/                # Static assets
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project
- Cloudinary account
- Razorpay account

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd andhra-live-stock
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Generate a service account key for admin SDK
   - Update environment variables

4. **Set up Cloudinary**
   - Create a Cloudinary account
   - Get your cloud name, API key, and secret
   - Update environment variables

5. **Set up Razorpay**
   - Create a Razorpay account
   - Get your key ID and secret
   - Update environment variables

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## 🎯 Key Functionalities

### User Authentication
- Registration with role selection (Buyer/Seller)
- Firebase Auth integration with custom claims
- Session management with HTTP-only cookies
- Protected routes with middleware

### Product Management
- Image upload to Cloudinary
- Category-based filtering
- Stock management
- Product CRUD operations
- Seller-specific product listings

### Shopping Experience
- Category browsing on homepage
- Product search and filtering
- Detailed product pages
- Add to cart functionality
- Persistent cart with localStorage

### Payment & Orders
- Razorpay payment integration
- Order creation and verification
- Stock reduction on successful payment
- Order status tracking
- Commission calculation (5% platform fee)

### Dashboard Features
- **Admin**: View all orders, track commissions, platform analytics
- **Seller**: Add products, view sales, track earnings (95% of sale)
- **Buyer**: View order history, track deliveries

## 🔒 Security Features

- Firebase Authentication with email/password
- Session cookie verification
- Role-based access control
- Image upload validation
- Payment signature verification
- Protected API routes

## 📊 Database Schema

### Users Collection
```typescript
{
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Products Collection
```typescript
{
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  weight?: string;
  stock: number;
  active: boolean;
  sellerId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Orders Collection
```typescript
{
  buyerId: string;
  items: Array<{
    productId: string;
    sellerId: string;
    quantity: number;
    priceAtPurchase: number;
  }>;
  totalAmount: number;
  commissionAmount: number;
  sellerEarnings: number;
  status: 'pending' | 'paid';
  orderId: string; // Razorpay order ID
  paymentId?: string;
  shippingAddress: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- Ensure Node.js 18+ runtime
- Set all environment variables
- Configure build command: `npm run build`
- Configure start command: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ for the Andhra Pradesh livestock community**#   a n d h r a - l i v e - s t o c k 
 
 #   l i v e - m a r k e t  
 #   l i v e - m a r k e t  
 