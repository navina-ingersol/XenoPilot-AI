"use client";

import { useEffect, useRef, useState } from "react";

type GeneratedCampaign = {
  name: string;
  audience: string;
  reason: string;
  channel: string;
  message: string;
  expectedOpenRate: string;
  expectedClickRate: string;
};

type StrategyAnalysis = {
  goal: string;
  audienceSelected: string;
  whyCustomers: string[];
  whyChannel: string[];
  predictedRevenue: string;
  recoveryProbability: string;
  confidenceScore: number;
};

type CampaignCounts = {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
};

type ExecutionStage = "created" | "sent" | "delivered" | "opened" | "clicked" | "completed";

function parseAudienceSize(audience: string): number {
  const match = audience.match(/[\d,]+/);

  if (!match) {
    return 1500;
  }

  const size = parseInt(match[0].replace(/,/g, ""), 10);

  return isNaN(size) ? 1500 : size;
}

function getExecutionTargets(sent: number) {
  const delivered = Math.round(sent * 0.967);
  const opened = Math.round(delivered * 0.867);
  const clicked = Math.round(delivered * 0.47);
  return { sent, delivered, opened, clicked };
}

function formatCount(value: number): string {
  return value.toLocaleString("en-IN");
}

function generateMockCampaign(prompt: string): GeneratedCampaign {
  const normalized = prompt.toLowerCase();

  if (normalized.includes("inactive") || normalized.includes("bring back") || normalized.includes("win back")) {
    return {
      name: "Win Back Inactive Customers",
      audience: "342 customers",
      reason: "Customers have not purchased in the last 60 days.",
      channel: "WhatsApp",
      message: "Hi {{name}},\nWe've missed you. Enjoy 15% off your next purchase.",
      expectedOpenRate: "72%",
      expectedClickRate: "18%",
    };
  }

  if (normalized.includes("repeat") || normalized.includes("loyal") || normalized.includes("purchase again")) {
    return {
      name: "Loyalty Boost — Repeat Purchase Drive",
      audience: "1,847 customers",
      reason: "Customers with 2+ past orders who haven't purchased in the last 30 days.",
      channel: "Email",
      message: "Hi {{name}},\nThanks for being a loyal customer! Here's an exclusive 20% off your next order — just for you.",
      expectedOpenRate: "68%",
      expectedClickRate: "24%",
    };
  }

  if (normalized.includes("summer") || normalized.includes("collection") || normalized.includes("seasonal")) {
    return {
      name: "Summer Collection Launch",
      audience: "4,210 customers",
      reason: "Fashion-forward shoppers who engaged with seasonal campaigns in the past year.",
      channel: "SMS",
      message: "Hi {{name}},\nOur new Summer Collection is here! Shop the latest styles with free shipping on orders over ₹999.",
      expectedOpenRate: "81%",
      expectedClickRate: "31%",
    };
  }

  if (normalized.includes("cart") || normalized.includes("abandon")) {
    return {
      name: "Cart Recovery Campaign",
      audience: "218 customers",
      reason: "Customers who added items to cart but didn't complete checkout in the last 48 hours.",
      channel: "WhatsApp",
      message: "Hi {{name}},\nYou left something behind! Complete your order now and get 10% off with code COMEBACK10.",
      expectedOpenRate: "89%",
      expectedClickRate: "42%",
    };
  }

  return {
    name: "Smart Audience Campaign",
    audience: "892 customers",
    reason: "AI-identified segment matching your stated goal with high conversion potential.",
    channel: "Email",
    message: "Hi {{name}},\nWe have something special picked out just for you. Explore your personalized offer today.",
    expectedOpenRate: "65%",
    expectedClickRate: "16%",
  };
}

