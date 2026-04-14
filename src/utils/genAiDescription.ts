interface DescriptionInput {
  name: string;
  category?: string;
  color?: string;
  tags?: string[];
}

interface DescriptionResponse {
  description?: string;
}

const clean = (value = "") => value.trim();

function buildLocalDescription({ name, category, color, tags = [] }: DescriptionInput) {
  const itemName = clean(name) || "This piece";
  const itemCategory = clean(category).toLowerCase();
  const itemColor = clean(color).toLowerCase();
  const tagText = tags.map(clean).filter(Boolean).join(", ");

  const colorPhrase = itemColor ? ` in ${itemColor}` : "";
  const categoryPhrase = itemCategory ? ` ${itemCategory}` : " wardrobe piece";
  const tagPhrase = tagText ? ` It works especially well for ${tagText} looks.` : "";

  return `${itemName} is a versatile${colorPhrase}${categoryPhrase} that adds an easy, polished touch to your closet.${tagPhrase} Pair it with complementary basics or similar tones for a balanced outfit.`;
}

export async function generateClothingDescription(input: DescriptionInput) {
  const endpoint = import.meta.env.VITE_GENAI_DESCRIPTION_ENDPOINT as string | undefined;

  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (response.ok) {
        const data = (await response.json()) as DescriptionResponse;
        if (data.description) {
          return data.description;
        }
      }
    } catch {
      // Fall back to the local generator so demos still work without network access.
    }
  }

  return buildLocalDescription(input);
}
