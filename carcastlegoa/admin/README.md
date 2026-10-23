# Car Castle Goa — Shop Owner Admin Guide

This admin panel is designed specifically for shop operations: flat, fast, and simple to understand in under 5 minutes without technical training.

---

## 4 Simple Steps to Manage Your Fleet

All operations use the three items in your left sidebar:

### 1. How to Add a New Car
1. Click **Add New Car** in the left sidebar.
2. Fill in the car details:
   - **Basic Details**: Enter the Car Name, Brand, and select Category.
   - **Pricing**: Enter the daily rate in ₹.
   - **Specifications**: Select Seats, Transmission, and Fuel Type.
   - **Photos**: Click **Choose Photos** to upload car images. The first photo is automatically marked as **Cover**.
   - **Availability**: Keep status as **Available for Rent**.
3. Click the black **Save Car** button at the bottom.
4. Your car is saved instantly and appears on your website.

### 2. How to Edit a Car
*There is exactly one way to edit any car:*
1. Click **All Cars** in the left sidebar.
2. Find the car in your fleet list and click **Edit** (or click the car's name).
3. The shared form opens with all existing details pre-filled.
4. Make your changes (e.g. update the daily rate, add photos, or adjust features).
5. Click **Save Car** at the bottom.

### 3. How to Mark a Car as Unavailable / Available
*One-click instant toggle:*
1. Click **All Cars** in the left sidebar.
2. In the car's row, locate the **Available** switch:
   - Toggle **OFF**: The car status instantly changes to **Booked** (unavailable).
   - Toggle **ON**: The car status returns to **Available**.
3. The change reflects immediately on your public rental website.

### 4. How to Delete a Car
1. Click **All Cars** in the left sidebar.
2. In the car's row, click **Delete**.
3. A confirmation box asks: *"Delete this car? This cannot be undone."*
4. Click the red **Delete** button to permanently remove the vehicle from your fleet.

---

## Screen Overview

| Screen | Purpose & Contents |
|---|---|
| **Dashboard** | 4 plain numbers (**Total cars**, **Available**, **Booked**, **Under maintenance**) and a **Recently Added** list of 5 cars. |
| **All Cars** | Clean table (cards on mobile) showing Photo, Name, Category, Price per day, Status, and Actions (**Available switch**, **Edit**, **Delete**). Search bar & status filter at top. |
| **Add New Car / Edit Car** | **One shared single-column form**. Grouped by Basic Details, Pricing, Specifications, Photos, and Availability. Sticky bottom bar with Save Car and Cancel. |

---

## Verification & Testing Checklist

- [x] **Tab 1 (Dashboard)**: Displays exactly 4 plain metric counts and the 5 most recently added cars. Clicking a recent car opens its edit form.
- [x] **Tab 2 (All Cars)**: Displays clean table on desktop and cards on mobile. Instant search and status filtering work.
- [x] **Tab 3 (Add New Car / Edit Car)**: Single-column shared form used for both Adding and Editing.
- [x] **Strict Form Validation**: Required fields show red asterisk `*`, validate on blur and submit, with the first invalid field focused automatically. No sample or dummy data anywhere in placeholders.
- [x] **Photo Management**: Uploads JPG, PNG, and WebP (validated <= 5MB); displays thumbnail grid with first photo marked as **Cover**; allows setting a new cover or removing photos.
- [x] **One-Click Availability Switch**: Toggling the Available switch immediately updates car status between Available and Booked.
- [x] **Delete Safety**: Delete button prompts with *"Delete this car? This cannot be undone."* before deleting.
- [x] **Mobile Responsiveness**: On phones (<= 768px), sidebar collapses into a top bar with Menu toggle; table converts to mobile cards; min 44px tap targets.
- [x] **Live Realtime Sync**: Modifications, price updates, and status toggles appear on the public website instantly without page refresh.
