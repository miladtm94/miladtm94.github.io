---
title: "Face Recognition with FaceNet"
excerpt: "Standalone face verification and identification system using a pretrained FaceNet (Inception-based) model. Generates 128-dimensional face embeddings for 1:1 verification and 1:K recognition against a stored database. Built with TensorFlow/Keras, designed for extensibility and educational use."
collection: portfolio
category: software
date: 2023-06-01
codeurl: "https://github.com/miladtm94/FaceRecognition-FaceNet"
---

**Language:** Python 3.7+ &nbsp;&middot;&nbsp; **Framework:** TensorFlow 2 / Keras

## Overview

A standalone face recognition system built on a pretrained FaceNet model (Inception architecture). Implements both face verification and face recognition with a clean, modular package structure.

**Key features:**
- **Face Embedding Generation** — 128-dimensional embeddings via FaceNet (Inception-based architecture)
- **Face Verification (1:1)** — Authenticates whether a presented face matches a claimed identity using L2 distance thresholding
- **Face Recognition (1:K)** — Identifies unknown individuals by nearest-neighbour lookup against a stored embedding database
- **Database Management** — Utilities for building and updating the known-faces database
- **Modular Architecture** — Separate modules for model loading, image preprocessing, and database operations

**Technologies:** Python · TensorFlow 2 · Keras · NumPy · Pillow · Deep Learning · Computer Vision
