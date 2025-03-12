#!/bin/bash

# Exit on any error
set -e

# Variables
IMAGE_NAME="expense-tracker-backend"
IMAGE_TAG="latest"

# Function to prune all dangling images
prune_images() {
    echo "Pruning all dangling images..."
    docker image prune -f
    echo "Dangling images pruned successfully."
}

# Function to build the new image
build_image() {
    echo "Building new $IMAGE_NAME:$IMAGE_TAG image..."
    docker build -t $IMAGE_NAME:$IMAGE_TAG .
    if [ $? -eq 0 ]; then
        echo "Image $IMAGE_NAME:$IMAGE_TAG built successfully."
    else
        echo "Failed to build $IMAGE_NAME:$IMAGE_TAG image."
        exit 1
    fi
}

run_image() {
    echo "Running $IMAGE_NAME:$IMAGE_TAG image..."
    docker-compose up 
    if [ $? -eq 0 ]; then
        echo "Image $IMAGE_NAME running successfully."
    else
        echo "Failed to run $IMAGE_NAME image."
        exit 1
    fi
}

# Main execution
echo "Starting build and prune process..."

# Build new image
build_image

# Prune dangling images again (to clean up the old expense-tracker-backend:latest if it became dangling)
prune_images


run_image

echo "Build and prune process completed successfully."