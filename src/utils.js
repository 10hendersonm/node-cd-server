export const createDockerfile = ({projectName, commitId, cloneUrl, buildSteps}) => {
  return `FROM node
COPY dockerize.js /tmp/dockerize.js
WORKDIR /build
RUN git clone ${cloneUrl} /build
${buildSteps.map((step) => `RUN ${step}`).join('\r\n')}
CMD node /tmp/dockerize.js ${projectName}-${commitId}
`
}
