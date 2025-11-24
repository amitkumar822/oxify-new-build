# Oxify v2 - Mobile Application

A React Native application built with Expo, featuring a modern onboarding flow and comprehensive user experience.

## 📱 Screen Documentation

### 🚀 **Onboarding Flow**

#### 1. **Splash Screen**

- **Purpose**: App initialization and brand introduction
- **Functionality**:
  - Displays "MEET Oxify" branding with gear icon
  - Dark gradient background with decorative blue circles
  - Auto-transitions to onboarding after 2 seconds
  - Loading state for app initialization

#### 2. **Onboarding Pages (3 screens)**

- **Purpose**: User introduction and feature walkthrough
- **Functionality**:
  - Centered Oxify logo in header
  - Large circular placeholder for feature illustrations
  - 3-dot page indicator showing current progress
  - Title and description for each feature
  - Navigation controls:
    - "Skip" button (bottom left) - bypass remaining screens
    - "Next" button (bottom right) - proceed to next screen
  - Progress bar at bottom showing completion percentage
  - Smooth transitions between pages

### 🏠 **Welcome & Authentication**

#### 3. **Welcome Screen**

- **Purpose**: Post-onboarding welcome and navigation hub
- **Functionality**:
  - Oxify branding with gear icon in header
  - Welcome message with descriptive text
  - Primary action buttons:
    - "Login" button (outlined style) - existing users
    - "Signup" button (filled style) - new user registration
  - Decorative background with blue circular shapes
  - Progress indicator at bottom

#### 4. **Login Screen**

- **Purpose**: User authentication and account access
- **Functionality**:
  - Clean header with Oxify branding
  - Authentication method selection:
    - "Continue with Email" (primary option)
    - Social login integration:
      - Google sign-in option
      - Apple sign-in option
  - Legal compliance:
    - Terms & Conditions reference
    - Privacy Policy acknowledgment
  - Progress tracking at bottom

### 🔐 **Authentication Flow**

#### 5. **Email Input Screen**

- **Purpose**: Capture user email/username for login
- **Functionality**:
  - Back navigation to previous screen
  - Email/username input field with placeholder
  - "Continue" button to proceed
  - Full keyboard support
  - Input validation

#### 6. **Password Input Screen**

- **Purpose**: Secure password entry for account access
- **Functionality**:
  - Back navigation to email screen
  - Secure password input field (masked)
  - "Forgot password?" link for password recovery
  - "Submit" button for login completion
  - Full keyboard support

#### 7. **Forgot Password Flow (5 screens)**

- **Purpose**: Secure password reset process
- **Functionality**:
  - **Step 1 - Email Entry**: Input email for password reset
    - API: `POST /email_otp_generate/` to send OTP to the provided email
  - **Step 2 - Email Verification**: OTP verification for security
    - API: `POST /verify_otp/` to verify the received OTP
    - Resend functionality with 60-second cooldown timer
  - **Step 3 - New Password**: Create new password with validation requirements:
    - Password must include uppercase, lowercase, numbers, and special characters
    - 8-32 characters long requirement
    - Real-time validation feedback with checkmarks
  - **Step 4 - Confirm Password**: Re-enter password for verification
    - Password matching validation
    - API: `POST /forgot_password_change/` to update password
  - **Step 5 - Success**: Password changed confirmation with Login redirect

### 📝 **User Registration Flow**

#### 8. **Signup Flow (8 screens)**

- **Purpose**: Complete user onboarding and account creation
- **Functionality**:
  - **Step 1 - Email Entry**: Input email address for account creation
    - API: `POST /email_otp_generate/` to send OTP to the provided email
  - **Step 2 - Email Verification**: Check email confirmation dialog
    - API: `POST /verify_otp/` to verify the received OTP
  - **Step 3 - Name Input**: Enter full name with Continue button
  - **Step 4 - Health Goals**: Select multiple health/fitness goal tags:
    - Tag-based selection interface
    - Multiple selection capability
    - Personalization for app experience
    - API: `GET /list_health_goal_tag_api/` to fetch available tags
  - **Step 5 - Create Password**: Set account password with validation:
    - Password strength requirements
    - Real-time validation feedback
    - Security criteria display
  - **Step 6 - Confirm Password**: Re-enter password for verification
  - **Step 7 - Success**: Account creation confirmation with navigation to main app

### 🏠 **Main Application**

#### 9. **Chamber Selection Screen**

