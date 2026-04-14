import type { ClothingItem } from "../context/ClothingContext";

export interface Recommendation {
  item: ClothingItem;
  score: number;
  reasons: string[];
}

type RecommendationMode = "outfit" | "swap";

const categoryCompatibility: Record<string, string[]> = {
  tops: ["bottoms", "winter"],
  shirts: ["bottoms", "winter"],
  tshirts: ["bottoms", "winter"],
  bottoms: ["tops", "shirts", "tshirts", "winter"],
  jeans: ["tops", "shirts", "tshirts"],
  dresses: ["winter"],
  winter: ["tops", "bottoms", "dresses"],
};

const colorGroups: Record<string, string[]> = {
  black: ["white", "blue", "pink", "green", "grey"],
  white: ["black", "blue", "green", "pink"],
  blue: ["white", "black", "grey", "beige"],
  green: ["white", "black", "grey"],
  pink: ["white", "black", "grey"],
  grey: ["blue", "green", "pink", "black"],
  beige: ["blue", "white", "black"],
};

const normalize = (value = "") => value.trim().toLowerCase();

const tokenize = (item: ClothingItem) => {
  const category = normalize(item.category || "uncategorized");
  const color = normalize(item.color || "");
  const tags = item.tags?.map(normalize).filter(Boolean) || [];

  return { category, color, tags };
};

export function buildFeatureVector(item: ClothingItem) {
  const { category, color, tags } = tokenize(item);
  return [category, color, ...tags].filter(Boolean);
}

function areCompatibleCategories(baseCategory: string, candidateCategory: string) {
  return Boolean(categoryCompatibility[baseCategory]?.includes(candidateCategory));
}

function getCategoryScore(
  baseCategory: string,
  candidateCategory: string,
  mode: RecommendationMode
) {
  if (!baseCategory || !candidateCategory) return 0;
  if (areCompatibleCategories(baseCategory, candidateCategory)) return 0.45;
  if (mode === "swap" && baseCategory === candidateCategory) return 0.35;
  return 0;
}

function getColorScore(baseColor: string, candidateColor: string) {
  if (!baseColor || !candidateColor) return 0;
  if (baseColor === candidateColor) return 0.2;
  if (colorGroups[baseColor]?.includes(candidateColor)) return 0.3;
  return 0;
}

function getTagScore(baseTags: string[], candidateTags: string[]) {
  if (!baseTags.length || !candidateTags.length) return 0;

  const candidateSet = new Set(candidateTags);
  const overlap = baseTags.filter((tag) => candidateSet.has(tag));
  const union = new Set([...baseTags, ...candidateTags]);

  return (overlap.length / union.size) * 0.25;
}

export function scoreSimilarity(
  baseItem: ClothingItem,
  candidate: ClothingItem,
  mode: RecommendationMode = "outfit"
) {
  const base = tokenize(baseItem);
  const target = tokenize(candidate);
  const reasons: string[] = [];

  const categoryScore = getCategoryScore(base.category, target.category, mode);
  const colorScore = getColorScore(base.color, target.color);
  const tagScore = getTagScore(base.tags, target.tags);

  if (categoryScore > 0) {
    reasons.push(
      base.category === target.category
        ? "same category swap signal"
        : "compatible outfit category"
    );
  }

  if (colorScore > 0) {
    reasons.push(base.color === target.color ? "matching color" : "color pairing");
  }

  if (tagScore > 0) {
    reasons.push("shared style tags");
  }

  return {
    score: Number((categoryScore + colorScore + tagScore).toFixed(2)),
    reasons,
  };
}

export function getRecommendations(
  baseItem: ClothingItem,
  closet: ClothingItem[],
  limit = 3,
  mode: RecommendationMode = "outfit"
): Recommendation[] {
  return closet
    .filter((item) => item.id !== baseItem.id)
    .map((item) => {
      const match = scoreSimilarity(baseItem, item, mode);
      return { item, ...match };
    })
    .filter((recommendation) => recommendation.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getSmartSuggestions(closet: ClothingItem[], limit = 4) {
  return closet
    .flatMap((item) =>
      getRecommendations(item, closet, 2, "outfit").map((recommendation) => ({
        baseItem: item,
        ...recommendation,
      }))
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
