<div align="center">
 SLOTIVA AUTOPILOT ✂️🤖
</div>

<br/>

### The Autonomous "Invisible Manager" for Tier-2 City Salons.

> **Winner/Submission for [Hackathon Name]** > Tracks: *Best Use of Motia*, *AI Agents*

---

## 💡 The Inspiration
In busy salons across Tier-2 cities (like Shahapur), owners often work as the primary stylist. Every time the phone rings for a booking, they have to stop cutting hair to answer it—or miss the business entirely. Furthermore, manual inventory tracking leads to running out of critical supplies (like shaving cream or dye) during peak hours.

**SalonOps AI** solves this by acting as a **24/7 AI Receptionist and Back-Office Manager** that lives in the cloud, handling customers in natural language and managing the shop's "state" automatically.

---

## 🚀 What It Does
SLOTIVA AI is a dual-interface application backed by an event-driven **Motia** architecture.

### 1. For Customers (The AI Receptionist)
A smart chat interface (simulating WhatsApp) where users can book appointments in natural language (English/Hinglish).
* **Context Aware:** Understands "I need a haircut and shave tomorrow at 5."
* **Autonomous:** Quotes prices and confirms bookings without human intervention.

### 2. For Owners (The 3D Dashboard)
A live 3D dashboard that visualizes revenue, active appointments, and real-time inventory levels.

### ✨ The Magic Logic
When a customer books a service (e.g., "Shave"), the system:
1.  **Parsing:** AI identifies the service.
2.  **Inventory Sync:** Automatically deducts the specific amount of "Shaving Cream" from the digital inventory.
3.  **Revenue Update:** Updates the global revenue state.
4.  **Real-time Sync:** Instantly reflects changes on the Owner's dashboard.

---

## ⚙️ How We Built It (The Motia Advantage)
We utilized **Motia's unified backend framework** to build a complex, event-driven system without managing heavy infrastructure.

### 1. Event-Driven "Steps" Architecture
Instead of building a monolithic server, we broken logic down into modular Steps:
* `receive-chat.step.ts` **(API Trigger):** Acts as the webhook listener for incoming chat messages.
* `process-booking.step.ts` **(Event Handler):** The core logic brain. It listens for `chat.received`, uses LLMs to parse intent, and updates the global state.
* `owner-api.step.ts` **(API Trigger):** Serves the aggregated data (revenue, inventory) to the 3D Dashboard frontend.

### 2. Polyglot Backend (TypeScript + Python) 🐍 + 🟦
We leveraged Motia's unique ability to mix languages in a single project:
* **TypeScript:** Handles high-speed API requests and synchronous booking logic.
* **Python:** (`analyze-business.step.py`) runs asynchronously to perform **"Heavy Data Analysis"** on inventory levels (e.g., forecasting when Gel will run out based on usage patterns).

### 3. Built-in State Management
We completely skipped setting up an external database (Postgres/MongoDB). We used **Motia State** to persist:
* Current Revenue (`state.set('revenue', value)`)
* Live Inventory Levels
* Active Bookings

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend Framework** | **Motia** (Steps, Events, State) |
| **Frontend** | React + Tailwind CSS (Glassmorphism/3D Theme) |
| **AI Models** | Groq / Gemini (Fast Inference for Intent Parsing) |
| **Languages** | TypeScript & Python (Polyglot) |

---

## 📂 Project Structure

```bash
├── index.html                 # 3D Dashboard & Customer Chat UI (React + Tailwind)
├── steps/
│   ├── receive-chat.step.ts   # Entry point for chat messages
│   ├── process-booking.step.ts# Main workflow logic
│   ├── owner-api.step.ts      # API for Dashboard data
│   └── analyze-business.step.py # Python worker for inventory analysis
└── README.md
```
<br />

<div align="center">

Built with ❤️ for the 2025 Hackathon.

</div>
