import { decode } from "light-bolt11-decoder";

export interface ParsedBolt11Invoice {
  descriptionHash?: string;
  amountMsats?: number;
}

export function parseBolt11Invoice(bolt11: string): ParsedBolt11Invoice | null {
  if (typeof bolt11 !== "string" || !bolt11) {
    console.error("parseBolt11Invoice: expected non-empty string invoice, got", bolt11);
    return null;
  }

  try {
    const decoded = decode(bolt11) as any;
    if (!decoded || typeof decoded !== "object") {
      return null;
    }

    let descriptionHash: string | undefined;
    let amountMsats: number | undefined;

    if (decoded.descriptionHash && typeof decoded.descriptionHash === "string") {
      descriptionHash = decoded.descriptionHash;
    }

    // light-bolt11-decoder typically exposes millisatoshis and/or satoshis
    if (decoded.millisatoshis != null) {
      const parsedMsats = Number(decoded.millisatoshis);
      if (!Number.isNaN(parsedMsats) && parsedMsats >= 0) {
        amountMsats = parsedMsats;
      }
    } else if (decoded.satoshis != null) {
      const parsedSats = Number(decoded.satoshis);
      if (!Number.isNaN(parsedSats) && parsedSats >= 0) {
        amountMsats = parsedSats * 1000;
      }
    }

    if (Array.isArray(decoded.sections)) {
      for (const section of decoded.sections) {
        if (!section || typeof section !== "object") {
          continue;
        }
        if (
          !descriptionHash &&
          (section.name === "description_hash" || section.name === "purpose_commit_hash") &&
          section.value
        ) {
          descriptionHash = String(section.value);
        }
        if (!amountMsats && section.name === "amount" && section.value != null) {
          const parsed = Number(section.value);
          if (!Number.isNaN(parsed) && parsed >= 0) {
            amountMsats = parsed;
          }
        }
      }
    }

    if (!descriptionHash && amountMsats == null) {
      return {};
    }

    const result: ParsedBolt11Invoice = {};
    if (descriptionHash) {
      result.descriptionHash = descriptionHash;
    }
    if (typeof amountMsats === "number") {
      result.amountMsats = amountMsats;
    }
    return result;
  } catch (error) {
    console.error("parseBolt11Invoice: failed to decode invoice", error);
    return null;
  }
}
