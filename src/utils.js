export const createDockerfile = ({projectName, commitId, cloneUrl, buildSteps}) => {
  return `FROM clone-build
WORKDIR /build
RUN git clone ${cloneUrl} /build
${buildSteps.map((step) => `RUN ${step}`).join('\r\n')}
`
}
