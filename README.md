# GlassParrot

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ElenaTomasVela_GlassParrot&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ElenaTomasVela_GlassParrot)
[![.github/workflows/testing.yaml](https://github.com/ElenaTomasVela/GlassParrot/actions/workflows/testing.yaml/badge.svg)](https://github.com/ElenaTomasVela/GlassParrot/actions/workflows/testing.yaml)

Language models are easier to access than ever. With many companies creating
their own implementations on these technologies, it's hard to not come across
them. What isn't so easy to access, though, is the knowledge of how these
models work. This information is mostly hidden and dismissed as "too technical".
However, this leads to people relying on their own intuition as to how they work,
mostly looking like "magic". This project aims to lower the barrer of entry to
grasp the basic concepts of how these technologies work without requiring
extensive previous knowledge.

GlassParrot allows training basic language models based on Markov chains and n-grams
in a simple web application. The training data and resulting models are not uploaded
or stored anywhere.

## Running a development environment

As this is a simple Vite application built with Bun, all that's needed
is to have Bun installed and run the following command:

```bash
bun run vite
```

This opens the application by default in port 5173.
