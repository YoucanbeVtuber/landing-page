"use client";

import { ArrowUpRight } from "lucide-react";
import { COPY, DISCORD_INVITE_URL, type Lang } from "@/content/copy";

const DISCORD_CHANNEL_NAME = "✂️-split-my-avatar";

function highlightChannelName(text: string) {
  return text.split(DISCORD_CHANNEL_NAME).map((part, index, array) => (
    <span key={`${part}-${index}`}>
      {part}
      {index < array.length - 1 && (
        <strong className="rounded-md bg-slate-950 px-1.5 py-0.5 font-black text-white">
          {DISCORD_CHANNEL_NAME}
        </strong>
      )}
    </span>
  ));
}

export default function DiscordInviteCard({ lang }: { lang: Lang }) {
  const copy = COPY[lang].preRegister.discord;
  const isPlaceholderLink = DISCORD_INVITE_URL.includes("your-invite-code");

  return (
    <div className="rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff,#f8fafc_45%,#eef2ff)] p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.18)] sm:p-7">
      <div className="rounded-[22px] border border-slate-200/80 bg-white/85 p-6 backdrop-blur-sm sm:p-7">
        <div className="max-w-xl text-left">
          <h3 className="text-3xl font-black tracking-tight text-slate-950 sm:text-[2rem]">
            {copy.title}
          </h3>
          {copy.subtitle ? (
            <p className="mt-3 text-sm leading-7 text-slate-800 sm:text-[15px]">
              {highlightChannelName(copy.subtitle)}
            </p>
          ) : null}
          <p className="mt-3 text-sm leading-7 text-slate-600">{highlightChannelName(copy.body)}</p>

          <a
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#5865F2] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#4752c4]"
          >
            <span>{copy.button}</span>
            <ArrowUpRight size={16} />
          </a>

          {isPlaceholderLink && (
            <p className="mt-3 text-xs leading-6 text-amber-700">{copy.previewNote}</p>
          )}
        </div>
      </div>
    </div>
  );
}
