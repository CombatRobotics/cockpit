#! /bin/bash
bun run dev --host &
python3 scripts/ping_display.py &
python3 scripts/home_navig.py &
sleep 3
# chromium-browser --start-fullscreen http://localhost:5173/#/ 

