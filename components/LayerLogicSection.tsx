"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FolderTree, Layers3, LoaderCircle, Sparkles } from "lucide-react";
import type { Lang } from "@/content/copy";

type PreviewLayerRecord = {
  id: string;
  name: string;
  assetPath: string;
  zIndex: number;
  visibleByDefault: boolean;
  group?: string | null;
  folderPath?: string | null;
  blendMode?: "normal" | "overlay" | null;
  placementBounds?: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
};

type PreviewJobManifest = {
  summary: {
    jobId: string;
    taskId: string;
    title: string;
    status: string;
    createdAt: string;
  };
  canvasSize: [number, number];
  originalAssetPath: string;
  compositeAssetPath?: string | null;
  layers: PreviewLayerRecord[];
};

type PreviewBundle = {
  format: string;
  version: number;
  source?: {
    jobId?: string;
    taskId?: string;
    title?: string;
  };
  manifest: PreviewJobManifest;
};

type FolderSection = {
  folderPath: string;
  label: string;
  layers: PreviewLayerRecord[];
  order: number;
};

const MANIFEST_SOURCES = ["/landing-preview/manifest.json", "/layer-logic/preview-manifest.json"];
const FULL_PREVIEW_ID = "__all__";

const TEXT = {
  en: {
    eyebrow: "Layer Logic",
    title: "Start rigging the moment you open it.",
    subtitle:
      "Naming, layer groups, and hidden-area restoration are already done. You receive a PSD that is ready to rig from the first second.",
    helper: "Hover a layer to see the magic.",
    mobileHelper: "Tap a layer to preview it.",
    proof: [
      "Restored hidden areas",
      "Standard naming",
      "Rigging-ready groups",
    ],
    previewLabel: "Live layer preview",
    previewTitle: "Ready before you touch it",
    previewLoading: "Loading preview manifest...",
    previewEmptyTitle: "Add a preview manifest",
    previewEmptyBody:
      "Drop demo_studio's preview-manifest.json and its generated assets into public to reuse the real layer preview here.",
    fullPreview: "Full Preview",
    fullPreviewDetail: "This is a Live2D rigging-friendly layer structure.",
    treeLabel: "PSD structure",
    treeTitle: "Clean layer structure",
    treeBody: "Hover a layer name and the preview reacts instantly.",
    folderRoot: "LivingCel_Output.psd",
    helperFooter:
      "The point of this section is simple: users should feel they can start rigging immediately.",
    statusLabel: "Preview Job",
    assetLabel: "Asset Path",
    noManifest: "No manifest loaded",
  },
  kr: {
    eyebrow: "Layer Logic",
    title: "열자마자 리깅을 시작하세요.",
    subtitle:
      "이름 정리, 레이어 그룹화, 가려진 부분 복원까지. 모든 준비가 끝난 PSD를 드립니다.",
    helper: "레이어에 마우스를 올려 변화를 확인하세요.",
    mobileHelper: "터치해서 파츠를 확인하세요.",
    proof: ["가려진 뒷면 복원", "표준 네이밍 완료", "리깅용 그룹 구조"],
    previewLabel: "Live layer preview",
    previewTitle: "이미 준비된 결과물",
    previewLoading: "preview manifest를 불러오는 중입니다...",
    previewEmptyTitle: "preview-manifest를 넣어주세요",
    previewEmptyBody:
      "demo_studio에서 생성한 preview-manifest.json과 asset 파일을 public 경로에 두면 여기서 실제 레이어 프리뷰가 동작합니다.",
    fullPreview: "전체 프리뷰",
    fullPreviewDetail: "Live2D 리깅 친화적인 레이어 구조입니다.",
    treeLabel: "PSD structure",
    treeTitle: "정돈된 레이어 구조",
    treeBody: "레이어 이름에 마우스를 올리면 프리뷰가 바로 반응합니다.",
    folderRoot: "LivingCel_Output.psd",
    helperFooter:
      "이 섹션의 목적은 단 하나입니다. “와, 바로 리깅하면 되겠는데?”라는 확신을 주는 것.",
    statusLabel: "Preview Job",
    assetLabel: "Asset Path",
    noManifest: "manifest가 아직 없습니다",
  },
} as const;

