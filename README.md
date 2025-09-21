# Travel Itinerary Generator

A modern Next.js application that uses Google's Gemini AI to generate personalized travel itineraries with beautiful UI and comprehensive travel planning features.

## ✨ Features

- 🤖 **AI-Powered Itinerary Generation** - Uses Google Gemini AI to create personalized travel plans
- 📍 **Smart Travel Planning** - Considers budget, age group, preferences, and travel duration
- 🏨 **Accommodation Recommendations** - Suggests hotels and places to stay
- 🍽️ **Food Suggestions** - Recommends local dishes and restaurants
- 🚗 **Transportation Guidance** - Provides travel suggestions between activities
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Built with Tailwind CSS and Radix UI components
- 🔒 **Type Safety** - Full TypeScript support throughout the application

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_API_URL=http://localhost:9002
   ```

4. **Get your Gemini API key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env.local` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Run Genkit development server** (for AI flows)
   
   In a separate terminal:
   ```bash
   npm run genkit:dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Generating an Itinerary

1. Navigate to the **Itinerary** page (`/itinerary`)
2. Fill in your travel preferences:
   - **Current Location** - Your starting point
   - **Destination** - Where you want to go
   - **Number of Days** - Trip duration
   - **Number of People** - Travel group size
   - **Budget** - Budget range (Budget-friendly, Mid-range, Luxury)
   - **Age Group** - Select appropriate age group
   - **Preferences & Interests** - Describe what you love to do
3. Click **"Generate Itinerary"**
4. Wait for AI to create your personalized plan
5. Review your itinerary with daily activities, accommodations, and food suggestions

### Features Overview

- **Dashboard** (`/dashboard`) - Overview of your travel plans
- **Discover** (`/discover`) - Explore destinations and points of interest
- **Bookings** (`/bookings`) - Manage your travel bookings
- **Profile** (`/profile`) - User profile and settings

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **AI**: Google Gemini AI via Genkit
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Forms**: React Hook Form with Zod validation
- **Language**: TypeScript
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── ai/                          # AI configuration and flows
│   ├── flows/                   # AI flow definitions
│   │   ├── discover-pois.ts     # Points of interest discovery
│   │   └── generate-personalized-itinerary.ts
│   ├── dev.ts                   # Development AI setup
│   └── genkit.ts               # Genkit configuration
├── app/                        # Next.js app directory
│   ├── bookings/               # Bookings page
│   ├── dashboard/              # Dashboard page
│   ├── discover/               # Discover page
│   ├── itinerary/              # Itinerary generator
│   │   ├── itinerary-form.tsx  # Main form component
│   │   └── page.tsx            # Page component
│   ├── login/                  # Login page
│   ├── profile/                # Profile page
│   ├── signup/                 # Signup page
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                 # Reusable components
│   ├── ui/                     # UI component library
│   ├── app-layout.tsx          # App layout wrapper
│   └── icons.tsx               # Icon components
├── hooks/                      # Custom React hooks
├── lib/                        # Utility libraries
│   ├── auth.ts                 # Authentication utilities
│   ├── data.ts                 # Data utilities
│   ├── firebase.ts             # Firebase configuration
│   ├── utils.ts                # General utilities
│   └── placeholder-images.ts   # Image utilities
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit with watch mode

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GENAI_API_KEY` | Your Google Gemini API key | Yes |
| `NEXT_PUBLIC_API_URL` | API base URL | No |

## 🚨 Troubleshooting

### Common Issues

**API Key Issues**
- Ensure your `.env.local` file is in the root directory
- Verify your Gemini API key is valid and has sufficient quota
- Check that the environment variable name is exactly `GOOGLE_GENAI_API_KEY`

**Build Issues**
- Run `npm install` to ensure all dependencies are installed
- Clear `.next` folder and rebuild if needed
- Check for TypeScript errors with `npm run typecheck`

**Development Issues**
- Make sure both `npm run dev` and `npm run genkit:dev` are running
- Check browser console for any JavaScript errors
- Verify all environment variables are properly set

### Getting Help

If you encounter issues:

1. Check the browser console for error messages
2. Verify your API key is correctly configured
3. Ensure all dependencies are installed
4. Check the terminal for any build or runtime errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for powerful AI capabilities
- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for beautiful styling
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [Genkit](https://firebase.google.com/docs/genkit) for AI workflow management

---

**Happy Traveling! ✈️🌍**