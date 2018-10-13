FROM node
RUN git clone GIT_CLONE_URL build
WORKDIR /build
BUILD_STEPS
RUN docker build -t DOCKER_NAME .