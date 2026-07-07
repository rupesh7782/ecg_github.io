# ECG & Cardiac Monitoring System

**IoT · Machine Learning · Python**
*Mar 2023 – Jul 2023*

A real-time ECG (electrocardiogram) monitoring system built for continuous cardiac health tracking and remote patient monitoring. The system captures live ECG signals via hardware sensors, streams the data to the cloud, and applies machine learning to flag abnormal heart conditions in real time.

---

## 🩺 Overview

This project combines embedded hardware, IoT cloud infrastructure, and data science to create an end-to-end cardiac monitoring pipeline — from raw electrical signal acquisition on the body to real-time alerts on abnormal heart activity.

---

## ✨ Features

- **Real-time ECG acquisition** using the AD8232 ECG sensor module and ECG electrodes
- **Wireless data transmission** via ESP8266 (Wi-Fi microcontroller)
- **Cloud-based visualization** of ECG and pulse data using Ubidots IoT Cloud
- **Remote patient monitoring** — data accessible from anywhere via the cloud dashboard
- **Time-series signal processing** in Python for cleaning and analyzing ECG waveforms
- **Machine learning-based anomaly detection** for early identification of abnormal heart conditions
- **Real-time alert notifications** when irregular cardiac patterns are detected

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Microcontroller | ESP8266 |
| Sensor | AD8232 ECG Sensor Module + ECG Electrodes |
| IoT Cloud Platform | Ubidots |
| Data Processing | Python (NumPy, Pandas) |
| Machine Learning | Python (scikit-learn) |
| Communication Protocol | Wi-Fi / HTTP / MQTT (Ubidots API) |

---

## ⚙️ System Architecture

```
ECG Electrodes → AD8232 Sensor → ESP8266 (Wi-Fi MCU)
                                        │
                                        ▼
                              Ubidots IoT Cloud
                                        │
                        ┌───────────────┴───────────────┐
                        ▼                                ▼
              Real-time Dashboard              Python Processing Pipeline
             (Remote Monitoring)                (Signal Analysis + ML)
                                                         │
                                                         ▼
                                              Abnormality Detection
                                                         │
                                                         ▼
                                                Real-time Alerts
```

---

## 🔬 How It Works

1. **Signal Acquisition** — The AD8232 sensor captures analog ECG signals from electrodes placed on the body.
2. **Data Transmission** — The ESP8266 reads the analog signal, converts it, and pushes it to Ubidots over Wi-Fi.
3. **Cloud Visualization** — Ubidots plots real-time ECG and pulse waveforms on a live dashboard for remote viewing.
4. **Signal Processing** — Python scripts pull the time-series data and clean/preprocess it (filtering noise, normalizing waveforms).
5. **Anomaly Detection** — A trained machine learning model analyzes the processed ECG data to identify irregular heart patterns (e.g., arrhythmia indicators).
6. **Alerting** — When an abnormality is detected, the system triggers a real-time notification for early medical intervention.

---

## 🚀 Getting Started

### Hardware Requirements
- ESP8266 (NodeMCU or similar board)
- AD8232 ECG Sensor Module
- ECG Electrodes (disposable, 3-lead)
- Jumper wires + breadboard
- USB power source

### Software Requirements
- Arduino IDE (for flashing ESP8266 firmware)
- Python 3.x
- Ubidots account (free tier works for prototyping)

### Setup

1. **Hardware wiring**
   - Connect AD8232 output pin to ESP8266 analog input (A0)
   - Connect LO+ and LO- leads to ESP8266 digital pins for lead-off detection
   - Attach electrodes per standard 3-lead ECG placement

2. **Flash the firmware**
   - Open the ESP8266 sketch in Arduino IDE
   - Add your Wi-Fi credentials and Ubidots API token
   - Upload to the board

3. **Configure Ubidots**
   - Create a new device and variables (`ecg`, `pulse`) in your Ubidots account
   - Set up a dashboard widget to visualize the incoming data stream

4. **Run the Python pipeline**
   ```bash
   pip install -r requirements.txt
   python fetch_and_process.py
   ```
   This pulls data from the Ubidots API, processes the ECG signal, and runs it through the trained ML model.

5. **Train / update the ML model** (optional)
   ```bash
   python train_model.py
   ```

---

## 📊 Machine Learning Approach

- **Input:** Preprocessed time-series ECG signal features (e.g., R-R intervals, heart rate variability, waveform amplitude)
- **Model:** Classification model trained to distinguish normal vs. abnormal cardiac patterns
- **Output:** Real-time prediction label + confidence score, used to trigger alerts

---

## 📌 Future Improvements

- Mobile app integration for push notifications
- Support for additional ECG leads for higher diagnostic accuracy
- Edge inference on ESP32 to reduce cloud dependency
- Integration with a doctor-facing dashboard for multi-patient monitoring

---

## 👤 Author

**Rupesh Chavan**
- GitHub: [github.com/rupesh7782](https://github.com/rupesh7782)
- LinkedIn: [linkedin.com/in/rupesh-chavan-43664a219](https://linkedin.com/in/rupesh-chavan-43664a219)
