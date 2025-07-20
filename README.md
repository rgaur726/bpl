# 🏏 BPL Auction System

A real-time cricket auction platform built with Next.js, Supabase, and TypeScript. Experience the thrill of live player bidding with instant updates across multiple interfaces.

## ✨ Features

### 🎯 Multi-Interface Design
- **Admin Panel**: Complete auction control and management
- **Live Viewer**: Real-time auction monitoring for spectators
- **Captain Interfaces**: Dedicated bidding panels for each team captain

### 🔄 Real-Time Synchronization
- **Instant Updates**: All pages update simultaneously when players are sold
- **Multi-Layer Sync**: Postgres subscriptions + Broadcasting + Polling fallback
- **Live Data**: Purse tracking, player counts, and bid updates in real-time

### 💰 Dynamic Team Management
- **Smart Purse System**: Automatic deduction on player purchases
- **Player Counting**: Live tracking of "Players X of 12" format
- **Team Assignment**: Seamless player allocation to winning teams

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rgaur726/bpl.git
   cd bpl
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   Run the provided SQL migration in your Supabase SQL editor:
   ```sql
   -- See database-migration.sql for the complete schema
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

6. **Access the application**
   - Admin Panel: `http://localhost:3000/admin`
   - Live Viewer: `http://localhost:3000/viewer`
   - Thakur XI Captain: `http://localhost:3000/captain/thakur`
   - Gabbar XI Captain: `http://localhost:3000/captain/gabbar`

## 🎮 How to Use

### 🎯 Admin Panel (`/admin`)
The control center for managing the entire auction:

**Button Functions:**
- **Next Player** (Blue): Randomly selects an unsold player for auction
- **Close Bid** (Green): Sells the player to the highest bidder
- **Reset Bid** (Yellow): Clears current bid without selling player
- **Reset Auction** (Red): Restarts entire auction, removes all players from teams

**Button Logic:**
- Close Bid: Only enabled when there's an active player with bids
- Next Player: Disabled during active bidding, enabled when ready for new player
- Reset Bid: Only enabled when there's an active player

### 👥 Captain Interfaces (`/captain/thakur` & `/captain/gabbar`)
Dedicated bidding panels for team captains:

**Features:**
- **Bidding Buttons**: +₹100 and +₹500 increment options
- **Team View**: Your team's players and remaining purse
- **Opponent View**: Monitor competitor's team and spending
- **Live Updates**: Instant synchronization with admin actions

### 📺 Live Viewer (`/viewer`)
Spectator interface for auction monitoring:

**Features:**
- **Read-Only View**: Watch the auction without bidding capability
- **Real-Time Updates**: Live player sales and team changes
- **Team Overview**: Track both teams' progress and purses
- **Player Grid**: Visual representation of auction status

## 🏗️ Technical Architecture

### 🗄️ Database Schema
- **Teams Table**: `team_name`, `purse`, `player_count`
- **Players Table**: 24 players with `sold`, `team`, `sold_amount` fields
- **Auction State**: `active_player_index`, `current_bid`, `last_bidder`

### 🔄 Real-Time System
1. **Primary**: Supabase Postgres Changes subscriptions
2. **Secondary**: Custom broadcast messaging between pages
3. **Fallback**: 5-second polling for guaranteed synchronization

### 🎨 UI Framework
- **Next.js 15.2.4**: React framework with App Router
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Modern component library
- **TypeScript**: Type-safe development

## 📊 Game Flow

1. **Setup**: Admin resets auction, teams have ₹50,000 each
2. **Player Selection**: Admin clicks "Next Player" to start bidding
3. **Bidding Phase**: Captains place bids using increment buttons
4. **Sale**: Admin clicks "Close Bid" to sell to highest bidder
5. **Updates**: All interfaces update instantly with new team data
6. **Repeat**: Continue until all 24 players are sold

## 🎯 Key Features

### Real-Time Synchronization
- **Instant Updates**: Player sales reflect immediately across all 4 pages
- **Purse Management**: Automatic deduction and live balance updates
- **Player Counting**: Dynamic "Players X of 12" display
- **Bid Tracking**: Live current bid and last bidder information

### Smart Button States
- **Context-Aware**: Buttons enable/disable based on auction state
- **Prevent Errors**: Guards against invalid actions
- **Visual Feedback**: Clear indication of available actions

### Professional UX
- **Gradient Themes**: Distinct visual identity for each interface
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error messages and validation
- **Accessibility**: Keyboard navigation and screen reader support

## 🔧 Development

### Project Structure
```
bpl/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel interface
│   ├── viewer/            # Live viewer interface
│   ├── captain/           # Captain bidding interfaces
│   └── teams/             # Team overview page
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and clients
└── public/               # Static assets
```

### Key Files
- `lib/supabaseClient.ts`: Database connection configuration
- `lib/teamPurse.ts`: Team data management functions
- `hooks/useActivePlayer.tsx`: Real-time auction state management
- `components/auction-cards.tsx`: Reusable auction UI components

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms
The app can be deployed on any platform supporting Next.js:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Supabase](https://supabase.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Ready to experience the thrill of live cricket auctions?** 🏏  
Start your auction now and watch teams build their squads in real-time!