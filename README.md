# SwissUA - Ukrainian Community in Switzerland

![SwissUA Logo](/public/logo.png)

## 🌟 About

SwissUA is a platform for the Ukrainian community in Switzerland. It serves as a directory of Ukrainian services, events, and resources to help Ukrainians living in Switzerland connect with each other and find the support they need.

The platform includes:

- A directory of Ukrainian service providers across Switzerland
- Canton-based location filtering
- Search functionality
- Categories for easy navigation

## 🚀 Key Features

- **Service Directory**: Browse Ukrainian businesses and service providers across Switzerland
- **Search & Filter**: Find services by category, canton, postal code, or keywords
- **Modern UI**: Clean, responsive design with a focus on usability
- **Canton System**: Services organized by Swiss cantons with detailed location information
- **Multilingual Support**: Interface available in Ukrainian with plans for additional languages

## 💻 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15.x
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 4.x with custom design system
- **UI Components**: Custom components built with Radix UI primitives
- **Icons**: [Lucide React](https://lucide.dev/) for iconography
- **Data Management**: Currently using mock data with plans for a backend integration

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/swissua.git
cd swissua
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## 📂 Project Structure

```
swissua/
├── app/                 # Next.js app directory
│   ├── components/      # App-specific components
│   ├── services/        # Services directory and related components
│   ├── utils/           # Utility functions
│   ├── globals.css      # Global styles
│   └── page.tsx         # Homepage
├── components/          # Shared components
│   └── ui/              # UI component library
├── lib/                 # Utility libraries
├── public/              # Static assets
└── README.md            # This file
```

## 🌐 Feature Roadmap

- **User Authentication**: Allow service providers to manage their listings
- **Backend Integration**: Move from mock data to a proper backend
- **Rating & Reviews**: Enable community reviews for services
- **Events Calendar**: Community events integration
- **Translation**: Full multilingual support
- **Mobile App**: Native app development

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For questions and support, please reach out to [your-email@example.com](mailto:your-email@example.com).

---

Built with ❤️ for the Ukrainian community in Switzerland.

## Phone Verification System

The platform includes a comprehensive phone verification system with the following features:

### Supported Countries

- **European Union Countries**: All 27 EU member states
- **Ukraine (+380)**: Non-EU supported country
- **United Kingdom (+44)**: Non-EU supported country

**Full list of supported countries:**

- Austria (+43), Belgium (+32), Bulgaria (+359), Croatia (+385), Cyprus (+357)
- Czech Republic (+420), Denmark (+45), Estonia (+372), Finland (+358), France (+33)
- Germany (+49), Greece (+30), Hungary (+36), Ireland (+353), Italy (+39)
- Latvia (+371), Lithuania (+370), Luxembourg (+352), Malta (+356), Netherlands (+31)
- Poland (+48), Portugal (+351), Romania (+40), Slovakia (+421), Slovenia (+386)
- Spain (+34), Sweden (+46), Switzerland (+41), Ukraine (+380), United Kingdom (+44)

### Blocked Countries

- **Russian Federation (+7)**: Not supported due to platform restrictions

### Features

- **Russian Number Blocking**: Automatically detects and blocks Russian phone numbers (+7)
- **Alternative Options**: When a Russian number is detected, users are presented with options to:
  - Use a Swiss phone number (+41)
  - Use a Ukrainian phone number (+380)
  - Use a British phone number (+44)
  - Delete their profile
- **Format Validation**: Validates phone number formats for supported countries
- **Multi-layer Protection**: Phone validation is implemented at multiple levels:
  - Client-side validation in the UI
  - API endpoint validation
  - Authentication context validation

### Implementation Details

#### Phone Validation Utility (`app/utils/phoneValidation.ts`)

- `validatePhoneNumber()`: Validates phone numbers and returns detailed results
- `formatPhoneNumber()`: Formats phone numbers for display
- `SUPPORTED_COUNTRIES`: Constants for supported countries
- `BLOCKED_COUNTRIES`: Constants for blocked countries

#### API Endpoints

- `/api/send-otp`: Sends OTP with phone validation
- `/api/verify-otp`: Verifies OTP with phone validation
- `/api/delete-user`: Deletes user account (used when Russian number is blocked)

#### UI Components

- Phone verification page with country code selection
- Russian blocking screen with alternative options
- Form validation and error handling

### Usage

When a user attempts to verify a phone number:

1. **Valid Numbers**: All EU countries, Ukraine (+380), and UK (+44) numbers proceed normally
2. **Russian Numbers**: Users see a blocking screen with alternatives
3. **Invalid Formats**: Users receive format validation errors
4. **Profile Deletion**: Users can delete their profile if they can't use supported numbers

## Newsletter System

The platform includes a comprehensive newsletter subscription system using Resend:

### Features

- **Automatic Subscription**: Users are automatically subscribed to the newsletter during signup if they check the newsletter checkbox
- **Resend Integration**: Uses Resend's audience and contact management system
- **Contact Management**: Full CRUD operations for newsletter contacts
- **Audience Management**: Automatic audience creation and management

### API Endpoints

- `/api/newsletter/subscribe`: Add new contact to newsletter
- `/api/newsletter/unsubscribe`: Remove contact from newsletter
- `/api/newsletter/update-subscription`: Update subscription status

### Implementation Details

#### Resend Utility (`app/utils/resend.ts`)

- `getOrCreateAudience()`: Creates or retrieves newsletter audience
- `addContactToNewsletter()`: Adds contact to newsletter audience
- `removeContactFromNewsletter()`: Removes contact from newsletter
- `updateContactSubscription()`: Updates contact subscription status

#### Integration

- **Signup Process**: Automatically subscribes users who opt-in during registration
- **Error Handling**: Newsletter subscription failures don't block user registration
- **Logging**: Comprehensive error logging for debugging

### Environment Variables

- `RESEND_API_KEY`: Your Resend API key for authentication

### Testing

You can test the newsletter functionality by visiting `/newsletter-test` in your application.
This page provides a simple interface to test subscription and unsubscription functionality.
