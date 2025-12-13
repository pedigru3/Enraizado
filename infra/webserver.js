function getOrigin() {
  if (["test", "development"].includes(process.env.NODE_ENV)) {
    return "http://localhost:3000"
  }

  if (process.env.VERCEL_ENV === `preview`) {
    return `https://${process.env.VERCEL_URL}`
  }

  if (process.env.NODE_ENV === "production") {
    return `https://${process.env.NEXT_PUBLIC_URL}`
  }

  return "https://enraizado.vercel.app"
}

const webserver = {
  origin: getOrigin(),
}

export default webserver