function generateMockStrategyAnalysis(prompt: string, campaign: GeneratedCampaign): StrategyAnalysis {
  const normalized = prompt.toLowerCase();
  const audienceSize = parseAudienceSize(campaign.audience);
  const targets = getExecutionTargets(audienceSize);
  const predictedRevenue = `₹${Math.round(targets.clicked * 310.9).toLocaleString("en-IN")}`;

  if (normalized.includes("inactive") || normalized.includes("bring back") || normalized.includes("win back")) {
    return {
      goal: "Reactivate dormant customers and recover revenue from buyers who have gone silent over the past 60 days.",
      audienceSelected: `${campaign.audience} with 3+ historical purchases and no activity in the last 60 days`,
      whyCustomers: [
        "These customers already trust your brand — reactivation costs 5× less than acquiring new ones.",
        "68% showed purchase intent signals (wishlists, browse history) before going inactive.",
        "Historical data shows this segment responds strongly to personalized discount offers within 72 hours.",
      ],
      whyChannel: [
        "WhatsApp delivers 98% open rates in your market — 3.4× higher than email for this segment.",
        "72% of these customers have an opted-in WhatsApp number on file.",
        "Rich media messages with personalized offers drive 2.1× more click-through than plain text SMS.",
      ],
      predictedRevenue,
      recoveryProbability: "28%",
      confidenceScore: 87,
    };
  }

  if (normalized.includes("repeat") || normalized.includes("loyal") || normalized.includes("purchase again")) {
    return {
      goal: "Drive repeat purchases from loyal customers who are overdue for their next order.",
      audienceSelected: `${campaign.audience} with 2+ completed orders and 30+ days since last purchase`,
      whyCustomers: [
        "Repeat buyers generate 3.2× more lifetime value than one-time purchasers in your catalog.",
        "This segment has a 74% brand affinity score based on NPS and review history.",
        "Customers in the 30–45 day gap window are 2.8× more likely to reorder when nudged with an offer.",
      ],
      whyChannel: [
        "Email allows rich product recommendations and dynamic offer blocks tailored to past purchases.",
        "Your email list has 94% deliverability with this segment — highest across all channels.",
        "Loyalty-tier customers check email 2.3× more frequently than SMS for promotional content.",
      ],
      predictedRevenue,
      recoveryProbability: "34%",
      confidenceScore: 82,
    };
  }

  if (normalized.includes("summer") || normalized.includes("collection") || normalized.includes("seasonal")) {
    return {
      goal: "Maximize awareness and early sales for the new Summer Collection among style-conscious shoppers.",
      audienceSelected: `${campaign.audience} who engaged with seasonal campaigns or browsed summer categories`,
      whyCustomers: [
        "These shoppers have a 41% higher average order value on seasonal product launches.",
        "62% purchased from a previous seasonal collection — proven appetite for new arrivals.",
        "Geo-targeting shows 78% are in regions entering peak summer shopping season now.",
      ],
      whyChannel: [
        "SMS achieves near-instant delivery — critical for time-sensitive launch-day promotions.",
        "91% of this audience has opted in to promotional SMS with confirmed mobile numbers.",
        "Short, punchy SMS with a direct link converts 1.9× better than email for flash launches.",
      ],
      predictedRevenue,
      recoveryProbability: "22%",
      confidenceScore: 79,
    };
  }

  if (normalized.includes("cart") || normalized.includes("abandon")) {
    return {
      goal: "Recover abandoned carts and convert high-intent shoppers who left without completing checkout.",
      audienceSelected: `${campaign.audience} with items in cart abandoned within the last 48 hours`,
      whyCustomers: [
        "Cart abandoners have the highest purchase intent of any segment — they already chose products.",
        "42% abandoned due to shipping cost concerns — a targeted discount directly addresses the friction.",
        "Recovery messages sent within 48 hours convert at 3.5× the rate of messages sent after 72 hours.",
      ],
      whyChannel: [
        "WhatsApp enables conversational recovery — customers can reply with questions and complete orders instantly.",
        "Cart recovery via WhatsApp shows 89% open rates and 42% click rates in your historical data.",
        "Personalized cart reminders with product thumbnails drive 2.6× more completions than generic emails.",
      ],
      predictedRevenue,
      recoveryProbability: "42%",
      confidenceScore: 91,
    };
  }

  return {
    goal: `Achieve the stated objective: "${prompt.trim()}" by targeting the highest-converting customer segment.`,
    audienceSelected: campaign.audience,
    whyCustomers: [
      "AI scoring identified this group as the top match for your goal based on 14 behavioral signals.",
      "Segment engagement metrics are 1.7× above your customer base average.",
      "Predicted conversion rate for this audience is in the top 15th percentile of all segments.",
    ],
    whyChannel: [
      `${campaign.channel} is the preferred channel for this audience based on past interaction data.`,
      `Delivery and engagement rates for ${campaign.channel} outperform other channels by 2.1× with this segment.`,
      "Message format and timing have been optimized for maximum response on this channel.",
    ],
    predictedRevenue,
    recoveryProbability: "19%",
    confidenceScore: 74,
  };
}

