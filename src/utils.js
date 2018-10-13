export const createDockerfile = ({projectName, commitId, cloneUrl, buildSteps}) => {
  return `FROM node
WORKDIR /build
RUN git clone ${cloneUrl} /build
${buildSteps.map((step) => `RUN ${step}`).join('\r\n')}
`
}
