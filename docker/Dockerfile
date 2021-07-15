FROM spotify/techdocs:latest

RUN apk add --update nodejs npm && npm install -g @techdocs/cli

WORKDIR /workspace/

ENTRYPOINT [ "techdocs-cli" ]
