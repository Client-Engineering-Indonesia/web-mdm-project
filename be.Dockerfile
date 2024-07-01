# Use an official Python runtime as a parent image for running Flask
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy the backend application
COPY halo.py ./
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 5000 for Flask
EXPOSE 5000

# Command to run the Flask app
CMD ["python", "halo.py"]
