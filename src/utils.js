export const createDockerfile = ({projectName, commitId, cloneUrl, buildSteps}) => {
  return `FROM ubuntu
WORKDIR /build
RUN apt-get update && apt-get upgrade
RUN apt-get install nodejs git npm docker
RUN git clone ${cloneUrl} /build
${buildSteps.map((step) =>
    `RUN ${step}`
  ).join('\r\n')}
CMD docker build -t ${projectName}-${commitId} .
`
}