function PreviewPlaceholder({
  title,
  body,
  loading = false,
}: {
  title: string;
  body: string;
  loading?: boolean;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-[28px] bg-gradient-to-br from-slate-100 to-slate-200 px-8 text-center">
      {loading ? (
        <LoaderCircle className="mb-4 animate-spin text-slate-500" size={42} />
      ) : (
        <Layers3 className="mb-4 text-slate-600" size={42} />
      )}
      <div className="text-base font-black tracking-tight text-slate-900">{title}</div>
      <div className="mt-3 max-w-[300px] text-sm leading-6 text-slate-600">{body}</div>
    </div>
  );
}

function labelFromFolderPath(folderPath?: string | null) {
  if (!folderPath) return "Character";
  const segments = folderPath.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? folderPath;
}

function resolvePsdGroup(layer: PreviewLayerRecord): { key: string; label: string; order: number } {
  const layerId = layer.id.toLowerCase();
  const layerName = layer.name.toLowerCase();
  const folderPath = (layer.folderPath || "").toLowerCase();

  if (layerId.startsWith("hair_") || layerName.startsWith("hair_") || folderPath.includes("/hair")) {
    return { key: "Head/Hair", label: "Hair", order: 500 };
  }
  if (layerId.startsWith("eyebrow_") || layerName.startsWith("eyebrow_")) {
    return { key: "Head/Brows", label: "Brows", order: 450 };
  }
  if (
    layerId.startsWith("mouth_") ||
    layerId.startsWith("teeth_") ||
    layerId.startsWith("tongue") ||
    layerName.startsWith("mouth_") ||
    layerName.startsWith("teeth_") ||
    layerName.startsWith("tongue")
  ) {
    return { key: "Head/Mouth", label: "Mouth", order: 350 };
  }
  if (
    layerId.startsWith("iris_") ||
    layerId.startsWith("eye_") ||
    layerId.startsWith("eyelash_") ||
    layerName.startsWith("iris_") ||
    layerName.startsWith("eye_") ||
    layerName.startsWith("eyelash_")
  ) {
    return { key: "Head/Eyes", label: "Eyes", order: 340 };
  }
  if (layerId.startsWith("face_") || layerName.startsWith("face_")) {
    return { key: "Head/Face", label: "Face", order: 330 };
  }

  return { key: layer.folderPath || "Head/Other", label: labelFromFolderPath(layer.folderPath), order: 100 };
}

