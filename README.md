# SAJAG – Village Environmental Intelligence & Disaster Early Warning System

## Smart India Hackathon 2026

SAJAG is an Edge-AI powered village environmental intelligence and disaster early warning system designed for localized monitoring, risk assessment and timely alerts.

The system combines a multi-sensor hardware prototype, Arduino-based data acquisition, wireless communication and a web-based monitoring dashboard.

---

## Problem

Rural and village areas require localized environmental monitoring and timely information about potential disaster-related conditions.

SAJAG aims to provide an integrated platform for collecting sensor data, monitoring environmental conditions and communicating potential risks through a centralized dashboard.

---

## Proposed Solution

SAJAG integrates:

- Multi-sensor environmental monitoring
- Arduino Nano based data acquisition
- Vibration monitoring
- Soil moisture monitoring
- Distance / water-level monitoring
- Atmospheric pressure and altitude monitoring
- Wireless communication
- Local warning through buzzer
- Edge-AI based risk analysis
- Web-based monitoring dashboard
- Disaster alerts and system-status monitoring

---

## System Architecture

Environmental Sensors
        ↓
Arduino Nano
        ↓
Sensor Data Acquisition
        ↓
Wireless Communication
        ↓
Data Processing / Edge-AI
        ↓
Risk Assessment
        ↓
Monitoring Dashboard
        ↓
Alerts / Warning
-----------------------

## Hardware Components 

| Component                       | Purpose                                        |
| ------------------------------- | ---------------------------------------------- |
| Arduino Nano                    | Central controller and sensor data acquisition |
| MPU6050                         | Motion / vibration-related sensing             |
| BMP180                          | Atmospheric pressure and altitude sensing      |
| SW-420                          | Vibration detection                            |
| HC-SR04                         | Distance / level measurement                   |
| HC-05                           | Bluetooth communication                        |
| Capacitive Soil Moisture Sensor | Soil moisture monitoring                       |
| Buzzer Module                   | Local warning indication                       |
| LM2596S-5                       | Power regulation                               |
| Solar Cell / Battery            | Power supply                                   |

----------------------------------------------------------------------

## Hardware Documentation
Schematic
     The complete hardware schematic is available in:
     hardware/schematic/SIH_schematic.pdf

Prototype
     The physical prototype image is available in:
     hardware/prototype/

Components
     Component information is available in:
     hardware/components/
--------------------

## Software
The SAJAG monitoring dashboard is implemented as a web-based application.
The software contains:
        Dashboard interface
        Sensor readings
        Node monitoring
        Risk and AI confidence
        Trend monitoring
        Node health
        Alerts panel
        Siren and SMS status
        Hardware data ingestion
        Disaster monitoring models

The complete website source code is available in:
software/website/

## Website Project Structure

```text
software/website/
│
├── .env.example
├── .gitignore
├── disaster_monitoring.db
├── flashflood_model.pkl
├── index.html
├── landslide_model.pkl
├── metadata.json
├── package.json
├── README.md
├── server.ts
├── tsconfig.json
├── vite.config.ts
│
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── types.ts
    │
    ├── components/
    │   ├── NodeMap.tsx
    │   ├── AllSensorReadings.tsx
    │   ├── RiskAndAiConfidence.tsx
    │   ├── Trends.tsx
    │   ├── NodeHealth.tsx
    │   ├── AlertsPanel.tsx
    │   ├── SirenAndSmsStatus.tsx
    │   └── HardwareIngestionModal.tsx
    │
    └── utils/
        ├── disasterMEngine.ts
        ├── edgeAi.ts
        ├── mockDataAdapter.ts
        ├── mockNodes.ts
        ├── sirenAudio.ts
        └── trainedTrees.json
```
----------------

## Key Features
Environmental Monitoring

SAJAG collects environmental information using multiple sensors integrated with the Arduino Nano.

Vibration Monitoring

The system includes vibration sensing using MPU6050 and SW-420 based sensing components.

Soil Moisture Monitoring

A capacitive soil moisture sensor is used for monitoring soil moisture conditions.

Distance / Level Monitoring

The HC-SR04 ultrasonic sensor is used for distance or level-related measurements.

Atmospheric Monitoring

The BMP180 sensor provides atmospheric pressure and altitude-related measurements.

Wireless Communication

The HC-05 Bluetooth module provides wireless communication between the hardware system and connected software components.

Local Warning

A buzzer module is included for local warning indication.

Edge-AI Based Risk Analysis

The software includes disaster monitoring models and risk-analysis functionality for the SAJAG monitoring system.

Power System

The hardware prototype includes power regulation and power supply components.

The LM2596S-5 module is used for voltage regulation, while solar cells and a battery are included as power sources in the hardware design.
-----------------------

## Technologies Used

Hardware
Arduino Nano
MPU6050
BMP180
SW-420
HC-SR04
HC-05
Capacitive Soil Moisture Sensor
Buzzer Module
LM2596S-5
Solar Cell
Battery

Software
React
TypeScript
Vite
Node.js / TypeScript server
Web-based monitoring dashboard
Edge-AI / disaster monitoring models
-----------------------------
## Repository Structure

```text
SAJAG-SIH-2026/
│
├── README.md
│
├── hardware/
│   ├── schematic/
│   │   └── SIH_schematic.pdf
│   │
│   ├── prototype/
│   │   └── Prototype Image
│   │
│   └── components/
│       └── Components Information
│
├── software/
│   └── website/
│       ├── .env.example
│       ├── .gitignore
│       ├── disaster_monitoring.db
│       ├── flashflood_model.pkl
│       ├── index.html
│       ├── landslide_model.pkl
│       ├── metadata.json
│       ├── package.json
│       ├── README.md
│       ├── server.ts
│       ├── tsconfig.json
│       ├── vite.config.ts
│       │
│       └── src/
│           ├── App.tsx
│           ├── index.css
│           ├── main.tsx
│           ├── types.ts
│           ├── components/
│           └── utils/
│
└── demo/
```
-----------------------------

## Smart India Hackathon 2026 – Team Information

Project Name:
SAJAG – Village Environmental Intelligence & Disaster Early Warning System

Event:
Smart India Hackathon 2026

Team Name:
Team Cyborg

Team ID:185933

Institute:
CUMMINS COLLEGE OF ENGINEERING FOR WOMEN,PUNE

Department:
Electronics & Telecommunication Engineering

Team Members:
Team leader-Juee Walunj
Team members-Manjiri Chavan
             Niyati Gupta
             Purva Rathi
             Shweta Pawaskar
             Srishti Shewale

## Project Documentation

This repository contains:

Hardware schematic
Prototype documentation
Component information
Website source code
Disaster monitoring models
Database and metadata files
Demonstration recording
Repository Purpose

This repository contains the hardware documentation, prototype evidence, component information, software source code and demonstration material developed for the SAJAG Smart India Hackathon 2026 project.

## Demo
https://drive.google.com/file/d/1s2kR_NAZOd65lcFGWbwSv8rNvXUrRjzo/view?usp=sharing

Note
SAJAG is developed as a prototype for localized environmental intelligence and disaster early warning. This repository documents the current hardware and software implementation developed for the Smart India Hackathon 2026 project.