- **Purpose**: Select hyperbaric oxygen therapy chamber
- **Functionality**:
  - Grid layout of available chambers
  - Chamber status indicators
  - Selection interface for booking
  - "Continue" button to proceed with selection
  - Back navigation support

#### 10. **Dashboard Screen**

- **Purpose**: Main app hub and user control center
- **Functionality**:
  - User profile display with name and status
  - Inspirational quote/message section
  - Session overview and progress tracking
  - Quick action navigation icons:
    - Sessions, Profile, Settings, etc.
  - Bottom navigation bar with main app sections
  - Real-time session data integration

#### 11. **Push Notifications Screen**

- **Purpose**: Real-time notification management
- **Functionality**:
  - Live notification feed
  - Streak notifications and achievements
  - Session reminders and updates
  - Interactive notification cards
  - Notification history tracking
  - Bottom navigation integration

#### 12. **Streak & Achievement System**

- **Purpose**: User engagement and progress tracking
- **Functionality**:
  - Streak counter and achievement badges
  - Progress visualization
  - Motivational messaging
  - Achievement unlocking system
  - Historical progress tracking

#### 13. **Session Details Screen**

- **Purpose**: Comprehensive session information and controls
- **Functionality**:
  - Detailed session parameters and settings
  - Session progress tracking
  - Real-time monitoring data
  - Session control options
  - Back navigation to dashboard
  - Progress bars and status indicators

#### 14. **Notifications Center**

- **Purpose**: Centralized notification management
- **Functionality**:
  - Comprehensive notification history
  - Categorized notification types
  - Read/unread status management
  - Notification interaction options
  - Search and filter capabilities
  - Settings integration for notification preferences

### 🎯 **Session Management System**

#### 15. **Session Tracking Flow (5 screens)**

- **Purpose**: Complete hyperbaric oxygen therapy session management
- **Functionality**:

  **Screen 1 - Session Setup**:
  - ATA Level selection (atmospheric pressure configuration)
  - Purpose of Treatment selection
  - Session duration configuration (minutes/seconds)
  - Session notes and comments input
  - "Start Session" button to begin therapy

  **Screen 2 - Session Ready State**:
  - Large countdown display showing readiness
  - "3 Ready" status indicator
  - Play button to start session
  - Fast-forward controls for session management
  - Session preparation and safety checks

  **Screen 3 - Session In Progress (Paused)**:
  - Real-time timer display (00:30 format)
  - Goal time tracking (Goal: 01:00)
  - Pause/resume functionality
  - "Paused" status indicator
  - Session control buttons (pause/play)

  **Screen 4 - Session Completed**:
  - Session completion timer (00:00)
  - "Finished" status display
  - Goal achievement confirmation
  - Stop button to end session
  - Session completion validation

  **Screen 5 - Session Saved**:
  - "How do you feel now?" feedback prompt
  - 5-star rating system for session quality
  - Notes/feedback input field
  - "End Session" button for final completion
  - Session data persistence and storage

### 👤 **Profile & Account Management**

#### 16. **Profile Management System (8 screens)**

- **Purpose**: Comprehensive user profile and account management
- **Functionality**:

  **Screen 1 - Main Profile Screen**:
  - User profile display with initials (HW) and name
  - Comprehensive menu system:
    - General: Manage account, Push notifications, Goal preferences, Oxify, Preferred Mood, Oxify Statistics
    - Support: Send feedback, Plan, Billing, Legal, About
  - "Log Out" functionality with bottom navigation
  - Clean categorized interface

  **Screen 2 - Manage Account**:
  - Personal info section with user details
  - Authentication management
  - Account settings and preferences
  - "Log Out" and "Delete account" options
  - Organized settings categories

  **Screen 3 - Delete Account**:
  - Account deletion confirmation dialog
  - Warning message about permanent deletion
  - Detailed explanation of data loss consequences
  - "Yes, I want to delete my account" confirmation checkbox
  - "Delete Account" button (destructive action)
  - "Cancel" option for safety

  **Screen 4 - Gender Selection**:
  - Gender preference options (Male, Female, Others)
  - Radio button selection interface
  - "Update" button to save changes
  - Clean, accessible design

  **Screen 5 - Edit Name**:
  - Full name editing with separate fields
  - First name and last name input fields
  - Real-time input validation
  - "Update" button to save changes
  - Keyboard support

  **Screen 6 - Edit Date of Birth**:
  - Calendar-based date selection
  - Month/year navigation (January 2024)
  - Date picker with grid layout
  - "Update" button to confirm selection
  - Clear date display and selection

  **Screen 7 - Change Password**:
  - Current password verification
  - New password input with validation
  - Password strength requirements display:
    - Minimum character requirements
    - Uppercase, lowercase, numbers validation
    - Special character requirements
  - Secure password masking
  - "Update" button for password change

  **Screen 8 - Profile Photo Management**:
  - Add profile photo functionality
  - Photo upload options:
    - "View photo library" access
    - "Take photo" camera integration
  - Profile photo display and management
  - Easy photo replacement options

