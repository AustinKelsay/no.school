import { decode } from "light-bolt11-decoder";

export interface ParsedBolt11Invoice {
  descriptionHash?: string;
}

export function parseBolt11Invoice(bolt11: string): ParsedBolt11Invoice | null {
  try {
    const decoded = decode(bolt11);
    if (decoded && typeof decoded === "object") {
      if (decoded.descriptionHash) {
        return { descriptionHash: decoded.descriptionHash };
      }
      if (Array.isArray(decoded.sections)) {
        for (const section of decoded.sections) {
          if (
            section &&
            (section.name === "description_hash" || section.name === "purpose_commit_hash") &&
            section.value
          ) {
            return { descriptionHash: String(section.value) };
          }
        }
      }
      return {};
    }
    return null;
  } catch (error) {
    console.error("parseBolt11Invoice: failed to decode invoice", error);
    return null;
  }
}
