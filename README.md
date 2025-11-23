# Digital Badge

A 3D interactive badge with gyroscope support.

## Features

- 3D tilt effects with mouse and gyroscope
- Mobile gyroscope support

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to the local URL shown in the terminal.

## Avatar

The avatar uses an iframe that can be created with Figma's Shapelax plugin. Export your Shapelax design as HTML and set the `avatarUrl` in `App.tsx` to point to the exported HTML file.

## Customization

Edit `App.tsx` to customize your badge information:
- Name, roles, and tags
- Contact information
- Bio
- Avatar URL