### ⚙️ **Settings & Configuration**

#### 17. **Advanced Settings System (5 screens)**

- **Purpose**: Comprehensive app configuration and preferences management
- **Functionality**:

  **Screen 1 - Enhanced Change Password**:
  - Old password verification field
  - Create new password input
  - Re-enter password confirmation
  - Comprehensive password requirements display:
    - 8-32 characters long
    - 1 lowercase character (a-z)
    - 1 uppercase character (A-Z)
    - 1 number
    - 1 special character (e.g., ! @ # $ %)
  - Real-time validation with checkmarks
  - "Update" button for password change

  **Screen 2 - Push Notifications Settings**:
  - App notifications status (disabled/enabled)
  - Detailed notification explanation
  - "Open Settings" button for system preferences
  - Lorem ipsum descriptive text for notification policies
  - Integration with device notification settings

  **Screen 3 - Email Preferences/Updates**:
  - "Oxify Updates" toggle switch
  - Email preference management
  - Subscription settings for app updates
  - Toggle controls for different email types
  - Clean interface for email communication preferences

  **Screen 4 - Clear Cache**:
  - Cache size management and monitoring:
    - Memory usage display (30 KB)
    - Images cache tracking (13.65 MB)
  - "Clear cache" button for performance optimization
  - Storage management and cleanup functionality
  - App performance optimization tools

  **Screen 5 - Chamber Model Selection**:
  - Comprehensive chamber model selection interface
  - Grid layout of available chamber models:
    - Model A through Model H
    - Visual chamber representations
    - Model-specific configurations
  - Search functionality for chamber models
  - "Update" button to save chamber selection
  - Chamber compatibility and specifications

### 📚 **Content & Achievement System**

#### 18. **Content Management & Gamification (4 screens)**

- **Purpose**: Educational content management and user engagement through achievements
- **Functionality**:

  **Screen 1 - Favorite Protocols**:
  - Left sidebar with chamber model selection (Model A through H)
  - Protocol management interface:
    - "Injury Recovery" protocols with detailed descriptions
    - ATA level indicators (2.0 ATA Level)
    - Session duration display (90 minutes)
    - Repeat cycle information (Repeat 30 Days)
    - Heart/favorite indicators for saved protocols
  - "Start Session" buttons for immediate protocol execution
  - Chamber-specific protocol recommendations

  **Screen 2 - Saved Articles**:
  - Educational content library with Oxify branding
  - Article management system:
    - "10 Surprising benefits of Hyperbaric Oxygen Chamber"
    - Lorem ipsum content descriptions
    - Social engagement features:
      - Like buttons with reaction counts
      - Comment system with user avatars
      - "Add a comment" functionality
      - "View comments" interaction
  - Bookmark/save functionality for articles
  - User engagement tracking ("You and 180 others commented")

  **Screen 3 - Milestone Badges**:
  - Comprehensive achievement system with milestone tracking:
    - 7 Days Streak Milestone
    - 15 Days Streak Milestone
    - 45 Days Streak Milestone
  - Badge grid layout with achievement icons
  - "Share now" functionality for each milestone
  - Progress tracking and celebration system
  - Visual badge designs with streak indicators

  **Screen 4 - Milestone Share**:
  - Achievement celebration interface:
    - "Congratulations! you achieved a milestone for 100 sessions"
    - "🔥 100 Days Streak!" prominent display
    - Motivational messaging: "Keep going! You're doing great!"
  - Social sharing functionality:
    - Download achievement image
    - Share achievement on social platforms
  - Achievement visualization with Oxify branding
  - Milestone celebration and user motivation

### 📊 **Statistics & Analytics System**

#### 19. **Data Analytics & Reporting (2 screens)**

- **Purpose**: Comprehensive session data analysis and progress tracking
- **Functionality**:

  **Screen 1 - Session Details (Calendar View)**:
  - Advanced session filtering and selection:
    - Protocol dropdown selection (Frequency, Protocols, ATA Level)
    - Duration filtering options
    - Date range selection interface
  - Interactive calendar view (January 2025):
    - Visual session indicators on calendar dates
    - Multiple date selection capability (1, 2, 6, 7, 10, 13, 14, 15, 16, 17, 20, 21, 22, 23, 24, 29 highlighted)
    - Month/year navigation controls
  - "View Session Details" action button
  - Session data visualization preparation

  **Screen 2 - Statistics Dashboard**:
  - Comprehensive analytics interface with multiple data visualizations:

    **Session Overview Panel**:
    - ATA Level tracking (1.4)
    - Protocol information (Lorem Ipsum Dolor)
    - Duration tracking (6 Minutes 30 Seconds)
    - Frequency monitoring (Lorem Ipsum Dolor)
    - Mood tracking (Happy)

    **Chart Analytics**:
    - Sessions bar chart showing weekly activity patterns
    - Total Minutes Logged line graph with trend analysis
    - ATA History area chart displaying pressure level trends over time
    - Interactive chart controls with time period selection

    **Data Insights**:
    - Weekly session distribution visualization
    - Progress tracking across multiple metrics
    - Historical data comparison and trends
    - Performance analytics and patterns

  - Bottom navigation integration with statistics highlighting
  - Real-time data synchronization and updates

### 🧠 **HBOT Hub & Learning System**

#### 20. **Enhanced Protocols & Educational Platform (3 screens)**

- **Purpose**: Comprehensive HBOT protocol management and educational content platform with community features
- **Functionality**:

  **Screen 1 - Protocols Hub**:
  - Advanced HBOT protocol management interface:
    - Search functionality for protocol discovery
    - Protocol filtering options (All Learning Articles, Protocols, etc.)
    - Category tags: Mental Health, Inflammation, Sleep, Wellness
    - Advanced filtering capabilities
  - Protocol library with detailed information:
    - "Injury Recovery" protocols with comprehensive descriptions
    - ATA level specifications and session parameters
    - Duration and frequency recommendations
    - Heart/favorite icons for protocol bookmarking
  - "Start Session" buttons for immediate protocol execution
  - Bottom navigation with HBOT Statistics integration

  **Screen 2 - Learning Articles Hub**:
  - Educational content management with social features:
    - Search and filtering capabilities
    - Category-based article organization (Wellness, Benefits, Sleep, Advanced Applications)
    - Article feed with Oxify branding integration
  - Article interaction system:
    - "10 Surprising Benefits of Hyperbaric Oxygen Chamber" featured articles
    - Social engagement indicators (❤️ 👍 💭 💡 reaction emojis)
    - Comment counts and community interaction tracking
    - User avatar displays and engagement metrics
  - Community features with user-generated content and discussions

  **Screen 3 - Comments Drop Sheet**:
  - Comprehensive community discussion interface:
    - User comment threads with profile integration
    - "Harish Wadhwan" and other community member interactions
    - Timestamp tracking for real-time discussions
    - Comment threading and reply functionality
  - Social interaction features:
    - User avatar and profile integration
    - Community engagement and discussion management
    - Real-time comment updates and notifications
    - Moderation and community guidelines support

---

## 🎨 Design System

### **Color Palette**

- Defined in `constants/Colors.ts`
- Semantic theming in `constants/Theme.ts`
- Consistent color usage across all screens

### **Project Structure**

```
navigation/
├── AppNavigator.tsx         # Root navigation container
├── OnboardingNavigator.tsx  # Onboarding flow navigation
├── AuthNavigator.tsx        # Authentication flow navigation
├── MainNavigator.tsx        # Main app with bottom tabs
├── SessionNavigator.tsx     # Session tracking navigation
├── ProfileNavigator.tsx     # Profile management navigation
├── SettingsNavigator.tsx    # Settings navigation
├── ContentNavigator.tsx     # Content & achievements navigation
└── index.ts                # Navigation exports

screens/
├── onboarding/             # 4 onboarding screens
├── auth/                   # 17 authentication screens
├── main/                   # 3 core app screens
├── session/                # 5 session tracking screens
├── profile/                # 8 profile management screens
├── settings/               # 5 settings screens
├── content/                # 4 content screens
├── analytics/              # 2 analytics screens
├── hbot/                   # 3 HBOT hub screens
└── PlaceholderScreen.tsx   # Reusable placeholder component

constants/
├── Colors.ts               # Color palette and theming
├── ScreenNames.ts          # Screen name constants
└── index.ts               # Constants exports

utils/
├── navigationHelper.ts     # Navigation utility functions
└── index.ts               # Utils exports
```

### **Key Features**

- ✅ TypeScript support
- ✅ Responsive design
- ✅ Placeholder image system
- ✅ Linear gradient backgrounds
- ✅ Smooth navigation flow
- ✅ Progress tracking

---

## 🔄 Navigation Flow

```
Splash Screen (2s)
    ↓
Onboarding Page 1
    ↓
Onboarding Page 2
    ↓
Onboarding Page 3
    ↓
Welcome Screen
    ↓
Login/Signup Selection
    ↓              ↓
Login Flow    Signup Flow
    ↓          (8 screens)
Email Input       ↓
    ↓          Name → Time Zone → Health Goals
Password          ↓
    ↓          Email → Verification → Password
Main App          ↓
    ↑          Confirm → Success
    ↓              ↓
Forgot Password    MAIN APPLICATION
(5 step process)   ↓
    ↓          Chamber Selection
Login Success      ↓
    ↓          Dashboard (Hub)
    ↓          ↓    ↓    ↓
Main App   Sessions Notifications Settings
           Details     Center
           ↓           ↓
        Progress    Streak/Achievement
        Tracking    System
           ↓
    SESSION TRACKING FLOW
           ↓
    Setup → Ready → In Progress
           ↓         ↓
    Completed → Session Saved
           ↓
    Back to Dashboard
           ↓
    PROFILE MANAGEMENT
           ↓
    Profile Hub → Account Settings
           ↓         ↓
    Edit Profile  Delete Account
    (Name, DOB,   (Confirmation)
     Gender, Photo)
           ↓
    Change Password
           ↓
    SETTINGS & CONFIGURATION
           ↓
    Notifications → Email Preferences
           ↓              ↓
    Cache Management  Chamber Model
           ↓         Selection
    Performance
    Optimization
           ↓
    CONTENT & ACHIEVEMENTS
           ↓
    Favorite Protocols → Educational Articles
           ↓                    ↓
    Protocol Management    Social Features
           ↓                    ↓
    Milestone Badges → Achievement Sharing
           ↓
    Gamification System
           ↓
    STATISTICS & ANALYTICS
           ↓
    Session Calendar → Data Visualization
           ↓                 ↓
    Date Selection    Multiple Chart Types
           ↓                 ↓
    Session Details   Progress Analytics
           ↓
    Performance Insights
           ↓
    HBOT HUB & LEARNING
           ↓
    Protocols Hub → Educational Articles
           ↓              ↓
    Protocol Search   Social Features
           ↓              ↓
    Session Start    Community Comments
           ↓              ↓
    HBOT Statistics   Discussion Threads
```

---

## 📋 Development Status

| Screen Category  | Status        | Components                                                                                    |
| ---------------- | ------------- | --------------------------------------------------------------------------------------------- |
| Onboarding       | ✅ Complete   | SplashScreen, OnboardingFlow                                                                  |
| Welcome & Auth   | 📋 Documented | WelcomeScreen, LoginScreen                                                                    |
| Login Flow       | 📋 Documented | EmailInput, PasswordInput, ForgotPassword                                                     |
| Signup Flow      | 📋 Documented | NameInput, TimeZone, HealthGoals, EmailVerification, PasswordCreation                         |
| Main App         | 📋 Documented | ChamberSelection, Dashboard, SessionDetails, NotificationCenter, StreakSystem                 |
| Session Tracking | 📋 Documented | SessionSetup, SessionReady, SessionInProgress, SessionCompleted, SessionSaved                 |
| Profile System   | 📋 Documented | ProfileHub, ManageAccount, EditProfile, DeleteAccount, ChangePassword, PhotoManagement        |
| Settings System  | 📋 Documented | AdvancedPassword, PushNotifications, EmailPreferences, CacheManagement, ChamberModelSelection |
| Content System   | 📋 Documented | FavoriteProtocols, SavedArticles, MilestoneBadges, AchievementSharing                         |
| Analytics System | 📋 Documented | SessionCalendar, StatisticsDashboard, DataVisualization, ProgressTracking                     |
| HBOT Hub System  | 📋 Documented | ProtocolsHub, LearningArticles, CommunityComments, SocialFeatures                             |
| Navigation       | ✅ Complete   | AppNavigator, 8 Stack Navigators, BottomTabs, 54 Screen Routes                                |

---

_This document will be updated as new screens are implemented._
# Oxify-ios
# Oxify-ios
# oxify-new-build
