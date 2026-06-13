export async function POST(req: Request) {
  const body = await req.json();

  return Response.json({
    success: true,
    campaignId: body.campaignId,
    delivered: body.delivered,
    opened: body.opened,
    clicked: body.clicked,
  });
}