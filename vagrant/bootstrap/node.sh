#!/usr/bin/env bash

echo "Installing NodeJS (CentOS method)"

#install EPEL repo
#/vagrant/scripts/epel.sh

echo "Installing NodeJS + NPM with EPEL"
yum install -y npm --enablerepo=epel

npm install -g nodemon pm2@latest

#pm2 startup systemd