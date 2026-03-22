# FlipFinder — Build Guide
## Generate a Signed APK & Publish to Google Play Store

---

## Prerequisites

Install these on your computer:
- **Node.js** (v18+): https://nodejs.org
- **Git**: https://git-scm.com
- **Expo account** (free): https://expo.dev/signup
- **EAS CLI**: `npm install -g eas-cli`

---

## Step 1 — Install Dependencies

```bash
cd FlipFinder
npm install
```

---

## Step 2 — Configure Your Environment

Copy the example env file and fill in your keys:

```bash
cp .env.example .env
```

Edit `.env`:
```
EF_API_KEY=your_empire_flippers_api_key_here
MAILCHIMP_API_KEY=your_mailchimp_key         # optional
MAILCHIMP_LIST_ID=your_list_id               # optional
```

> Your affiliate referral link is already hardcoded:
> `https://empireflippers.com/marketplace/?referrer=IW20AKOTKCMFADUS`

---

## Step 3 — Log in to Expo / EAS

```bash
eas login
# Enter your Expo account credentials
```

---

## Step 4 — Configure EAS Build

```bash
eas build:configure
```

This creates/updates your `eas.json` and links the project to your Expo account.
When prompted, select **Android**.

---

## Step 5 — Build a Preview APK (for testing)

```bash
eas build --platform android --profile preview
```

- EAS generates a **keystore automatically** and stores it securely
- Build takes ~5–10 minutes in the cloud
- You'll get a **download link** for the `.apk` file
- Install it directly on your Android phone to test

---

## Step 6 — Build Production AAB (for Play Store)

```bash
eas build --platform android --profile production
```

This generates an `.aab` (Android App Bundle) — the format required by Google Play.

---

## Step 7 — Submit to Google Play Store

### 7a. Create a Google Play Developer Account
- Go to: https://play.google.com/console
- Pay the one-time $25 registration fee
- Fill in your developer profile

### 7b. Create a New App
1. Click **"Create app"**
2. App name: `FlipFinder`
3. Default language: English
4. App or Game: **App**
5. Free or Paid: **Free**

### 7c. Upload the AAB
1. Go to **Production → Releases**
2. Click **"Create new release"**
3. Upload your `.aab` file from Step 6
4. Add release notes: _"Discover and acquire premium online businesses from Empire Flippers marketplace."_

### 7d. Complete Store Listing
Fill in:
- **Short description** (80 chars): `Browse & buy verified online businesses — FBA, SaaS, Shopify & more`
- **Full description**: See template below
- **Screenshots**: Take 2–8 screenshots from your phone
- **Feature graphic**: 1024x500px banner image
- **Category**: Finance or Business
- **Tags**: business acquisition, online business, buy website, amazon fba

#### Full Description Template:
```
FlipFinder — Your Business Acquisition Partner

Browse hundreds of verified online businesses for sale, sourced directly from Empire Flippers — the world's most trusted business marketplace.

🔍 DISCOVER PREMIUM BUSINESSES
• Amazon FBA stores
• Shopify & eCommerce stores
• Dropshipping businesses
• SaaS companies
• Content sites & blogs
• Digital agencies

💼 START AN ACQUISITION TODAY
Every listing is fully vetted by Empire Flippers' expert team. View detailed financials, traffic stats, and profit history before making an offer.

❤️ SAVE YOUR FAVORITES
Build a watchlist of businesses you're interested in and track them over time.

🔔 NEVER MISS A DEAL
Enable push notifications to get alerted the moment a new business matching your criteria hits the market.

Powered by Empire Flippers — the #1 online business marketplace.
```

### 7e. Set Content Rating
- Complete the content rating questionnaire
- FlipFinder is rated **Everyone**

### 7f. Privacy Policy
You must provide a privacy policy URL. You can use a free generator:
https://www.privacypolicygenerator.info/

### 7g. Publish
1. Review all sections (they must all show a green checkmark)
2. Click **"Send for review"**
3. Google reviews take 1–3 days for new apps

---

## EAS Build Commands Reference

| Command | Output | Use case |
|---------|--------|----------|
| `eas build --platform android --profile preview` | `.apk` | Direct install / testing |
| `eas build --platform android --profile production` | `.aab` | Play Store submission |
| `eas submit --platform android` | Auto-submits to Play Store | After production build |

---

## Updating Your App

After making code changes:
1. Bump `versionCode` in `app.json` (e.g. 1 → 2)
2. Bump `version` string (e.g. "1.0.0" → "1.0.1")
3. Run `eas build --platform android --profile production`
4. Upload new AAB in Play Console

---

## Affiliate Revenue Tracking

Every listing redirect uses your verified link:
```
https://empireflippers.com/marketplace/?referrer=IW20AKOTKCMFADUS
```

Track conversions in your Empire Flippers affiliate dashboard.

---

## Support

For build issues: https://docs.expo.dev/build/introduction/
For EF API: https://api.empireflippers.com/
