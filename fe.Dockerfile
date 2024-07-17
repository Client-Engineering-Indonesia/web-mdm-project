# Use an official Node runtime as a parent image for building the React app
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the package.json and install dependencies
COPY package.json ./
RUN npm install
RUN npm install js-cookie
RUN npm install jwt-decode
RUN npm install gojs
RUN npm install gojs-react
RUN npm install axios

# Copy the rest of the application and build the React app
COPY ./ ./
RUN npm run build

# Expose port 3000 for React
EXPOSE 3000

# Command to run the React app
CMD ["npm", "start"]
