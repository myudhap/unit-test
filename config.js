require('dotenv').config()

const env = {
  host: process.env.API_URL || "http://localhost:3030",
}

module.exports = env