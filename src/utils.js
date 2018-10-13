export const createDockerfile = ({projectName, projectId, commitId, cloneUrl, buildSteps}) => {
  return `
FROM node as builder
RUN echo Running build for ${commitId}
WORKDIR /build
RUN git clone ${cloneUrl} /build
${buildSteps.map((step) =>
  `RUN ${step}`
).join('\r\n')}

FROM docker
WORKDIR /build
COPY --from=builder /build .
CMD docker build --no-cache -t ${projectName}-${projectId}:${commitId} .
`
}
