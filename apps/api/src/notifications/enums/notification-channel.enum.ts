export enum NotificationChannel {
  // Digital channels
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
  
  // Traditional channels
  VOICE_CALL = 'VOICE_CALL',
  WHATSAPP = 'WHATSAPP',
  
  // System channels
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  DASHBOARD = 'DASHBOARD',
  
  // Integration channels
  SLACK = 'SLACK',
  MS_TEAMS = 'MS_TEAMS',
  
  // Fallback channel
  NONE = 'NONE',
}
