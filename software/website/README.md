# SAJAG (सजग) — Village Environmental Intelligence & Early Warning System

> **Smart India Hackathon (SIH) Project Submission**  
> **Live Working Website Link:** [https://ais-pre-zp7p57gxdupqqq2v76gtwl-952301852854.asia-southeast1.run.app](https://ais-pre-zp7p57gxdupqqq2v76gtwl-952301852854.asia-southeast1.run.app)

---

## 📌 Project Overview
**SAJAG (सजग)** is an Edge-AI powered Environmental Intelligence and Disaster Early Warning System designed for Gram Panchayats and rural administrative jurisdictions. It provides real-time multi-hazard telemetry analysis, automated alert escalation, siren actuation, and emergency SMS dispatch with 100% offline edge autonomy.

---

## 🚀 Key Features

1. **Physical Trigger Calibrator**:
   - Live calibration and testing tool dedicated to physical sensor nodes (NODE-01).
   - Real-time adjustment of exactly 5 parameters:
     - 🌡️ **Ambient Temperature (`temp`)** (°C)
     - ⏱️ **Barometric Pressure (`pressure`)** (hPa)
     - 🌊 **Water Level (`water level`)** (cm)
     - 💧 **Soil Moisture (`soil moisture`)** (%)
     - 📳 **Ground / Structural Vibration (`vibration`)** (mm/s)

2. **3-Stage Risk Classification**:
   - **`SAFE`**: Nominal baseline tolerances.
   - **`WATCH`**: Advisory state for elevated parameter trends.
   - **`RISK`**: Urgent hazard state triggering siren buzzer relay and emergency authority alerts.

3. **Multi-Section Government Portal Architecture**:
   - **Village Geospatial Cadastral Map**: Visual representation of village nodes and drainage channels.
   - **Parametric Sensor Matrix**: Real-time readings and comparisons for all monitored nodes.
   - **Edge AI Evaluation & Confidence**: Sub-millisecond localized inference.
   - **Time-Series Trends**: Historical analysis across the 5 monitored parameters.
   - **Telemetry Network Diagnostics**: Battery voltages, signal RSSI, and LoRaWAN link health.
   - **Warning Siren Actuation & Audio Synthesizer**: Web audio drill and relay simulation.
   - **Authority SMS Dispatching**: Broadcast status to Sarpanch, Talathi, Medical Officer, and emergency team.
   - **Concise Hazard Incident Log**: Clean, capped audit archive of recent alerts.
   - **Zero Cloud Dependency / Offline Mode**: Gateway operates uninterrupted during internet blackouts.

---

## 🛠️ Local Development & Running

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Setup Instructions
```bash
# 1. Clone repository
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:3000` to view the live dashboard.

---

## 👥 Target Beneficiary & Domain
- **Gram Panchayats & Village Disaster Management Cells**
- **Disaster Mitigation Authorities (NDMA / SDMA / District Collectorates)**
- **Rural Agriculture & Flood Risk Mitigation**
