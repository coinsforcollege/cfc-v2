# Notification Sounds

This directory contains audio files for notifications.

## Required Files

1. **notification.mp3** - Main notification chime sound
   - Recommended: Pleasant, subtle notification sound (1-2 seconds)
   - You can use free sounds from:
     - https://notificationsounds.com/
     - https://mixkit.co/free-sound-effects/notification/
     - https://freesound.org/

## Usage

The notification sound is played when:
- A new notification arrives via WebSocket
- User is currently logged in and active on the platform

The sound file is referenced in: `client/src/contexts/NotificationContext.jsx`
