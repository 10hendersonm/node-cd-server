export const createDockerfile = ({projectName, commitId, cloneUrl, buildSteps}) => {
  return `FROM node
RUN git clone ${cloneUrl} build
WORKDIR /build
${buildSteps.map((step) => `RUN ${step}`).join('\r\n')}
RUN docker build -t ${projectName}-${commitId} .`
}
