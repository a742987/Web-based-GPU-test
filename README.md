# GPU Stress Test

[日本語](https://github.com/a742987/Web-based-GPU-test/blob/main/README-ja.md) | [简体中文](https://github.com/a742987/Web-based-GPU-test/blob/main/README-zh-CN.md)

A single-file browser-based GPU stress test with a premium UI, multilingual support, and a Three.js wireframe render stage.

## What it does

- Renders a calm Three.js wireframe scene on the right side of the page.
- Uses hidden WebGL workloads to generate GPU pressure in the background.
- Supports three languages: English, Japanese, and Simplified Chinese.
- Shows FPS, frame time, internal resolution, and runtime state.

## How to use

1. Open `gpu-stress-test.html` in a modern desktop browser.
2. Choose a language from the `Language` selector.
3. Click `Start Test` to begin or pause the stress test.
4. Adjust the sliders and preset to change the load.

## Controls

- `Language`: switches the UI language.
- `Preset`: applies a preconfigured load profile.
- `Resolution Scale`: raises or lowers internal render resolution.
- `Shader Complexity`: changes the fragment work per pass.
- `Draw Passes`: changes how many offscreen passes are executed.
- `Concurrent Engines`: increases or reduces parallel GPU engines.
- `Speed`: changes animation speed and timing variation.

## Presets

- `Safe`: lowest default load.
- `Medium`: balanced load.
- `Extreme`: heavy load.
- `Ultra`: highest built-in load.

## Notes

- The page is designed to stress the GPU, so temperatures and fan speed may rise quickly.
- The interface is intentionally compact and low-noise to keep the controls readable.
- WebGL support is required.