const examplePrompts = [
  "Bring back inactive customers",
  "Increase repeat purchases",
  "Promote summer collection",
];



const insightStyles = {
  opportunity: "border-cyan-500/20 bg-cyan-500/5 text-cyan-400",
  success: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
  alert: "border-amber-500/20 bg-amber-500/5 text-amber-400",
};

const insightIcons = {
  opportunity: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  ),
  success: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  alert: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  ),
};

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] ${className}`}
    >
      {children}
    </div>
  );
}

function CampaignField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-200 whitespace-pre-line">{value}</p>
    </div>
  );
}

function AnimatedCounter({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums transition-all duration-150 ${color}`}>
        {formatCount(value)}
      </p>
    </div>
  );
}

const timelineSteps: { key: ExecutionStage; label: string }[] = [
  { key: "created", label: "Campaign Created" },
  { key: "sent", label: "Sent" },
  { key: "delivered", label: "Delivered" },
  { key: "opened", label: "Opened" },
  { key: "clicked", label: "Clicked" },
];

function CampaignExecutionPanel({
  campaignName,
  audience,
}: {
  campaignName: string;
  audience: string;
}) {
  const targets = getExecutionTargets(parseAudienceSize(audience));
  const [stage, setStage] = useState<ExecutionStage>("created");
  const [counts, setCounts] = useState<CampaignCounts>({
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
  });
  const [displayCounts, setDisplayCounts] = useState<CampaignCounts>({
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
  });

  const stageIndex = timelineSteps.findIndex((s) => s.key === stage);
  const isCompleted = stage === "completed";

  useEffect(() => {
    const stageOrder: ExecutionStage[] = ["created", "sent", "delivered", "opened", "clicked", "completed"];
    let currentStageIdx = 0;

    const stageTimer = setInterval(() => {
      currentStageIdx += 1;
      if (currentStageIdx < stageOrder.length) {
        const nextStage = stageOrder[currentStageIdx];
        setStage(nextStage);

        if (nextStage === "sent") {
          setCounts((prev) => ({ ...prev, sent: targets.sent }));
        } else if (nextStage === "delivered") {
          setCounts((prev) => ({ ...prev, delivered: targets.delivered }));
        } else if (nextStage === "opened") {
          setCounts((prev) => ({ ...prev, opened: targets.opened }));
        } else if (nextStage === "clicked") {
          setCounts((prev) => ({ ...prev, clicked: targets.clicked }));
        }
      } else {
        clearInterval(stageTimer);
      }
    }, 1000);

    return () => clearInterval(stageTimer);
  }, [targets.sent, targets.delivered, targets.opened, targets.clicked]);

  useEffect(() => {
    const animateTimer = setInterval(() => {
      setDisplayCounts((prev) => ({
        sent: prev.sent < counts.sent ? prev.sent + Math.max(1, Math.ceil((counts.sent - prev.sent) / 8)) : counts.sent,
        delivered:
          prev.delivered < counts.delivered
            ? prev.delivered + Math.max(1, Math.ceil((counts.delivered - prev.delivered) / 8))
            : counts.delivered,
        opened:
          prev.opened < counts.opened
            ? prev.opened + Math.max(1, Math.ceil((counts.opened - prev.opened) / 8))
            : counts.opened,
        clicked:
          prev.clicked < counts.clicked
            ? prev.clicked + Math.max(1, Math.ceil((counts.clicked - prev.clicked) / 8))
            : counts.clicked,
      }));
    }, 80);

    return () => clearInterval(animateTimer);
  }, [counts]);

  const getStepStatus = (stepKey: ExecutionStage, index: number) => {
    if (isCompleted) return "completed";
    if (stepKey === "created") return "completed";
    if (stepKey === stage) return "active";
    if (index < stageIndex) return "completed";
    return "pending";
  };

  const deliveryRate = ((targets.delivered / targets.sent) * 100).toFixed(1);
  const openRate = ((targets.opened / targets.delivered) * 100).toFixed(1);
  const clickRate = ((targets.clicked / targets.delivered) * 100).toFixed(1);
  const revenue = Math.round(targets.clicked * 310.9);

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        <span className="text-xs font-medium uppercase tracking-wider text-cyan-300">
          Campaign Execution
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/[0.06] via-white/[0.02] to-purple-500/[0.06] backdrop-blur-xl">
        <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${isCompleted ? "bg-emerald-500/20" : "bg-cyan-500/20"}`}>
                {isCompleted ? (
                  <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                ) : (
                  <div className="h-3 w-3 animate-pulse rounded-full bg-cyan-400" />
                )}
              </div>
              <div>
                <p className="text-xs text-zinc-500">Live Campaign</p>
                <p className="text-base font-semibold text-white">{campaignName}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                isCompleted
                  ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  : "border border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
              }`}
            >
              {isCompleted ? "Completed" : "In Progress"}
            </span>
          </div>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-5 sm:p-6">
          {/* Timeline */}
          <div className="sm:col-span-2">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Progress Timeline
            </p>
            <div className="space-y-1">
              {timelineSteps.map((step, index) => {
                const status = getStepStatus(step.key, index);
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-medium transition-all duration-500 ${
                          status === "completed"
                            ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
                            : status === "active"
                              ? "border-cyan-500/40 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.3)]"
                              : "border-white/[0.08] bg-white/[0.02] text-zinc-600"
                        }`}
                      >
                        {status === "completed" ? "✓" : status === "active" ? (
                          <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      {index < timelineSteps.length - 1 && (
                        <div
                          className={`my-1 h-6 w-px transition-colors duration-500 ${
                            index < stageIndex || isCompleted ? "bg-emerald-500/40" : "bg-white/[0.08]"
                          }`}
                        />
                      )}
                    </div>
                    <p
                      className={`pb-5 text-sm transition-colors duration-300 ${
                        status === "completed"
                          ? "text-emerald-300"
                          : status === "active"
                            ? "font-medium text-white"
                            : "text-zinc-500"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Metrics */}
          <div className="sm:col-span-3">
            <p className="mb-4 text-xs font-medium uppercase tracking-wider text-zinc-500">
              Live Event Stream
            </p>
            <div className="grid grid-cols-2 gap-3">
              <AnimatedCounter value={displayCounts.sent} label="Sent" color="text-purple-300" />
              <AnimatedCounter value={displayCounts.delivered} label="Delivered" color="text-cyan-300" />
              <AnimatedCounter value={displayCounts.opened} label="Opened" color="text-emerald-300" />
              <AnimatedCounter value={displayCounts.clicked} label="Clicked" color="text-amber-300" />
            </div>

            {!isCompleted && (
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(((stageIndex + 1) / timelineSteps.length) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Completion Summary */}
        {isCompleted && (
          <div className="border-t border-white/[0.06] p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/30 to-cyan-500/30">
                <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-white">Campaign Completed</p>
                <p className="text-sm text-zinc-500">All messages processed successfully</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Delivery Rate</p>
                <p className="mt-1 text-xl font-bold text-purple-300">{deliveryRate}%</p>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Open Rate</p>
                <p className="mt-1 text-xl font-bold text-emerald-400">{openRate}%</p>
              </div>
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Click Rate</p>
                <p className="mt-1 text-xl font-bold text-cyan-400">{clickRate}%</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Revenue Influenced</p>
                <p className="mt-1 text-xl font-bold text-amber-300">₹{revenue.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AnalysisBulletList({ items, icon }: { items: string[]; icon: React.ReactNode }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span className="mt-0.5 shrink-0 text-purple-400">{icon}</span>
          <span className="text-sm leading-relaxed text-zinc-400">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function AIStrategyAnalysis({ prompt, campaign }: { prompt: string; campaign: GeneratedCampaign }) {
  const analysis = generateMockStrategyAnalysis(prompt, campaign);
  const confidenceColor =
    analysis.confidenceScore >= 85
      ? "text-emerald-400 border-emerald-500/20 bg-emerald-500/10"
      : analysis.confidenceScore >= 75
        ? "text-cyan-400 border-cyan-500/20 bg-cyan-500/10"
        : "text-amber-400 border-amber-500/20 bg-amber-500/10";

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        <span className="text-xs font-medium uppercase tracking-wider text-violet-300">
          AI Strategy Analysis
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.07] via-white/[0.02] to-purple-500/[0.07] backdrop-blur-xl">
        {/* Header */}
        <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 shadow-lg shadow-violet-500/20">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
                <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-cyan-400" />
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">XenoPilot Strategy Engine</p>
                <p className="text-xs text-zinc-500">AI reasoning behind this campaign</p>
              </div>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${confidenceColor}`}>
              {analysis.confidenceScore}% Confidence
            </span>
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          {/* Goal & Audience */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="mb-2 flex items-center gap-2">
                <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.25-.75a3 3 0 0 1 2.122-2.122L9 12M3 15h4.5M21 3v1.5M21 21v-6m0 0-2.25-.75a3 3 0 0 0-2.122-2.122L15 12m6 3h-4.5M9 6.75V4.5M9 6.75 6 9m3-2.25 3 2.25M15 6.75V4.5M15 6.75l3 2.25M9 17.25v2.25M9 17.25l-3-2.25M15 17.25v2.25m0 0 3-2.25M12 10.5V9m0 0-1.5 1.5M12 9l1.5 1.5" />
                </svg>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Goal</p>
              </div>
              <p className="text-sm leading-relaxed text-zinc-200">{analysis.goal}</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="mb-2 flex items-center gap-2">
                <svg className="h-4 w-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.09 9.09 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                </svg>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Audience Selected</p>
              </div>
              <p className="text-sm leading-relaxed text-zinc-200">{analysis.audienceSelected}</p>
              <span className="mt-2 inline-block rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-medium text-cyan-300">
                High-intent segment
              </span>
            </div>
          </div>

          {/* Reasoning sections */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-purple-500/15 bg-purple-500/[0.04] p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20">
                  <svg className="h-3.5 w-3.5 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-purple-200">Why These Customers?</p>
              </div>
              <AnalysisBulletList
                items={analysis.whyCustomers}
                icon={
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                }
              />
            </div>

            <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/[0.04] p-4">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20">
                  <svg className="h-3.5 w-3.5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-cyan-200">Why This Channel?</p>
                <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                  {campaign.channel}
                </span>
              </div>
              <AnalysisBulletList
                items={analysis.whyChannel}
                icon={
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Prediction metrics */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-4 text-center">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20">
                <svg className="h-4 w-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Predicted Revenue</p>
              <p className="mt-1 text-xl font-bold text-amber-300">{analysis.predictedRevenue}</p>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-4 text-center">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20">
                <svg className="h-4 w-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                </svg>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Recovery Probability</p>
              <p className="mt-1 text-xl font-bold text-emerald-400">{analysis.recoveryProbability}</p>
            </div>

            <div className="rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-transparent p-4 text-center">
              <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
                <svg className="h-4 w-4 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Confidence Score</p>
              <p className="mt-1 text-xl font-bold text-violet-300">{analysis.confidenceScore}/100</p>
              <div className="mx-auto mt-2 h-1.5 w-3/4 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-400 transition-all duration-700"
                  style={{ width: `${analysis.confidenceScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GeneratedCampaignCard({
  campaign,
  prompt,
  onLaunch,
  isLaunched,
  isLaunching,
}: {
  campaign: GeneratedCampaign;
  prompt: string;
  onLaunch: () => void;
  isLaunched: boolean;
  isLaunching: boolean;
}) {
  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
        <span className="text-xs font-medium uppercase tracking-wider text-purple-300">
          Generated Campaign
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.08] via-white/[0.02] to-cyan-500/[0.08] backdrop-blur-xl">
        <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20">
                <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-zinc-500">Campaign Name</p>
                <p className="text-base font-semibold text-white">{campaign.name}</p>
              </div>
            </div>
            <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
              {campaign.channel}
            </span>
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
          <CampaignField label="Audience" value={campaign.audience} />
          <CampaignField label="Recommended Channel" value={campaign.channel} />
          <div className="sm:col-span-2">
            <CampaignField label="Reason" value={campaign.reason} />
          </div>
          <div className="sm:col-span-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                Generated Message
              </p>
              <div className="mt-2 rounded-lg border border-purple-500/10 bg-[#0a0a12] p-4 font-mono text-sm leading-relaxed text-zinc-300">
                {campaign.message}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-white/[0.06] p-5 sm:p-6">
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Expected Open Rate
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-400">{campaign.expectedOpenRate}</p>
          </div>
          <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              Expected Click Rate
            </p>
            <p className="mt-1 text-2xl font-bold text-cyan-400">{campaign.expectedClickRate}</p>
          </div>
        </div>

        {!isLaunched && (
          <div className="flex flex-col gap-3 border-t border-white/[0.06] px-5 py-4 sm:flex-row sm:px-6">
            <button
              type="button"
              onClick={onLaunch}
              disabled={isLaunching}
              className="flex-1 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLaunching ? "Launching..." : "Launch Campaign"}
            </button>
         
          </div>
        )}
      </div>

      <AIStrategyAnalysis prompt={prompt} campaign={campaign} />

      {isLaunched && (
        <CampaignExecutionPanel campaignName={campaign.name} audience={campaign.audience} />
      )}
    </div>
  );
}

function LoadingState() {
  const steps = [
    "Analyzing your marketing goal...",
    "Identifying target audience...",
    "Crafting personalized message...",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 650);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="mt-6 rounded-2xl border border-purple-500/20 bg-purple-500/[0.05] p-6">
      <div className="flex items-center gap-4">
        <div className="relative h-10 w-10 shrink-0">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-400" />
          <div className="absolute inset-2 animate-pulse rounded-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30" />
        </div>
        <div>
          <p className="text-sm font-medium text-purple-200">Generating your campaign</p>
          <p className="mt-0.5 text-xs text-zinc-500 transition-all duration-300">{steps[step]}</p>
        </div>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-purple-500 to-cyan-400" />
      </div>
    </div>
  );
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
const [customerCount, setCustomerCount] = useState(0);
const [orderCount, setOrderCount] = useState(0);
  const [generatedCampaign, setGeneratedCampaign] = useState<GeneratedCampaign | null>(null);

const metrics = [
  {
    label: "Total Customers",
    value: customerCount.toString(),
    change: "+0%",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
      </svg>
    ),
  },
  {
    label: "Orders Loaded",
    value: orderCount.toString(),
    change: "+0",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
      </svg>
    ),
  },
  {
    label: "Revenue Influenced",
    value: generatedCampaign ? "Generated" : "₹0",
    change: "+0%",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    label: "Average Open Rate",
    value: generatedCampaign?.expectedOpenRate || "0%",
    change: "+0%",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

const insights = [
  {
    title: "Customers Loaded",
    description: `${customerCount} customers available for segmentation.`,
    type: "success" as const,
  },
  {
    title: "Orders Loaded",
    description: `${orderCount} orders available for campaign analysis.`,
    type: "opportunity" as const,
  },
  {
    title: "Campaign Status",
    description: generatedCampaign
      ? "AI campaign generated successfully."
      : "Generate a campaign to view insights.",
    type: "alert" as const,
  },
];

  const [isLaunched, setIsLaunched] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const launchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const score =
  generatedCampaign && customerCount > 0 && orderCount > 0
    ? 85
    : 0;
  const circumference = 2 * Math.PI * 54;
  const strokeOffset = circumference - (score / 100) * circumference;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (launchTimeoutRef.current) clearTimeout(launchTimeoutRef.current);
    };
  }, []);

const handleGenerate = async () => {
  if (!prompt.trim() || isGenerating) return;

  setIsGenerating(true);
  setGeneratedCampaign(null);
  setIsLaunched(false);
  setIsLaunching(false);

  try {
    const response = await fetch("/api/generate-campaign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  marketingGoal: prompt,
  customerCount,
  orderCount,
}),
    });

    if (!response.ok) {
      throw new Error("Failed to generate campaign");
    }

    const data = await response.json();

    setGeneratedCampaign({
  name: data.name || "AI Generated Campaign",
  audience: data.audience || "Unknown Audience",
  reason: data.reason || "",
  channel: data.channel || "Email",
  message:
    typeof data.message === "object"
      ? `${data.message.subject}\n\n${data.message.body}`
      : data.message || "",
  expectedOpenRate: data.expectedOpenRate || "60%",
  expectedClickRate: data.expectedClickRate || "15%",
});

  } catch (error) {
    console.error(error);
    alert("Failed to generate campaign");
  } finally {
    setIsGenerating(false);
  }
};

  const handlePromptChange = (value: string) => {
    setPrompt(value);
    setGeneratedCampaign(null);
    setIsLaunched(false);
    setIsLaunching(false);
  };
const handleCustomerUpload = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const text = event.target?.result as string;
    const rows = text.split("\n").filter((row) => row.trim());
    setCustomerCount(Math.max(0, rows.length - 1));
  };

  reader.readAsText(file);
};

