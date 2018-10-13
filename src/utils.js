import uuid from 'uuid/v4'

export const createDockerfile = ({projectName, commitId, cloneUrl, buildSteps}) => {
  return `
FROM node as builder
WORKDIR /build #${uuid()}
RUN git clone ${cloneUrl} /build
${buildSteps.map((step) =>
  `RUN ${step}`
).join('\r\n')}

FROM docker
WORKDIR /build
COPY --from=builder /build .
CMD docker build --no-cache -t ${projectName}-${commitId} .
`
}
