#!/bin/bash

# ImmutableFeed Backend Deployment Script

echo "🚀 Deploying ImmutableFeed Smart Contracts..."

# Check if Aptos CLI is installed
if ! command -v aptos &> /dev/null; then
    echo "❌ Aptos CLI is not installed. Please install it first:"
    echo "   https://aptos.dev/tools/aptos-cli/install-cli/"
    exit 1
fi

# Navigate to move directory
cd move

# Compile the contracts
echo "📦 Compiling Move contracts..."
if ! aptos move compile; then
    echo "❌ Compilation failed!"
    exit 1
fi

echo "✅ Compilation successful!"

# Deploy to testnet
echo "🌐 Deploying to Aptos Testnet..."
if ! aptos move publish --assume-yes; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo "✅ Deployment successful!"
echo "🎉 Smart contracts are now live on Aptos Testnet!"

# Get the account address
ACCOUNT=$(aptos config show-profiles --profile default | grep "account" | awk '{print $2}')
echo "📍 Contract Address: $ACCOUNT"
echo "🔗 Explorer: https://explorer.aptoslabs.com/account/$ACCOUNT?network=testnet"