const handleOrderUpload = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const text = event.target?.result as string;
    const rows = text.split("\n").filter((row) => row.trim());
    setOrderCount(Math.max(0, rows.length - 1));
  };

  reader.readAsText(file);
};
  const handleLaunch = () => {
    if (isLaunched || isLaunching) return;

    setIsLaunching(true);
    launchTimeoutRef.current = setTimeout(() => {
      setIsLaunching(false);
      setIsLaunched(true);
    }, 600);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#06060a] text-zinc-100">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute -right-32 top-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-violet-500/10 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/[0.06] bg-[#06060a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 shadow-lg shadow-purple-500/25">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">XenoPilot AI</span>
          </div>
          <div className="hidden items-center gap-6 text-sm text-zinc-400 sm:flex">
            <span className="cursor-pointer transition-colors hover:text-zinc-200">Dashboard</span>
            <span className="cursor-pointer transition-colors hover:text-zinc-200">Campaigns</span>
            <span className="cursor-pointer transition-colors hover:text-zinc-200">Segments</span>
            <span className="cursor-pointer transition-colors hover:text-zinc-200">Analytics</span>
          </div>
          <button
            type="button"
            className="rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:brightness-110"
          >
            New Campaign
          </button>
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Hero Section */}
        <section className="mb-12 text-center sm:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-medium text-purple-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
            </span>
            AI-Powered CRM
          </div>
          <h1 className="bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl">
            XenoPilot AI
          </h1>
          <p className="mt-3 text-xl font-medium text-zinc-300 sm:text-2xl">
            Your AI Marketing Strategist
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Describe your marketing goals in natural language and let AI instantly create
            targeted customer segments, personalized campaigns, and data-driven strategies —
            no complex setup required.
          </p>
        </section>

        {/* Dashboard Metrics */}
        <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <GlassCard key={metric.label} className="group p-5 transition-all duration-300 hover:border-white/[0.14] hover:bg-white/[0.05]">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-purple-300 transition-colors group-hover:from-purple-500/30 group-hover:to-cyan-500/30">
                  {metric.icon}
                </div>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
                  {metric.change}
                </span>
              </div>
              <p className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {metric.value}
              </p>
              <p className="mt-1 text-sm text-zinc-500">{metric.label}</p>
            </GlassCard>
          ))}
        </section>

        {/* Main Content Grid */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
{/* Customer Data Upload */}
<GlassCard className="lg:col-span-2 p-6">
  <h2 className="text-lg font-semibold text-white">
    Customer Data
  </h2>

  <p className="mt-2 text-sm text-zinc-500">
    Upload customer and order CSV files
  </p>

  <div className="mt-4 space-y-4">
    <div>
      <label className="mb-2 block text-sm text-zinc-400">
        Customers CSV
      </label>
      <input
  type="file"
  accept=".csv"
  onChange={handleCustomerUpload}
  className="w-full rounded-lg border border-white/10 p-2"
/>
    </div>

    <div>
      <label className="mb-2 block text-sm text-zinc-400">
        Orders CSV
      </label>
      <input
  type="file"
  accept=".csv"
  onChange={handleOrderUpload}
  className="w-full rounded-lg border border-white/10 p-2"
/>
    </div>

    <div className="rounded-lg bg-white/5 p-3">
      <p className="text-sm text-zinc-300">
        Customers Loaded: {customerCount}
      </p>
      <p className="text-sm text-zinc-300">
        Orders Loaded: {orderCount}
      </p>
    </div>
  </div>
</GlassCard>
          {/* AI Campaign Assistant */}
          <GlassCard className="lg:col-span-3 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">AI Campaign Assistant</h2>
                <p className="text-sm text-zinc-500">Tell us what you want to achieve</p>
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
              placeholder="Describe your marketing goal..."
              rows={5}
              disabled={isGenerating}
              className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-4 text-sm leading-relaxed text-zinc-200 placeholder:text-zinc-600 outline-none transition-all focus:border-purple-500/40 focus:bg-white/[0.06] focus:ring-2 focus:ring-purple-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <div className="mt-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                Try an example
              </p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example) => (
                  <button
                    key={example}
                    type="button"
                    disabled={isGenerating}
                    onClick={() => handlePromptChange(example)}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-zinc-400 transition-all hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-zinc-600">
                AI will generate segments, messaging, and campaign timelines
              </p>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-purple-500/40 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                    </svg>
                    Generate Campaign
                  </>
                )}
              </button>
            </div>

            {isGenerating && <LoadingState />}
            {generatedCampaign && !isGenerating && (
              <GeneratedCampaignCard
                campaign={generatedCampaign}
                prompt={prompt}
                onLaunch={handleLaunch}
                isLaunched={isLaunched}
                isLaunching={isLaunching}
              />
            )}
          </GlassCard>

          {/* AI Insights Panel */}
          <GlassCard className="lg:col-span-2 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">AI Insights</h2>
                <p className="text-sm text-zinc-500">Real-time performance analysis</p>
              </div>
            </div>

            {/* Campaign Success Score */}
            <div className="mb-6 flex items-center gap-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="relative h-28 w-28 shrink-0">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{score}</span>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500">/ 100</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-300">Campaign Success Score</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                  Your campaigns are performing above industry average. Engagement and conversion
                  metrics are trending upward.
                </p>
                <span className="mt-2 inline-block rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                  Excellent
                </span>
              </div>
            </div>

            {/* Insights */}
            <div className="space-y-3">
              {insights.map((insight) => (
                <div
                  key={insight.title}
                  className={`rounded-xl border p-3.5 ${insightStyles[insight.type]}`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">{insightIcons[insight.type]}</div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{insight.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="mt-4 rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20">
                  <svg className="h-4 w-4 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                  </svg>
                </div>
                <div>
  <p className="text-xs font-semibold uppercase tracking-wider text-purple-300">
    AI Recommendation
  </p>
  <p className="mt-1 text-sm leading-relaxed text-zinc-300">
    Review the generated campaign and launch it to engage the selected audience
    based on the uploaded customer data.
  </p>
</div>
              </div>
            </div>
          </GlassCard>
        </section>
      </main>
    </div>
  );
}