function resolveManifestAssetPath(assetPath: string | null | undefined, manifestSrc: string | null) {
  if (!assetPath) return null;
  if (assetPath.startsWith("/")) return assetPath;
  if (!manifestSrc) return assetPath;
  const baseDir = manifestSrc.replace(/\/[^/]*$/, "/");
  const normalized = assetPath.replace(/^\.\//, "");
  return `${baseDir}${normalized}`;
}

function ManifestLayerImage({
  layer,
  manifestSrc,
  canvasSize,
  onAssetError,
}: {
  layer: PreviewLayerRecord;
  manifestSrc: string | null;
  canvasSize: [number, number];
  onAssetError: (resolvedPath: string) => void;
}) {
  const resolvedSrc = resolveManifestAssetPath(layer.assetPath, manifestSrc) ?? layer.assetPath;
  const [canvasWidth, canvasHeight] = canvasSize;
  const bounds = layer.placementBounds;

  const style = bounds
    ? {
        left: `${(bounds.x / canvasWidth) * 100}%`,
        top: `${(bounds.y / canvasHeight) * 100}%`,
        width: `${(bounds.width / canvasWidth) * 100}%`,
        height: `${(bounds.height / canvasHeight) * 100}%`,
      }
    : {
        left: "0%",
        top: "0%",
        width: "100%",
        height: "100%",
      };

  return (
    <img
      src={resolvedSrc}
      alt={layer.name}
      className="absolute block"
      style={{
        ...style,
        mixBlendMode: layer.blendMode === "overlay" ? "overlay" : "normal",
      }}
      onError={() => onAssetError(resolvedSrc)}
    />
  );
}

export default function LayerLogicSection({ lang }: { lang: Lang }) {
  const text = TEXT[lang];
  const [manifest, setManifest] = useState<PreviewJobManifest | null>(null);
  const [manifestSrc, setManifestSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [manifestError, setManifestError] = useState<string | null>(null);
  const [pinnedLayerId, setPinnedLayerId] = useState<string>(FULL_PREVIEW_ID);
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  const [brokenAssets, setBrokenAssets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isActive = true;

    async function loadManifest() {
      try {
        setIsLoading(true);
        setManifestError(null);
        let loadedManifest: PreviewJobManifest | null = null;
        let loadedManifestSrc: string | null = null;

        for (const source of MANIFEST_SOURCES) {
          const response = await fetch(source, { cache: "no-store" });
          if (!response.ok) {
            continue;
          }
          const json = (await response.json()) as PreviewJobManifest | PreviewBundle;
          loadedManifest =
            "manifest" in json && json.manifest && "layers" in json.manifest ? json.manifest : (json as PreviewJobManifest);
          loadedManifestSrc = source;
          break;
        }

        if (!loadedManifest || !loadedManifestSrc) {
          throw new Error("No preview manifest found");
        }
        if (!isActive) return;
        setManifest(loadedManifest);
        setManifestSrc(loadedManifestSrc);
      } catch (error) {
        if (!isActive) return;
        setManifest(null);
        setManifestSrc(null);
        setManifestError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadManifest();
    return () => {
      isActive = false;
    };
  }, []);

  const sortedLayers = useMemo(
    () => [...(manifest?.layers ?? [])].sort((a, b) => a.zIndex - b.zIndex),
    [manifest]
  );

  const presentationLayers = useMemo(
    () => sortedLayers.filter((layer) => !(layer.folderPath || "").startsWith("99_Debug")),
    [sortedLayers]
  );

  const folderSections = useMemo<FolderSection[]>(() => {
    const buckets = new Map<string, FolderSection>();

    for (const layer of presentationLayers) {
      const group = resolvePsdGroup(layer);
      const bucket = buckets.get(group.key) ?? {
        folderPath: group.key,
        label: group.label,
        layers: [],
        order: group.order,
      };
      bucket.layers.push(layer);
      buckets.set(group.key, bucket);
    }

    return [...buckets.values()]
      .map((section) => ({
        ...section,
        layers: [...section.layers].sort((a, b) => b.zIndex - a.zIndex),
      }))
      .sort((a, b) => b.order - a.order);
  }, [presentationLayers]);

  const activeLayerId = hoveredLayerId ?? pinnedLayerId;
  const activeLayer =
    activeLayerId === FULL_PREVIEW_ID
      ? null
      : presentationLayers.find((layer) => layer.id === activeLayerId) ?? null;

  const visibleLayers = useMemo(() => {
    if (activeLayerId === FULL_PREVIEW_ID) {
      return presentationLayers.filter((layer) => layer.visibleByDefault);
    }
    return activeLayer ? [activeLayer] : [];
  }, [activeLayer, activeLayerId, presentationLayers]);

  const visibleRenderableLayers = visibleLayers.filter((layer) => {
    const resolvedPath = resolveManifestAssetPath(layer.assetPath, manifestSrc) ?? layer.assetPath;
    return !brokenAssets[resolvedPath];
  });
  const compositeSrc = resolveManifestAssetPath(manifest?.compositeAssetPath ?? null, manifestSrc);
  const compositeBroken = compositeSrc ? brokenAssets[compositeSrc] : false;
  const originalSrc = resolveManifestAssetPath(manifest?.originalAssetPath ?? null, manifestSrc);
  const originalBroken = originalSrc ? brokenAssets[originalSrc] : false;

  const previewTitle =
    activeLayerId === FULL_PREVIEW_ID ? text.fullPreview : activeLayer?.name ?? text.fullPreview;
  const canvasSize = manifest?.canvasSize ?? [1024, 1536];

  return (
    <section className="relative overflow-hidden bg-[#f7f8fc] px-6 py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute right-[10%] top-24 h-60 w-60 rounded-full bg-indigo-200/30 blur-[110px]" />
      <div className="pointer-events-none absolute left-[6%] bottom-16 h-72 w-72 rounded-full bg-cyan-200/30 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.32em] text-indigo-600 shadow-sm">
            <FolderTree size={14} />
            {text.eyebrow}
          </div>
          <h2 className="mt-8 text-4xl font-[950] tracking-[-0.06em] text-slate-950 sm:text-5xl lg:text-6xl">
            {text.title}
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg font-medium leading-8 text-slate-500 sm:text-xl">
            {text.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {text.proof.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="sticky top-20 z-20 overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.24)] backdrop-blur-xl lg:top-24 lg:rounded-[40px] lg:shadow-[0_36px_80px_-36px_rgba(15,23,42,0.24)]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 lg:px-6 lg:py-5">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-400">
                  {text.previewLabel}
                </div>
                <div className="mt-2 text-lg font-black tracking-tight text-slate-950 lg:text-xl">
                  {text.previewTitle}
                </div>
              </div>
            </div>

            <div className="px-4 py-4 lg:px-6 lg:py-6">
              <div className="rounded-[24px] border border-slate-200 bg-[linear-gradient(45deg,rgba(241,245,249,0.7)_25%,transparent_25%),linear-gradient(-45deg,rgba(241,245,249,0.7)_25%,transparent_25%),linear-gradient(45deg,transparent_75%,rgba(241,245,249,0.7)_75%),linear-gradient(-45deg,transparent_75%,rgba(241,245,249,0.7)_75%)] bg-[length:28px_28px] bg-[position:0_0,0_14px,14px_-14px,-14px_0] p-3 lg:rounded-[32px] lg:p-4">
                <div
                  className="relative overflow-hidden rounded-[28px] bg-white"
                  style={{ aspectRatio: `${canvasSize[0]} / ${canvasSize[1]}` }}
                >
                  {isLoading ? (
                    <PreviewPlaceholder title={text.previewLoading} body={text.previewEmptyBody} loading />
                  ) : !manifest ? (
                    <PreviewPlaceholder
                      title={text.previewEmptyTitle}
                      body={manifestError || text.previewEmptyBody}
                    />
                  ) : activeLayerId === FULL_PREVIEW_ID && originalSrc && !originalBroken ? (
                    <img
                      src={originalSrc}
                      alt="Original illustration"
                      className="absolute inset-0 h-full w-full object-contain"
                      onError={() =>
                        setBrokenAssets((prev) => ({
                          ...prev,
                          [originalSrc]: true,
                        }))
                      }
                    />
                  ) : compositeSrc &&
                    activeLayerId === FULL_PREVIEW_ID &&
                    !compositeBroken &&
                    visibleRenderableLayers.length === 0 ? (
                    <img
                      src={compositeSrc}
                      alt={text.fullPreview}
                      className="absolute inset-0 h-full w-full"
                      onError={() =>
                        setBrokenAssets((prev) => ({
                          ...prev,
                          [compositeSrc]: true,
                        }))
                      }
                    />
                  ) : visibleRenderableLayers.length > 0 ? (
                    visibleRenderableLayers.map((layer) => (
                      <ManifestLayerImage
                        key={layer.id}
                        layer={layer}
                        manifestSrc={manifestSrc}
                        canvasSize={canvasSize}
                        onAssetError={(resolvedPath) =>
                          setBrokenAssets((prev) => ({
                            ...prev,
                            [resolvedPath]: true,
                          }))
                        }
                      />
                    ))
                  ) : (
                    <PreviewPlaceholder
                      title={text.previewEmptyTitle}
                      body={text.previewEmptyBody}
                    />
                  )}

                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white/92 to-transparent px-5 pb-5 pt-12">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-400">
                          {text.previewLabel}
                        </div>
                        <div className="mt-2 text-xl font-black tracking-tight text-slate-950 sm:text-2xl lg:text-3xl">
                          {previewTitle}
                        </div>
                        <p className="mt-2 hidden max-w-md text-sm font-medium leading-6 text-slate-500 lg:block">
                          {text.helper}
                        </p>
                        <p className="mt-2 text-xs font-semibold text-slate-500 lg:hidden">
                          {text.mobileHelper}
                        </p>
                      </div>
                      {activeLayer && (
                        <div className="hidden rounded-full bg-slate-950 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-white sm:block">
                          {activeLayer.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.06 }}
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950 text-white shadow-[0_24px_60px_-32px_rgba(15,23,42,0.45)] lg:rounded-[40px] lg:shadow-[0_36px_80px_-36px_rgba(15,23,42,0.45)]"
          >
            <div className="border-b border-white/10 px-4 py-4 lg:px-6 lg:py-6">
              <div className="text-[10px] font-black uppercase tracking-[0.28em] text-indigo-300">
                {text.treeLabel}
              </div>
              <div className="mt-2 text-lg font-black tracking-tight text-white lg:mt-3 lg:text-3xl">
                {text.treeTitle}
              </div>
              <p className="mt-2 hidden max-w-md text-sm leading-7 text-slate-400 lg:block">{text.treeBody}</p>
            </div>

            <div className="px-3 py-3 lg:px-4 lg:py-4">
              <button
                type="button"
                onMouseEnter={() => setHoveredLayerId(FULL_PREVIEW_ID)}
                onMouseLeave={() => setHoveredLayerId(null)}
                onClick={() => setPinnedLayerId(FULL_PREVIEW_ID)}
                className={`flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left transition-colors lg:rounded-[22px] ${
                  activeLayerId === FULL_PREVIEW_ID
                    ? "bg-white text-slate-900"
                    : "text-white hover:bg-white/8"
                }`}
              >
                <Layers3 size={18} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-black">{text.folderRoot}</div>
                  <div className={`hidden text-xs lg:block ${activeLayerId === FULL_PREVIEW_ID ? "text-slate-500" : "text-slate-400"}`}>
                    {text.fullPreviewDetail}
                  </div>
                </div>
              </button>

              <div
                className="mt-3 max-h-[42vh] overflow-y-auto rounded-[22px] border border-white/10 bg-white/5 p-2 overscroll-contain lg:max-h-none lg:rounded-[28px] lg:p-3"
                onMouseLeave={() => setHoveredLayerId(null)}
              >
                {folderSections.length === 0 ? (
                  <div className="rounded-[18px] px-4 py-6 text-sm text-slate-400">{text.noManifest}</div>
                ) : (
                  folderSections.map((folder) => (
                    <div key={folder.folderPath} className="mb-3 last:mb-0">
                      <div className="flex items-center gap-2 rounded-[18px] px-3 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                        <FolderTree size={14} className="text-indigo-300" />
                        {folder.label}
                      </div>
                      <div className="mt-1 space-y-1">
                        {folder.layers.map((layer) => {
                          const selected = activeLayerId === layer.id;

                          return (
                            <button
                              key={layer.id}
                              type="button"
                              onMouseEnter={() => setHoveredLayerId(layer.id)}
                              onClick={() => setPinnedLayerId(layer.id)}
                              className={`group flex w-full items-center gap-3 rounded-[18px] px-4 py-3 text-left transition-colors ${
                                selected ? "bg-white text-slate-900 shadow-sm" : "text-white hover:bg-white/8"
                              }`}
                            >
                              <span
                                className={`h-2.5 w-2.5 rounded-full ${
                                  selected ? "bg-indigo-500" : "bg-slate-500"
                                }`}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-black">{layer.name}</div>
                                <div className={`truncate text-xs ${selected ? "text-slate-500" : "text-slate-400"}`}>
                                  {layer.group ?? folder.label}
                                </div>
                              </div>
                              <Sparkles
                                size={14}
                                className={`transition-opacity ${
                                  selected
                                    ? "text-indigo-500 opacity-100"
                                    : "text-indigo-300 opacity-0 group-hover:opacity-100"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
