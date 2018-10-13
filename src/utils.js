export const createDockerfile = ({projectName, commitId, cloneUrl, buildSteps}) => {
  return `FROM debian
WORKDIR /build
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get upgrade
RUN apt-get install nodejs yarn git docker -y
RUN git clone ${cloneUrl} /build
${buildSteps.map((step) => `RUN ${step}`).join('\r\n')}
RUN docker build -t ${projectName}-${commitId} .
`
}
