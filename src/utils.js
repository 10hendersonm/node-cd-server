export const createDockerfile = ({projectName, commitId, cloneUrl, buildSteps}) => {
  return `FROM ubuntu
WORKDIR /build
RUN apt-get update && apt-get upgrade -y
RUN apt-get install nodejs git npm docker -y
RUN git clone ${cloneUrl} /build
${buildSteps.map((step) =>
    `RUN ${step}`
  ).join('\r\n')}
CMD docker build -t ${projectName}-${commitId} .
`
}
