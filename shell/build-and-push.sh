#!/bin/bash

# Build and push images
docker buildx build --platform linux/amd64,linux/arm64 -t kpasd002/msa-nestjs-gateway -f ./apps/api-gateway/Dockerfile --target production --push .
docker buildx build --platform linux/amd64,linux/arm64 -t kpasd002/msa-nestjs-user -f ./apps/user/Dockerfile --target production --push .
docker buildx build --platform linux/amd64,linux/arm64 -t kpasd002/msa-nestjs-chat -f ./apps/chat/Dockerfile --target production --push .
