<!-- Improved compatibility of back to top link -->
<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">GameXpress - Frontend V2</h3>

<p align="center">
  Advanced frontend for GameXpress with full cart system, role-based UI, and seamless UX for guests and authenticated users.
  <br />
  <a href="https://github.com/issam-mhj/GameStore_Front-end"><strong>Explore the docs »</strong></a>
  <br />
  <br />
  <a href="https://github.com/issam-mhj/GameStore_Front-end">View Demo</a>
  ·
  <a href="https://github.com/issam-mhj/GameStore_Front-end/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
  ·
  <a href="https://github.com/issam-mhj/GameStore_Front-end/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
</p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#features">Features</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#development-roadmap">Development Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

GameXpress Frontend V2 is a complete React-based client interface designed to deliver a smooth and intelligent shopping experience.  
It introduces a **professional cart system**, **role-based access**, **automatic cart merging**, and **dynamic totals calculation** while ensuring guests and authenticated users enjoy consistent UX.

This version is built to integrate smoothly with a Laravel backend using **Sanctum authentication**.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

### Built With

* [React.js](https://react.dev/)
* [Axios](https://axios-http.com/)
* [React Router](https://reactrouter.com/)
* [React Toastify](https://fkhadra.github.io/react-toastify/)
* [Formik + Yup](https://formik.org/)
* [Recharts.js](https://recharts.org/)
* [Laravel Sanctum](https://laravel.com/docs/sanctum) (Backend auth)
* [React Dropzone](https://react-dropzone.js.org/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Features

### 🛒 Cart System (V2 – New)

- Add, update, and remove products  
- Guest cart stored in **localStorage/sessionStorage**  
- Authenticated cart stored in **database via API**  
- **Automatic cart fusion** when a guest logs in  
- Stock-aware quantity management  
- Automatic expiration after **48 hours**  
- Dynamic totals:
  - Subtotal
  - VAT (20%)
  - Discounts
  - Total TTC  

### 🔐 Role-Based Interface (Bonus)

| Role | Access |
|------|---------|
| Client | Cart + browsing |
| Manager | Orders management |
| Admin | Full access (users, roles, products, orders...) |

### 🧪 UX & Validation

- Axios Interceptors (global error handling)
- React Toastify notifications
- Yup/Formik validation
- Loaders for async actions
- Clean UI with role-locked components

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

* Node.js (>= 18)
* npm or yarn
* Backend API with Laravel Sanctum enabled

### Installation

1. Clone the repository:

```sh
git clone https://github.com/issam-mhj/GameStore_Front-end.git
cd GameStore_Front-end
