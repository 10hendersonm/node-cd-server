export const createDockerfile = ({projectName, commitId, cloneUrl, buildSteps}) => {
  return `FROM node
WORKDIR /build
COPY dockerize.js /tmp
RUN git clone ${cloneUrl} /build
${buildSteps.map((step) => `RUN ${step}`).join('\r\n')}
CMD node /tmp/dockerize.js ${projectName}-${commitId}
`
}
