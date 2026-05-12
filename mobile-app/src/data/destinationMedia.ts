export const destinationMedia = {
  bali: [
    require("../../imagesets/Bali/niklas-weiss--2WlTWZLnRc-unsplash.jpg"),
    require("../../imagesets/Bali/aron-visuals-1kdIG_258bU-unsplash.jpg"),
    require("../../imagesets/Bali/geio-tischler-7hww7t6NLcg-unsplash.jpg"),
    require("../../imagesets/Bali/cassie-gallegos-Lqno1bhxoiE-unsplash.jpg"),
    require("../../imagesets/Bali/harry-kessell-eE2trMn-6a0-unsplash.jpg"),
    require("../../imagesets/Bali/alfiano-sutianto-exFdOWkYBQw-unsplash.jpg"),
    require("../../imagesets/Bali/alec-favale-Bi_5VsaOLnI-unsplash.jpg"),
    require("../../imagesets/Bali/road-trip-with-raj-sELcHR_bGVs-unsplash.jpg"),
    require("../../imagesets/Bali/istockphoto-2226960901-1024x1024.jpg"),
    require("../../imagesets/Bali/aron-visuals-ycyLUcEoalE-unsplash.jpg"),
    require("../../imagesets/Bali/silas-baisch-rf5R1qXwlDU-unsplash.jpg"),
    require("../../imagesets/Bali/katarzyna-zygnerska-Y0UUhY1V7Po-unsplash.jpg"),
    require("../../imagesets/Bali/guillaume-marques-bnMPFPuSCI0-unsplash.jpg"),
  ],
} as const;

export function getDestinationKey(city: string | undefined): keyof typeof destinationMedia | null {
  const normalized = city?.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (normalized.includes("bali")) {
    return "bali";
  }

  return null;
}
