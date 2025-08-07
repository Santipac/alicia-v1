# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Alicia v1" - a React-based frontend for real-time speaker recognition using ElevenLabs Conversational AI and a WebSocket-based speaker recognition backend. The application provides dual conversation interfaces:

1. **ElevenLabs Conversation**: Uses `voice-stream` library for conversational AI with WebSocket connection
2. **Backend Speaker Recognition**: Custom WebSocket connection for real-time speaker identification

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production (runs TypeScript compilation first)
- `pnpm lint` - Run ESLint
- `pnpm preview` - Preview production build

## Architecture

### Core Components
- `src/App.tsx` - Main application component with animated layout and orb
- `src/components/conversation.tsx` - Conversation interface managing both ElevenLabs and speaker recognition states
- `src/hooks/use-agent-conversation.ts` - Main orchestration hook for dual conversation (ElevenLabs + WebSocket)
- `src/hooks/use-speaker-recognition.ts` - WebSocket hook for speaker recognition backend
- `src/hooks/use-audio-player.ts` - Audio playback management for agent responses

### Backend Integration
- **WebSocket URL**: `ws://localhost:8000/ws/recognize` (defined in `src/constants/index.ts`)
- **Audio Format**: Base64 encoded audio chunks from `voice-stream`
- **Protocol**: Sends Base64 audio data converted to binary, receives JSON speaker recognition results

### Speaker Recognition Data Structure
The backend returns `SpeakerRecognitionResult` objects with:
- `speakers`: Record of speaker IDs to confidence percentages as strings
- `inferred_speaker`: Currently detected speaker name
- `activation_threshold`: Boolean indicating voice activity detection
- `audio_energy`, `current_audio_energy`: Energy metrics
- `activation_threshold_limit`, `speaker_confidence_threshold`: Detection thresholds
- `timestamp`, `audio_length`, `total_speakers`: Metadata

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 with Geist font
- **Audio Processing**: `voice-stream` library for microphone capture
- **AI Integration**: Direct WebSocket to ElevenLabs API (not using React SDK)
- **Animation**: Framer Motion (`motion/react`)
- **Build**: Vite with SWC for fast refresh

## Key Implementation Details

### Audio Processing Architecture
- **Microphone Capture**: `voice-stream` library handles audio capture and Base64 encoding
- **Dual Audio Streaming**: Same audio stream sent to both ElevenLabs and speaker recognition
- **Audio Conversion**: `use-speaker-recognition.ts` converts Base64 to ArrayBuffer for WebSocket transmission
- **Audio Playback**: `use-audio-player.ts` manages queued audio chunks from ElevenLabs

### Conversation Management (`use-agent-conversation.ts`)
- **ElevenLabs Connection**: Direct WebSocket to `wss://api.elevenlabs.io/v1/convai/conversation`
- **Agent ID**: `agent_2801k1gq1rxnem5s81sjspd04ggr` (defined in constants)
- **Speaker Change Detection**: Automatically detects speaker changes and sends context updates to ElevenLabs
- **State Management**: Manages connection states for both ElevenLabs and speaker recognition
- **Lifecycle Management**: Handles starting/stopping both services simultaneously

### Speaker Recognition Hook (`use-speaker-recognition.ts`)
- **Connection Management**: WebSocket lifecycle with reconnection capability
- **Audio Processing**: Base64 to ArrayBuffer conversion for binary transmission
- **Result Handling**: Parses JSON responses and triggers callbacks
- **Error Handling**: Comprehensive error logging and connection state tracking

### UI Components
- **Animated Orb**: Central visual element with motion animations
- **Status Display**: Real-time connection status, agent speaking state, and inferred speaker
- **Gradient Layout**: Dynamic background with animated gradients
- **Motion Components**: Extensive use of Framer Motion for smooth transitions