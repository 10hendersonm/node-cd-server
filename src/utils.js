export const createDockerfile = ({projectName, commitId, cloneUrl, buildSteps}) => {
  return `FROM node
WORKDIR /tmp
COPY . /tmp/
RUN yarn
WORKDIR /build
RUN git clone ${cloneUrl} /build
${buildSteps.map((step) =>
    `RUN ${step}`
  ).join('\r\n')}
CMD node /tmp/dockerize.js ${projectName}-${commitId}
`
}
