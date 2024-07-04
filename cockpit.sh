#! /bin/bash
bun run dev --host &
sleep 3
chromium-browser --start-fullscreen http://localhost:5173/#/

