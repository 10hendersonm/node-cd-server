FROM node
WORKDIR /app
COPY . /app
RUN yarn
RUN yarn build
CMD yarn serve