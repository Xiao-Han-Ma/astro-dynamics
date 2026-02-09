# Astro-Dynamics Command Center

An interactive, high-fidelity web-based simulation engine designed to visualize planetary kinematics, celestial geometric configurations, and advanced astronomical phenomena from a geocentric perspective.

---

## 🌌 Overview

The **Astro-Dynamics Command Center** is a specialized tool developed to bridge the gap between abstract orbital mechanics and visual observation. By leveraging heliocentric-to-geocentric coordinate transformations, the application provides an authentic representation of how planets move across the Earth's sky, including the complex "figure-8" retrograde loops and the photometric nuances of astronomical transits.

---

## 🚀 Key Features

### 1. Dynamic Orbital Modeling

* **Real-time Simulation**: Visualizes the orbits of Mercury, Venus, Earth, Mars, Jupiter, and Saturn.
* **Physics-Based Proportions**: Planetary orbital radii and angular velocities are scaled to reflect relative solar system dynamics.

### 2. Celestial Geometric Configurations

Demonstrates critical positional astronomy concepts with precise academic definitions:

* **Inferior Planets**: Visualizes **Inferior/Superior Conjunctions** and **Greatest Elongations** (Morning/Evening Star phases).
* **Superior Planets**: Explores **Conjunction**, **Opposition** (closest approach and full illumination), and **Quadrature** (90° alignment).

### 3. Dual-HUD Retrograde Tracking

A sophisticated observation module that tracks planetary "backward" motion using two synchronized perspectives:

* **Ecliptic Azimuth View**: Maps the apparent ecliptic longitude () on a 360° circular projection.
* **Sky Trajectory (Figure-8)**: A 3D-to-2D projection mapping **Longitude () vs. Latitude ()**. By incorporating orbital inclination (), the simulator reveals the authentic loop and S-shape patterns seen in professional ephemeris data.

### 4. Advanced Transit Analytics

Simulates the rare event of a planet crossing the solar disk with high-precision photometry:

* **Solar Disk Observation**: A high-resolution view of the transit ingress and egress.
* **Smart Time Dilation**: The simulation automatically decelerates when a transit occurs, allowing for detailed observation of the contact phases.
* **Luminosity Flux Analysis**: Real-time generation of a **Light Curve**. The occlusion model uses a non-linear *smoothstep* function to represent the gradual dip in solar brightness as the planetary disk occults the star.

---

## 🛠 Technical Implementation

### Coordinate Transformation

The simulator calculates the 3D position of planets in a heliocentric frame before translating them to a geocentric observer:

* **Geocentric Vector**: 
* **Apparent Longitude ()**: 
* **Apparent Latitude ()**: 

### Photometric Modeling

The transit light curve is not a simple step function. It models the fractional flux  based on the overlapping area of the solar and planetary disks, providing a smooth transition during the ingress and egress stages.

---

## 📖 How to Use

1. **Master Reset**: Use the `MASTER_RESET` button to return all planets to their initial epoch and real-time motion.
2. **Category Selection**: Choose between **Inferior** or **Superior** planets to unlock specific geometric configurations.
3. **Tracking**: Click **Retrograde Motion** and select a target (e.g., Mars) to activate the Dual-HUD tracking system.
4. **Transit**: Activate the **Transit Watch** to observe Venus crossing the Sun and monitor the resulting light curve in the analytics window.

---

## 🌐 Deployment

This project is designed to be hosted via **GitHub Pages**.

1. Push `index.html` to a public repository.
2. Enable GitHub Pages in **Settings > Pages**.
3. Access the live simulation at `https://[your-username].github.io/[repo-name]/`.

---

## ✍️ Author

**Xiaohan Ma**
*Space Physics Researcher | Data Science Enthusiast*

---

