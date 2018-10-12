FROM node
WORKDIR /app
COPY . /app
CMD yarn
CMD yarn build
RUN yarn serve