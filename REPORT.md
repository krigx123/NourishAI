# NourishAI - Design Thinking Lab Report

> **Your Personal AI Nutritionist for Healthier Living**

---

## Table of Contents

1. [Abstract](#abstract)
2. [Acknowledgement](#acknowledgement)
6. [Chapter 4: Prototyping](#chapter-4-prototyping)
7. [Chapter 5: Testing](#chapter-5-testing)
8. [Chapter 6: Conclusion and Reflection](#chapter-6-conclusion-and-reflection)
9. [Bibliography](#bibliography)

---

## Abstract

NourishAI is an AI-powered nutrition tracking and diet recommendation web application designed specifically for analyzing Indian meals and helping users achieve their health goals. The application addresses the critical gap in existing nutrition apps that typically cater to Western cuisines and fail to recognize traditional Indian dishes.

Using a hybrid AI approach combining MobileNet neural networks with a curated Indian food database, NourishAI enables users to photograph their meals and receive instant nutritional analysis. The application further enhances accuracy by leveraging Google Gemini AI as an expert nutritionist to verify nutritional values.

Key features include:
- **AI-Powered Meal Analysis**: Instant recognition and nutritional breakdown of Indian foods
- **Personalized Diet Plans**: Recommendations based on user profiles and health goals
- **Nutrition Tracking**: Visual progress tracking with charts and analytics
- **Meal History**: Comprehensive logging with search and filtering
- **Expert Verification**: Google Gemini AI validates nutritional accuracy

The project demonstrates the application of Design Thinking methodology to solve real-world health and nutrition challenges faced by the Indian population.

---

## Acknowledgement

We would like to express our sincere gratitude to all those who contributed to the successful completion of this Design Thinking Lab project.

First and foremost, we thank our faculty mentor for their invaluable guidance, continuous support, and constructive feedback throughout the development of NourishAI.

We are grateful to the participants who took time for interviews, surveys, and user testing sessions. Their honest feedback and insights were instrumental in shaping the final product.

Special thanks to:
- Our college for providing the necessary resources and infrastructure
- The open-source community for tools like React, Node.js, and TensorFlow.js
- Google for the Gemini AI API access
- All beta testers who helped identify issues and suggest improvements

This project would not have been possible without the collaborative effort and support of everyone involved.

---
## Chapter 4: Prototyping

### 4.1 Introduction to Prototyping

Prototyping transforms ideated solutions into tangible, testable artifacts. For NourishAI, we created progressive prototypes from low-fidelity wireframes to a fully functional web application.

**Prototyping Objectives:**
- Validate core user flows early
- Test AI recognition accuracy
- Gather feedback on UI/UX
- Identify technical challenges

#### 4.1.1 List of Options Available for Prototyping

| Prototype Type | Tools | Fidelity | Purpose |
|----------------|-------|----------|---------|
| Paper Wireframes | Pen & Paper | Low | Quick concept validation |
| Digital Wireframes | Figma | Low-Medium | Layout and flow testing |
| Interactive Mockups | Figma Prototype | Medium | Clickable user journeys |
| Code Prototype | React + Node.js | High | Functional testing |
| AI Model Prototype | TensorFlow.js | High | Recognition accuracy testing |

#### 4.1.2 Prototype Selected

We chose a **High-Fidelity Code Prototype** as our primary deliverable because:

1. **AI testing requires real implementation** - Cannot simulate image recognition in mockups
2. **Backend integration essential** - User authentication, data persistence needed
3. **Performance validation** - Must test actual response times
4. **Gemini API integration** - Need working API calls for verification

**Technology Stack Selected:**

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | React | 18.3.1 |
| Build Tool | Vite | 5.4 |
| Backend | Node.js + Express | 22.x |
| Database | PostgreSQL (Neon) | 15 |
| AI (Local) | TensorFlow.js MobileNet | 3.21 |
| AI (Cloud) | Google Gemini API | 2.0 |
| Charts | Recharts | 2.x |
| Styling | CSS Variables | - |

---

### 4.2 Prototyping Implementation

#### 4.2.1 System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                      │
├──────────────────────────────────────────────────────────────┤
│  React Components                                             │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ MealAnalysis│ │ Dashboard   │ │ MealHistory │            │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘            │
│         │               │               │                     │
│  ┌──────▼───────────────▼───────────────▼──────┐             │
│  │            TensorFlow.js MobileNet          │             │
│  │         (Local Indian Food AI)              │             │
│  └─────────────────────┬───────────────────────┘             │
└────────────────────────┼─────────────────────────────────────┘
                         │ API Calls
┌────────────────────────▼─────────────────────────────────────┐
│                     SERVER (Node.js)                          │
├──────────────────────────────────────────────────────────────┤
│  Express Routes                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ /api/auth   │ │ /api/meals  │ │ /api/gemini │            │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘            │
│         │               │               │                     │
│  ┌──────▼───────────────▼──────┐ ┌──────▼──────┐             │
│  │     PostgreSQL (Neon)       │ │ Gemini API  │             │
│  │     - users                 │ │ Nutrition   │             │
│  │     - meal_logs             │ │ Verification│             │
│  │     - favorites             │ └─────────────┘             │
│  └─────────────────────────────┘                             │
└──────────────────────────────────────────────────────────────┘
```

#### 4.2.2 Key Features Implemented

**Feature 1: AI-Powered Meal Analysis**
```javascript
// Local AI detects food from image
const aiPredictions = await detectIndianFood(imgElement, filename);

// Gemini verifies nutritional values  
const geminiResult = await geminiAPI.verifyNutrition(food.name);
```

**Feature 2: Multi-Item Meal Logging**
- Users can scan multiple food items
- Add to "meal cart" before logging
- Combined nutrition calculated automatically
- Single entry in meal history (e.g., "Roti + Dal + Paneer")

**Feature 3: Meal History with Filters**
- Search by food name
- Filter by meal type (Breakfast, Lunch, Dinner, Snack)
- View macros and timestamps
- Last 50 meals displayed

**Feature 4: Personalized Dashboard**
- Dynamic greeting with user name
- Today's progress circles
- Weekly trend charts
- Quick action buttons

#### 4.2.3 Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  age INTEGER,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  goal VARCHAR(50),
  activity_level VARCHAR(50),
  dietary_preference VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meal Logs Table
CREATE TABLE meal_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  food_name VARCHAR(255) NOT NULL,
  calories INTEGER,
  protein DECIMAL(5,2),
  carbs DECIMAL(5,2),
  fats DECIMAL(5,2),
  fiber DECIMAL(5,2),
  meal_type VARCHAR(50),
  logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4.2.4 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User registration with profile |
| `/api/auth/login` | POST | JWT token authentication |
| `/api/meals/log` | POST | Log a meal entry |
| `/api/meals/today` | GET | Get today's meals and totals |
| `/api/meals/history` | GET | Get weekly aggregated data |
| `/api/meals/recent` | GET | Get last 50 meal logs |
| `/api/gemini/verify-nutrition` | POST | Verify nutrition with AI |
| `/api/users/dashboard` | GET | Get user profile and targets |

#### 4.2.5 UI Screenshots

**Dashboard View:**
- Personalized greeting
- Daily progress rings for calories, protein, carbs, fats
- Weekly trend chart
- Quick action buttons

**Meal Analysis View:**
- Image upload area
- AI scanning animation
- Nutritional breakdown card
- Add to meal / Log directly buttons

**Meal History View:**
- Search bar
- Category filter tabs
- Meal cards with icons, calories, timestamp
- Macro breakdown per item

---

## Chapter 5: Testing

### 5.1 Introduction to Testing

Testing validates that the prototype meets user needs and functions correctly. We conducted multiple types of testing including usability testing, functional testing, and AI accuracy testing.

#### 5.1.1 Types of Testing Done

| Test Type | Purpose | Method |
|-----------|---------|--------|
| Usability Testing | Validate UX flows | User observation, task completion |
| Functional Testing | Verify features work | Manual testing of all endpoints |
| AI Accuracy Testing | Measure recognition success | Test images against predictions |
| Performance Testing | Check response times | Lighthouse, manual timing |
| Security Testing | Validate auth system | JWT verification, password hashing |

**Usability Testing Sessions:**

| Participant | Task | Success | Time | Feedback |
|-------------|------|---------|------|----------|
| User 1 | Log a meal via photo | ✅ | 28s | "Surprisingly fast!" |
| User 2 | View weekly progress | ✅ | 15s | "Charts are clear" |
| User 3 | Log multi-item meal | ✅ | 45s | "Love the combined view" |
| User 4 | Search meal history | ✅ | 10s | "Filters work well" |
| User 5 | Update profile | ✅ | 30s | "Simple and intuitive" |

**AI Recognition Testing:**

| Food Item | Recognition | Confidence | Nutrition Verified |
|-----------|-------------|------------|-------------------|
| Paneer Tikka | ✅ | 85% | ✅ Gemini |
| Masala Dosa | ✅ | 78% | ✅ Gemini |
| Dal Makhani | ✅ | 82% | ✅ Gemini |
| Biryani | ✅ | 88% | ✅ Gemini |
| Roti | ✅ | 91% | ✅ Gemini |

---

### 5.2 Validation

**Validation Criteria:**

| Criteria | Target | Achieved | Status |
|----------|--------|----------|--------|
| Meal logging time | <30 seconds | 28 seconds avg | ✅ Pass |
| AI recognition accuracy | >75% | 85% avg | ✅ Pass |
| Page load time | <3 seconds | 2.1 seconds | ✅ Pass |
| User satisfaction | >4/5 | 4.3/5 | ✅ Pass |
| Mobile responsiveness | Works on mobile | Responsive | ✅ Pass |

**User Feedback Summary:**

> "Finally an app that understands my breakfast!" - Test User 1

> "The Gemini verification gives me confidence in the data." - Test User 3

> "Much faster than manually typing food names." - Test User 5

---

### 5.3 Changes/Modifications

#### 5.3.1 Updated Model Based on Feedback

**Feedback Received:**
1. "The Recent Meals on Profile page was confusing" → Moved to dedicated History page
2. "I want to see combined meals as one entry" → Implemented combined meal logging
3. "Need to verify if data is accurate" → Added Gemini expert nutritionist verification
4. "Want to filter by meal type" → Added category filter tabs

**Model Adjustments:**
- Changed from image-based Gemini analysis to text-based nutrition verification
- Reduced API usage, improved rate limit handling
- Added fallback to local database when API unavailable

#### 5.3.2 The Adjusted Prototype

**Version 1.0 → Version 2.0 Changes:**

| Component | v1.0 | v2.0 |
|-----------|------|------|
| Recent Meals | In Profile page | Separate History page |
| Meal Logging | Individual items only | Combined meal support |
| AI Verification | Not available | Gemini expert nutritionist |
| Navigation | 5 menu items | 6 menu items (+ History) |
| Meal Display | Just calories | Full macros + time |

**Final Feature List:**
- ✅ Photo-based meal recognition (local AI)
- ✅ Expert nutritionist verification (Gemini AI)
- ✅ Multi-item meal logging
- ✅ Dedicated meal history page
- ✅ Search and filter capabilities
- ✅ Personalized dashboard
- ✅ Progress tracking with charts
- ✅ User authentication with profiles
- ✅ Diet plan recommendations

---

## Chapter 6: Conclusion and Reflection

### 6.1 Conclusion

NourishAI successfully demonstrates the application of Design Thinking methodology to solve a real-world nutrition tracking challenge. By deeply empathizing with Indian users, we identified the critical gap in existing solutions and designed an AI-powered application that:

1. **Reduces friction** - Photo-based logging takes <30 seconds
2. **Ensures accuracy** - Gemini AI expert verification builds trust
3. **Respects culture** - Purpose-built for Indian cuisine
4. **Enables tracking** - Comprehensive history and progress views
5. **Personalizes experience** - Recommendations based on user goals

The project validates our hypothesis that culturally-relevant AI solutions can significantly improve user adoption and engagement in health tracking applications.

**Key Achievements:**
- 100+ Indian foods in curated database
- 85% AI recognition accuracy
- 4.3/5 user satisfaction score
- Fully functional web application
- Hybrid AI architecture (local + cloud)

### 6.2 Reflection

**What Worked Well:**
- Design Thinking methodology kept us user-focused
- Empathy research revealed non-obvious insights
- Prototyping early allowed quick iteration
- Hybrid AI approach balanced speed and accuracy
- User testing identified critical improvements

**Challenges Faced:**
- Gemini API rate limits on free tier
- Training local AI for regional food variations
- Balancing feature scope with time constraints
- Ensuring offline functionality

**Lessons Learned:**
1. Start with user empathy - assumptions are often wrong
2. Prototype early, fail fast, iterate often
3. AI solutions need fallback mechanisms
4. Simple UX beats feature-rich complexity
5. Cultural context matters in design

**Future Scope:**
- Expand database to 500+ foods
- Add regional language support
- Implement barcode scanning for packaged foods
- Integrate with fitness wearables
- Add social features for community support

---

## Bibliography

1. Brown, T. (2008). *Design Thinking*. Harvard Business Review.

2. Norman, D. (2013). *The Design of Everyday Things*. Basic Books.

3. ICMR-NIN. (2020). *Indian Food Composition Tables*. National Institute of Nutrition.

4. Google. (2024). *Gemini API Documentation*. https://ai.google.dev/docs

5. TensorFlow. (2024). *TensorFlow.js MobileNet*. https://www.tensorflow.org/js

6. React Documentation. (2024). https://react.dev

7. WHO. (2023). *Nutrition Guidelines for South-East Asia Region*.

8. FSSAI. (2024). *Food Safety and Standards (Labelling and Display)*. Government of India.

---

*Report prepared for Design Thinking Lab | 3rd Semester*

*Project: NourishAI - Your Personal AI Nutritionist*

*Date: January 2026*
