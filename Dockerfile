# syntax=docker/dockerfile:1

ARG NODE_VERSION=23.6.1

################################################################################
# Base image for all stages.
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

################################################################################
# Stage for installing production dependencies.
FROM base AS deps
# Copy package manifest files into the image.
COPY package.json package-lock.json ./
# Install production dependencies.
RUN npm ci --omit=dev

################################################################################
# Stage for building the application.
FROM deps AS build
# Copy the package manifests again (to ensure caching and build consistency).
COPY package.json package-lock.json ./
# Install all dependencies (including dev dependencies if needed for build).
RUN npm ci
# Copy the rest of the source files.
COPY . .
# Build the application.
RUN npm run build

################################################################################
# Final stage: minimal runtime image.
FROM base AS final
# Set the production environment.
ENV NODE_ENV production
# Run the application AS a non-root user.
USER node
# Copy package manifest (if needed for runtime commands).
COPY package.json .
# Copy production dependencies from the deps stage.
COPY --from=deps /usr/src/app/node_modules ./node_modules
# Copy the built application from the build stage.
COPY --from=build /usr/src/app/dist ./dist
# Expose the port the app listens on.
EXPOSE 3000
# Start the application.
CMD npm start