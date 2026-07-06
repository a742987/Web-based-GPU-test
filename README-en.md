# GPU Stress Test

This is a single-file WebGL stress test page designed to load the GPU with a heavy rendering workload.

## What it does

- Renders a full-screen animated scene with expensive fragment shading.
- Uses offscreen feedback buffers to increase GPU work per frame.
- Can run multiple WebGL engines in parallel for higher pressure.
- Displays FPS, frame time, internal resolution, and runtime status.

## How to use

1. Open `gpu-stress-test.html` in a modern desktop browser.
2. Click `Start Test` to begin.
3. Use the controls to tune the load.
4. Click `Pause` or `Stop and Reset` to reduce the load.

## Controls

- `Resolution Scale`: increases or decreases internal render resolution.
- `Shader Complexity`: changes how much work the fragment shader performs.
- `Draw Passes`: controls how many offscreen passes each engine performs.
- `Concurrent Engines`: runs multiple WebGL contexts in parallel.
- `Speed`: changes animation speed and shader time variation.

## Presets

- `Safe`: lowest default load, suitable for verifying that the page works.
- `Medium`: balanced load.
- `Extreme`: heavy load.
- `Ultra`: highest built-in load.

## Notes

- This page can make fans ramp up quickly and may heat the device noticeably.
- If the browser becomes sluggish, use `Pause` first, then `Stop and Reset`.
- WebGL support is required.

