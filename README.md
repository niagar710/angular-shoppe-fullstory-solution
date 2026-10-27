# Angular Shoppe Demo: FullStory Cart Experience

## Overview

This project extends the original [FullStory Angular Shoppe Demo](https://github.com/fullstorydev/angular-shoppe-demo), a sample e-commerce application for exploring FullStory on Angular web applications.

The implementation improves the shopping cart experience by introducing product quantity controls on the Products and Cart pages and adding FullStory custom events to capture cart interactions.

## Business Problem

Shoppers need a convenient way to manage product quantities while browsing products and reviewing their cart. Without accessible quantity controls, shoppers may need to repeat actions to increase quantities or remove an entire item when they only want to decrease its quantity.

This project addresses that problem by providing quantity controls on both pages and using FullStory to capture interactions that can help the Product team investigate shopper behavior.

## Solution and Implementation

### Cart Quantity Controls

- Added controls to increase and decrease product quantities on the Products page.
- Added quantity controls to the Cart page.
- Centralized quantity updates and item removal through the shared `CartService`.
- Updated cart totals to reflect product quantities.
- Preserved existing cart functionality.

### FullStory Custom Events

Integrated custom FullStory events into the cart service to capture key shopping interactions.

| Event                     | Description                                             |
| ------------------------- | ------------------------------------------------------- |
| `Cart Quantity Increased` | Records when a shopper increases a product's quantity.  |
| `Cart Quantity Decreased` | Records when a shopper decreases a product's quantity.  |
| `Cart Item Removed`       | Records when a shopper removes a product from the cart. |

The events include contextual properties such as product ID, product name, quantity, and interaction source (`products` or `cart`).

These events can be examined alongside FullStory session replay to investigate how shoppers interact with the cart.

## Business Value

The implementation demonstrates how behavioral data can help product teams:

- Investigate repeated quantity adjustments and item removals.
- Review session replays to understand the context behind cart interactions.
- Identify potential usability issues for further investigation.
- Use observed behavior to inform product improvements and future testing.

This project is a proof of concept. The implementation validates the cart functionality and custom event instrumentation using test sessions; it does not claim a measured improvement in conversion or revenue.

## Technologies

- Angular
- TypeScript
- FullStory Browser SDK
- RxJS
- Node.js and npm

## Getting Started

### Prerequisites

- Node.js and npm
- A FullStory account to record and review sessions in your own organization

### Clone the Repository

```bash
git clone https://github.com/niagar710/angular-shoppe-fullstory-solution.git
cd angular-shoppe-fullstory-solution
```
