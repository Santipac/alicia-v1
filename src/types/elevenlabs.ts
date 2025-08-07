type BaseEvent = {
  type: string;
};

type ClientToolCall = BaseEvent & {
  type: 'client_tool_call';
  client_tool_call: {
    tool_call_id: string;
    tool_name: string;
    parameters: unknown;
  };
};

type UserTranscriptEvent = BaseEvent & {
  type: 'user_transcript';
  user_transcription_event: {
    user_transcript: string;
  };
};

type AgentResponseEvent = BaseEvent & {
  type: 'agent_response';
  agent_response_event: {
    agent_response: string;
  };
};

type AgentResponseCorrectionEvent = BaseEvent & {
  type: 'agent_response_correction';
  agent_response_correction_event: {
    original_agent_response: string;
    corrected_agent_response: string;
  };
};

type AudioResponseEvent = BaseEvent & {
  type: 'audio';
  audio_event: {
    audio_base_64: string;
    event_id: number;
  };
};

type InterruptionEvent = BaseEvent & {
  type: 'interruption';
  interruption_event: {
    event_id: number;
  };
};

type PingEvent = BaseEvent & {
  type: 'ping';
  ping_event: {
    event_id: number;
    ping_ms?: number;
  };
};

export type ElevenLabsWebSocketEvent =
  | UserTranscriptEvent
  | AgentResponseEvent
  | AgentResponseCorrectionEvent
  | AudioResponseEvent
  | InterruptionEvent
  | PingEvent
  | ClientToolCall;
