"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAi } from "@/components/AiContext";
import { api, type Profile } from "@/lib/api";

export default function ProfilePage() {
  const { setPage } = useAi();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    setPage("profile");
    api.profile().then(setProfile).catch(() => setProfile(null));
  }, [setPage]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl">Modeling Profile</h1>
      <p className="muted mt-2">能力画像连接学习与比赛：掌握度不足时提示速学。</p>
      {profile && (
        <>
          <div className="panel mt-6">
            <h2 className="brand text-2xl">维度</h2>
            <div className="mt-4 space-y-3">
              {profile.dimensions.map((d) => (
                <div key={d.dim}>
                  <div className="flex justify-between text-sm">
                    <span>{d.dim}</span>
                    <span>{d.score}</span>
                  </div>
                  <div className="h-2 bg-white/80 border border-[var(--line)] mt-1">
                    <div className="h-full bg-[var(--accent-2)]" style={{ width: `${d.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel mt-4">
            <h2 className="brand text-2xl">模型掌握度</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {profile.models.map((m) => (
                <li key={m.item_id} className="flex justify-between">
                  <Link href={`/atlas/${m.item_id}`} className="underline-offset-2 hover:underline">
                    {m.item_id}
                  </Link>
                  <span className={m.score < 40 ? "text-[var(--accent)]" : ""}>{m.score}</span>
                </li>
              ))}
            </ul>
          </div>
          {profile.bridge_tips.length > 0 && (
            <div className="panel mt-4">
              <h2 className="brand text-2xl">比赛桥接</h2>
              {profile.bridge_tips.map((t) => (
                <div key={t.model_id} className="mt-3 text-sm">
                  <p>{t.message}</p>
                  <Link href={`/atlas/${t.model_id}`} className="btn ghost inline-block mt-2">
                    5 分钟快速学习
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
