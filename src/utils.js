export const createDockerfile = ({projectName, commitId, cloneUrl, buildSteps}) => {
  return `FROM node
COPY /app/build/dockerize.js /tmp
WORKDIR /build
RUN git clone ${cloneUrl} /build
${buildSteps.map((step) => `RUN ${step}`).join('\r\n')}
CMD node /tmp/dockerize.js ${projectName}-${commitId}
`
}
