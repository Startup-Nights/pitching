export const loader = () => {
  const robotText = `
    User-agent: *
    Allow: /

    Disallow: /vote*
    Disallow: /overview*
    Disallow: /success*
    `

  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    }
  });
};

