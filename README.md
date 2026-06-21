#  Jal Pijiye (SipIt) — Chrome Extension

A production-ready, interactive Google Chrome Extension designed to track and gamify daily water intake. By factoring in custom container metrics, the extension schedules smart hydration deadlines across a **14-hour active waking window** to ensure a standard **2-Liter ($2000\text{ ml}$)** daily hydration target is systematically achieved. 

Equipped with an asymmetric asynchronous backend service worker, the extension pushes system-level native desktop alerts even when the browser popup remains closed.

---

##  Live Visuals & Flow
###  Active View Layout
*   **Onboarding State (`.firstpage`):** Greets the user and captures custom fluid vessel capacities in milliliters.
*   **Active Tracking State (`.secondpage`):** Displays overall progress metrics, remaining bottle counts, and dynamic time constraints.
*   **Modal Engagement Frame (`.popup-overlay`):** Smoothly transitions into focus using springy scale transitions to serve interactive target alerts.

---

##  Features
*   **Dynamic Intake Computation:** Intelligently scales target milestones ($2000\text{ ml} \div \text{Container Size}$) to accurately map daily goal requirements.
*   **Asynchronous Background Processing:** Utilizes a dedicated background service worker (`background.js`) to ensure alarms fire and trigger native OS alerts regardless of active window status.
*   **Persistent Storage Synchronization:** Leverages the `chrome.storage.local` sandbox to retain tracking data, current bottle numbers, and alarm timestamps across browser restarts.
*   **Native System Notifications:** Deploys highly prioritized desktop alerts with persistent interactive locks (`requireInteraction: true`) to ensure high visibility.
*   **One-Click Session Flushing:** Features a complete state clearing routine that purges background alarms and local storage to seamlessly initialize a fresh day.

---

##  Technical Architecture & Mathematical Logic

###  Hydration Frequency Mechanics
The application spaces intervals out across a standard active waking day, establishing a hard floor of **30 minutes** to avoid notification fatigue:

$$\text{Total Target Bottles} = \left\lceil \frac{2000\text{ ml}}{\text{Vessel Input Size (ml)}} \right\rceil$$

$$\text{Hydration Frequency (Hours)} = \max\left(\frac{14\text{ Hours}}{\text{Total Target Bottles}}, 0.5\text{ Hours}\right)$$

###  Architecture Map
├── manifest.json      # Configuration, system scopes, and service-worker bindings
├── index.html         # Structural markup mapped across separate layout views
├── style.css          # Cohesive ocean-blue layouts with fluid scaling animations
├── script.js          # Core interface engine handling state and UI mutations
└── background.js      # Decoupled service worker managing system alarms and alerts

---

##  Local Installation & Development Deployment

Since this utility is currently in active development, you can sideload it directly into your local browser workspace:

1. **Clone or Download the Source:** Ensure all necessary files (`manifest.json`, `index.html`, `style.css`, `script.js`, `background.js`, and your asset image) live together in a single folder named `Jal-Pijiye-Extension`.
2. **Access Extension Workspace:** Open Google Chrome and navigate to `chrome://extensions/`.
3. **Toggle Developer Access:** Turn on the **Developer mode** toggle switch located in the upper right-hand corner.
4. **Sideload Unpacked Folder:** Click the **Load unpacked** button in the upper left-hand corner and select your `Jal-Pijiye-Extension` directory.
5. **Pin to Toolbar:** Click the puzzle piece extensions icon next to your profile picture and pin **Jal Pijiye** for rapid access.

---

##  Technology Stack
*   **Core Architecture:** JavaScript (ES6 Execution Standard), HTML5 Semantic Shell, CSS3 Flexbox Modules
*   **Platform Engines:** Google Chrome Extension Manifest V3 API Architecture
*   **Sub-Systems:** `chrome.storage.local` (State Persistence), `chrome.alarms` (Timekeeping Loops), `chrome.notifications` (Native OS Delivery)