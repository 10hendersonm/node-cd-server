FROM node
WORKDIR /app
COPY . /app
CMD yarn build
RUN yarn start