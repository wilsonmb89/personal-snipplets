# Create image based on the official Node 6 image from dockerhub
FROM circleci/node:8.15.0-browsers

RUN sudo curl "https://d1vvhvl2y92vvt.cloudfront.net/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
    && sudo unzip awscliv2.zip \
    && sudo ./aws/install \
    && aws2 --version

RUN sudo npm install -g ionic@3.9.2 \
    && sudo npm install -g cordova \
    && sudo npm install -g gulp \
    && sudo npm install -g sonarqube-scanner \
    && sudo npm install -g ionic-plugin-keyboard \
    && sudo npm install -g cordova-plugin-whitelist \
    && sudo npm install -g cordova-plugin-device \
    && sudo npm install -g cordova-plugin-splashscreen \
    && sudo npm install -g cordova-plugin-ionic-webview \
    && sudo npm install -g karma-cli