export const createDockerfile = ({projectName, commitId, cloneUrl, buildSteps}) => {
  return `FROM node
COPY . /tmp
RUN ls /tmp
WORKDIR /build
RUN git clone ${cloneUrl} /build
${buildSteps.map((step) => `RUN ${step}`).join('\r\n')}
CMD node /tmp/dockerize.js ${projectName}-${commitId}
`
}
