export async function POST(req: Request) {
  const body = await req.json();

  return Response.json({
    success: true,
    campaignId: Date.now(),
    status: "sent",
    recipients: body.recipients || 0,
  });
}