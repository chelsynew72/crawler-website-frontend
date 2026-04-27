export const onRequest: PagesFunction = async () => {
  return Response.json({
    name: "Cloudflare",
  });
};
