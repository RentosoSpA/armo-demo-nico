import type { ChatMessage } from '../types/rentoso';

/**
 * Generate unique session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create user message
 */
export function createUserMessage(content: string): ChatMessage {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'user',
    content,
    timestamp: new Date()
  };
}

/**
 * Create assistant message
 */
export function createAssistantMessage(
  content: string,
  extra?: Partial<ChatMessage>
): ChatMessage {
  return {
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'assistant',
    content,
    timestamp: new Date(),
    ...extra
  };
}

/**
 * Format visit date/time
 */
export function formatVisitDateTime(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const timeStr = date.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit'
  });

  if (isToday) {
    return `Hoy a las ${timeStr}`;
  } else if (isTomorrow) {
    return `Mañana a las ${timeStr}`;
  } else {
    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Chilean phone number
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^9\d{8}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate Chilean RUT
 */
export function isValidRUT(rut: string): boolean {
  // Remove dots and dash
  const cleanRUT = rut.replace(/\./g, '').replace(/-/g, '');
  
  if (cleanRUT.length < 2) return false;
  
  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1).toUpperCase();
  
  // Calculate verification digit
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const expectedDV = 11 - (sum % 11);
  const calculatedDV = expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : expectedDV.toString();
  
  return dv === calculatedDV;
}
