#!/bin/bash

set -e

IMAGE_NAME="expense-tracker-backend"
IMAGE_TAG="latest"

prune_images() {
    echo "Pruning all dangling images..."
    docker image prune -f
    echo "Dangling images pruned successfully."
}

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

echo "Starting build and prune process..."

prune_images

build_image

prune_images

run_image

echo "Build and prune process completed successfully."