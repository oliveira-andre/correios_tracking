FROM node:latest

ENV INSTALL_PATH /correios_tracking
RUN mkdir -p $INSTALL_PATH
WORKDIR $INSTALL_PATH

COPY . .

RUN yarn global add node
RUN yarn install
