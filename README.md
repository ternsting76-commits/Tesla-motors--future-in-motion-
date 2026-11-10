# Tesla Motors – Future in Motion

A luxury, futuristic automotive e-commerce marketplace and 3D electric vehicle showroom. Customers can inspect, configure in real-time 3D, compare, and reserve vehicles from the Tesla lineup, including the next-generation Tesla Roadster, Cybertruck, and Model S/3/X/Y.

## Key Features

1. **Cinematic 3D Showroom (Three.js WebGL)**:
   - Procedural automotive models with PBR `MeshPhysicalMaterial` (clearcoat, metallic flake, reflections).
   - High-fidelity studio lighting with soft directional shadows, warm key light, cool blue fill, and red rim accents.
   - Circular showroom turntable, reflective dark floor, and contact ground shadows.
   - Interactive camera control: Orbit, zoom, auto-rotation toggle, camera view presets (`Hero 3/4`, `Side Profile`, `Rear`, `Top Aero`, `Cockpit`).
   - Inspection modes: Studio PBR, Cyber Neon Wireframe, and X-Ray Powertrain (revealing the battery skateboard architecture and electric drive motors).
   - Ergonomic collapsible bottom control dock complying with zero-viewport-occlusion guidelines.

2. **Vehicle Marketplace & Explore**:
   - Filter by categories: `All`, `Hypercar`, `Sedan`, `SUV`, `Cyber`.
   - Real-time search by name, drivetrain, and specs.
   - Sort by recommended, 0-60 acceleration, EPA range, and price.
   - 3D tilt hover cards with dynamic paint swatch previews and favorite bookmarking.

3. **Exclusive Tesla Roadster Experience**:
   - "Beyond Speed. Beyond Expectations." showcase.
   - Interactive 3D vehicle inspection, exterior/interior cockpit galleries.
   - Deep dive into the cold-gas thruster SpaceX Package (1.1s 0-60 mph, 2.5G lateral acceleration).
   - Instant reservation booking flow ($5,000 refundable deposit).

4. **Interactive 3D Configurator**:
   - Switch models in real time with immediate 3D mesh and paint color updates.
   - Wheels selection (Aero Sport Carbon, Arachnid Forged Blade, Cyber Wheels).
   - Interior trim selection (All Black, Black & White Studio, Cream & Walnut).
   - Full Self-Driving (Supervised) hardware suite add-on.
   - Live cash price and monthly financing calculation.

5. **Individual Vehicle Details**:
   - High-resolution gallery with exterior and interior tabs.
   - Full technical specifications matrix (horsepower, drivetrain, curb weight, cargo, supercharging speed).
   - Interactive loan financing estimator (down payment slider, APR, loan duration).

6. **Shopping Cart & Checkout**:
   - Multi-step checkout with delivery address and shipping options.
   - Tokenized Stripe credit card simulator with test card auto-fill and validation.
   - Confetti celebration upon reservation, generating unique Order ID and VIN allocation.

7. **Customer Accounts & Order Tracking**:
   - Account creation and passwordless secure sign-in.
   - Real-time order tracking progress: `Deposit Confirmed` &rarr; `VIN Assigned` &rarr; `In Production` &rarr; `In Transit` &rarr; `Ready for Delivery`.
   - Saved vehicles garage.

8. **Dealership Administrator Dashboard**:
   - Passkey-protected admin portal (Passkey: `tesla2026`).
   - Sales analytics, quarterly revenue graph, and fleet allocation tracking.
   - Full CRUD inventory management: Add new vehicles, modify prices/specs/stock, delete listings.
   - Order fulfillment manager: update statuses and view customer records.
   - Customer inquiries and test drive inbox.

9. **Web Audio API Procedural Sound Engine**:
   - Realistic electric vehicle acceleration sound effects synthesized using Web Audio oscillators.
   - UI sound feedback and mute/unmute controls.

10. **Authorized Independent Marketplace Disclosure & Policies**:
    - Transparent authorized independent showroom notice.
    - Privacy Policy, Terms & Conditions, and Refund Policy modals.

## Technologies Used
- React 19 & TypeScript
- Tailwind CSS v4
- Three.js
- Lucide React
- Canvas Confetti
