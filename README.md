# nodejstelegrammbot
This is a simple telegram bot for getting server status. Launched on a raspberry as a systemd service.
Written in Javascript, launched via node.
To create a service, add a file with 755 rights to the folder - /etc/systemd/system/

Minimal file contents:
[Unit]
Description=some description
Documentation=none
After=network.target #I think this will come in handy

[Service]
Type=exec
ExecStart=/home/User/.nvm/versions/node/v21.7.3/bin/node /home/User/Projects/nodejstelegrammbot/index.js #use node via NVM
KillMode=process
Restart=always
RestartSec=3s

[Install]
WantedBy=multi-user.target
Alias=nodejstelegrammbot.service

Commands for activation and launch:
sudo systemctl enable nodejstelegrammbot.service
sudo systemctl start nodejstelerambot.service
sudo systemctl status nodejstelerambot.service
