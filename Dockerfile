FROM node:16.15.0-alpine as builder

RUN apk add --no-cache git python3 build-base

EXPOSE 3000

WORKDIR /opt/app

# This is super-ugly, but it means we don't have to re-run npm install every time any of the source
# files change- only when any dependencies change- which is a superior developer experience when
# relying on docker-compose.
COPY ./package.json .
COPY ./package-lock.json .
RUN npm ci --only=production

COPY src /opt/app/src

FROM node:16.15.0-alpine
WORKDIR /opt/app


ARG BUILD_DATE
ARG VCS_URL
ARG VCS_REF
ARG VERSION

# See http://label-schema.org/rc1/ for label schema info
LABEL org.label-schema.schema-version="1.0"
LABEL org.label-schema.name="sdk-scheme-adapter"
LABEL org.label-schema.build-date=$BUILD_DATE
LABEL org.label-schema.vcs-url=$VCS_URL
LABEL org.label-schema.vcs-ref=$VCS_REF
LABEL org.label-schema.url="https://mojaloop.io/"
LABEL org.label-schema.version=$VERSION

# Create a non-root user: ml-user
RUN adduser -D ml-user 
USER ml-user

COPY --chown=ml-user --from=builder /opt/app .

CMD ["npm", "run", "start"]
