export const createDockerfile = ({projectName, commitId, cloneUrl, buildSteps}) => {
  return `FROM debian
WORKDIR /build
RUN apt-get update && apt-get upgrade
RUN apt-get remove cmdtest
RUN apt-get install nodejs yarn git docker -y
RUN git clone ${cloneUrl} /build
${buildSteps.map((step) => `RUN ${step}`).join('\r\n')}
RUN docker build -t ${projectName}-${commitId} .
`
}
