# Guía de dimensiones para imágenes

Este documento define los tamaños que debe usar **diseño gráfico** para exportar imágenes, de acuerdo a cómo están implementadas en el frontend (`HeroSlider`, `ProductPage`, etc.).

---

## Banner principal (Home / Hero Slider)
- **Desktop:** 1920 × 1080 px  
- **Tablet:** 1280 × 720 px  
- **Móvil:** 768 × 1024 px (vertical)  
==Imágenes horizontales, de alta calidad. Ocupan **pantalla completa**.

---

## Foto de portada (cabecera de producto)
- **Desktop:** 1920 × 600 px  
- **Tablet:** 1280 × 500 px  
- **Móvil:** 768 × 400 px  
== Imagen panorámica tipo **banner largo y delgado**.

---

## Especificaciones de producto
- **Desktop:** 800 × 800 px  
- **Tablet:** 600 × 600 px  
- **Móvil:** 400 × 400 px  
== Formato **cuadrado (1:1)**, mostrar producto limpio y centrado.

---

## Beneficios
- **Desktop:** 900 × 1200 px  
- **Tablet:** 600 × 800 px  
- **Móvil:** 400 × 600 px  
==Formato **vertical (3:4)**, estilo póster/ilustración de apoyo.

---

 **Nota:**  
Estas dimensiones están definidas según el código actual (`Hero.astro`, `HeroSlider.jsx`, `ProductPage.jsx`).  
El diseño debe exportar imágenes en estos tamaños para evitar recortes, deformaciones o pérdida de calidad.

---
17/09/25 