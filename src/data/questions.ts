import { SelectOption } from "@/types/quiz";

export const AGE_RANGES: SelectOption[] = [
  { id: "18-24", label: "18–24" },
  { id: "25-34", label: "25–34" },
  { id: "35-44", label: "35–44" },
  { id: "45-54", label: "45–54" },
  { id: "55+", label: "55+" },
];

export const GENDER_OPTIONS: SelectOption[] = [
  { id: "male", label: "Male", image: "/illustrations/gender-male.svg" },
  { id: "female", label: "Female", image: "/illustrations/gender-female.svg" },
];

export const NORWOOD_STAGES: SelectOption[] = [
  { id: "1", label: "Stage 1", description: "No visible hair loss", image: "/illustrations/norwood-1.svg" },
  { id: "2", label: "Stage 2", description: "Slight recession at temples", image: "/illustrations/norwood-2.svg" },
  { id: "3", label: "Stage 3", description: "Deep temple recession", image: "/illustrations/norwood-3.svg" },
  { id: "4", label: "Stage 4", description: "Crown thinning begins", image: "/illustrations/norwood-4.svg" },
  { id: "5", label: "Stage 5", description: "Larger bald area", image: "/illustrations/norwood-5.svg" },
  { id: "6", label: "Stage 6", description: "Temple and crown merge", image: "/illustrations/norwood-6.svg" },
  { id: "7", label: "Stage 7", description: "Most extensive hair loss", image: "/illustrations/norwood-7.svg" },
];

export const HAIR_FALL_LOCATION: SelectOption[] = [
  { id: "front", label: "Front / Hairline" },
  { id: "top", label: "Top / Crown" },
  { id: "both", label: "Both front and top" },
];

export const FAMILY_HISTORY: SelectOption[] = [
  { id: "mother", label: "Mother's side" },
  { id: "father", label: "Father's side" },
  { id: "both", label: "Both sides" },
  { id: "none", label: "None" },
];

export const DANDRUFF_OPTIONS: SelectOption[] = [
  { id: "frequently", label: "Yes, frequently" },
  { id: "occasionally", label: "Occasionally" },
  { id: "no", label: "No" },
  { id: "not_sure", label: "Not sure" },
];

export const FEMALE_HAIR_VOLUME: SelectOption[] = [
  { id: "normal", label: "~20 strands (normal)", description: "Normal daily shedding", image: "/illustrations/hair-volume-normal.svg" },
  { id: "medium", label: "Medium clump, 40–50 strands", description: "Noticeable increase", image: "/illustrations/hair-volume-medium.svg" },
  { id: "large", label: "Large clump, 100+ strands", description: "Significant shedding", image: "/illustrations/hair-volume-large.svg" },
];

export const FEMALE_HAIR_DURATION: SelectOption[] = [
  { id: "less_1_month", label: "Less than 1 month" },
  { id: "1_6_months", label: "1–6 months" },
  { id: "6_12_months", label: "6–12 months" },
  { id: "over_1_year", label: "Over 1 year" },
];

export const FEMALE_HAIR_PATTERN: SelectOption[] = [
  { id: "volume_reduced", label: "Overall volume reduced", image: "/illustrations/pattern-volume.svg" },
  { id: "side_thinning", label: "Side thinning", image: "/illustrations/pattern-side.svg" },
  { id: "widening_partition", label: "Widening partition", image: "/illustrations/pattern-partition.svg" },
  { id: "coin_patch", label: "Coin-sized patch", image: "/illustrations/pattern-patch.svg" },
];

export const FEMALE_TREATMENTS: SelectOption[] = [
  { id: "blow_drying", label: "Blow-drying" },
  { id: "straightening", label: "Straightening / Keratin" },
  { id: "coloring", label: "Hair coloring" },
  { id: "none", label: "None" },
];

export const FEMALE_IRON: SelectOption[] = [
  { id: "normal", label: "Normal" },
  { id: "low", label: "Low / Anemic" },
  { id: "unknown", label: "Not tested / Don't know" },
];

export const FEMALE_SYMPTOMS: SelectOption[] = [
  { id: "acne", label: "Pimples / acne" },
  { id: "facial_hair", label: "Excess facial hair" },
  { id: "irregular_periods", label: "Irregular periods" },
  { id: "hormonal", label: "Hormonal changes / mood swings" },
];

export const FEMALE_LIFE_STAGE: SelectOption[] = [
  { id: "pregnant", label: "Currently pregnant" },
  { id: "planning", label: "Planning pregnancy" },
  { id: "baby_under_1", label: "Baby under 1 year old" },
  { id: "menopause", label: "No longer menstruating (menopause)" },
  { id: "none", label: "None of these" },
];

export const DIGESTION_OPTIONS: SelectOption[] = [
  { id: "acidity", label: "Acidity" },
  { id: "constipated", label: "Mostly constipated" },
  { id: "loose", label: "Loose motion" },
  { id: "serious", label: "Serious digestive condition" },
  { id: "none", label: "None" },
];

export const SLEEP_OPTIONS: SelectOption[] = [
  { id: "less_5", label: "Less than 5 hrs" },
  { id: "5_7", label: "5–7 hrs" },
  { id: "7_plus", label: "7+ hrs, consistent" },
  { id: "irregular", label: "Irregular / disturbed" },
];

export const STRESS_OPTIONS: SelectOption[] = [
  { id: "low", label: "Low" },
  { id: "moderate", label: "Moderate" },
  { id: "high", label: "High" },
  { id: "very_high", label: "Very high" },
];

export const ENERGY_OPTIONS: SelectOption[] = [
  { id: "low", label: "Low throughout day" },
  { id: "afternoon_dip", label: "Dips in afternoon" },
  { id: "energetic", label: "Consistently energetic" },
];

export const SUPPLEMENT_OPTIONS: SelectOption[] = [
  { id: "regularly", label: "Yes, regularly" },
  { id: "occasionally", label: "Occasionally" },
  { id: "no", label: "No" },
];

export const FOOD_HABITS: SelectOption[] = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "non_vegetarian", label: "Non-vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "eggetarian", label: "Eggetarian" },
];

export const BALANCED_DIET: SelectOption[] = [
  { id: "yes", label: "Yes" },
  { id: "somewhat", label: "Somewhat" },
  { id: "no", label: "No" },
];

export const MALE_CONDITIONS: SelectOption[] = [
  { id: "diabetes", label: "Diabetes" },
  { id: "thyroid", label: "Thyroid" },
  { id: "pcod", label: "PCOD / Hormonal" },
  { id: "none", label: "None" },
  { id: "other", label: "Other" },
];

export const BOWEL_OPTIONS: SelectOption[] = [
  { id: "regular", label: "Regular" },
  { id: "constipated", label: "Constipated" },
  { id: "loose", label: "Loose motion" },
  { id: "irregular", label: "Irregular" },
];

export const GAS_OPTIONS: SelectOption[] = [
  { id: "frequently", label: "Frequently" },
  { id: "occasionally", label: "Occasionally" },
  { id: "rarely", label: "Rarely" },
  { id: "never", label: "Never" },
];

export const BP_OPTIONS: SelectOption[] = [
  { id: "normal", label: "Normal" },
  { id: "high", label: "High (Hypertension)" },
  { id: "low", label: "Low" },
  { id: "unknown", label: "Not tested / Don't know" },
];

export const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
];
