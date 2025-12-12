# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PHB Components is a React component library for PHB Solution, styled with Tailwind CSS 4. The library implements a shadcn/ui-compatible design system with PHB branding (Primary: #0D5697 Blue, Secondary: #FFC100 Yellow).

## Commands

```bash
# Build TypeScript to dist/
npm run build
```

## Architecture

### Current State
Single-file library (`src/index.ts`) containing:
- **Utilities**: `cn()` class name merger
- **Design System**: `InjectStyles` component that injects Tailwind CDN, Google Fonts (Noto Sans HK), and CSS variables for light/dark themes
- **Core Components**: Button, Card (with Header/Title/Description/Content/Footer), Input, Label, Textarea, Checkbox, Select, Badge, Table (with Header/Body/Row/Head/Cell)
- **Complex Components**: SimpleBarChart, ChatInterface
- **Layout Components**: Navbar, Sidebar
- **Demo App**: Full dashboard showcasing all components

### Component Patterns
- All components use `React.forwardRef` where applicable
- Styling via Tailwind classes with `cn()` utility for conditional merging
- Variants implemented as internal objects (e.g., `variants`, `sizes` in Button)
- Dark mode support via CSS variables and `dark` class on `<html>`

### Design Tokens (CSS Variables)
Defined in `InjectStyles`:
- `--primary`, `--secondary`, `--background`, `--foreground`
- `--muted`, `--accent`, `--destructive`, `--card`, `--popover`
- `--border`, `--input`, `--ring`, `--radius`

### Dependencies
- React (peer)
- lucide-react (icons)
- Tailwind CSS 4 (via CDN currently)

## Development Notes

- TypeScript strict mode enabled
- Output target: ES2016, CommonJS modules
- Components follow shadcn/ui naming conventions for potential future compatibility
