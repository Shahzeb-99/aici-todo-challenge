# Use official Node.js LTS image
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source
COPY . .

# Build if using TypeScript or similar
RUN npm run build

# Expose internal app port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
