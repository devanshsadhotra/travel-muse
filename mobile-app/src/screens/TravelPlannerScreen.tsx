import React, { useEffect, useMemo, useRef, useState } from "react";
import { getLocales } from "expo-localization";
import {
  ActivityIndicator,
  Animated,
  Image,
  ImageBackground,
  LayoutAnimation,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { DMSerifDisplay_400Regular } from "@expo-google-fonts/dm-serif-display";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { FadeInBlock } from "../components/ui/FadeInBlock";
import { ChoiceChips } from "../components/ui/ChoiceChips";
import { MonthPicker } from "../components/ui/MonthPicker";
import { Metric } from "../components/ui/Metric";
import { Card } from "../components/ui/Card";
import { SectionHeader } from "../components/ui/SectionHeader";
import { Pill } from "../components/ui/Pill";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { LocationInput } from "../components/ui/LocationInput";
import { FieldLabel } from "../components/ui/FieldLabel";
import { StayTier } from "../components/travel/StayTier";
import { LoadingOverlay } from "../components/travel/LoadingOverlay";
import { TravelAssistantSheet } from "../components/travel/TravelAssistantSheet";
import { MapLocationPicker } from "../components/ui/MapLocationPicker";
import { COLORS } from "../constants/theme";
import {
  getCurrentMonthName,
  getHeroCopy,
  loaderMessages,
  MAX_DAYS,
  sectionLabels,
  stayTierMeta,
  terrainTitles,
} from "../constants/travel";
import { destinationMedia, getDestinationKey } from "../data/destinationMedia";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import {
  askTravelAssistant,
  fallbackOptions,
  fetchOptions,
  fetchSeasonalSuggestions,
  generateItinerary,
} from "../services/travelApi";
import { ApiOptions, ItineraryResponse, SeasonalSuggestionsResponse, TravelChatMessage } from "../types/travel";

const appHeaderImage = require("../../imagesets/commonImage/travel.jpg");

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TravelPlannerScreen() {
  const initialTravelMonth = getCurrentMonthName();
  const userCurrency = getLocales()[0]?.currencyCode ?? "INR";

  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
  });

  const [options, setOptions] = useState<ApiOptions>(fallbackOptions);
  const [city, setCity] = useState("");
  const [days, setDays] = useState("4");
  const [travelMonth, setTravelMonth] = useState(initialTravelMonth);
  const [provider, setProvider] = useState("openai");
  const [tripType, setTripType] = useState("romantic");
  const [foodPreference, setFoodPreference] = useState("veg");
  const [seasonalSuggestions, setSeasonalSuggestions] = useState<SeasonalSuggestionsResponse | null>(null);
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [mapPickerOpen, setMapPickerOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantMessages, setAssistantMessages] = useState<TravelChatMessage[]>([
    {
      role: "assistant",
      text: "Ask me anything about your trip and I'll stay within travel planning.",
    },
  ]);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantError, setAssistantError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ItineraryResponse | null>(null);
  const chatScrollRef = useRef<ScrollView | null>(null);
  const heroFloat = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;
  const [loaderIndex, setLoaderIndex] = useState(0);

  const debouncedCity = useDebouncedValue(city.trim(), 2000);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(heroFloat, {
          toValue: -8,
          duration: 2600,
          useNativeDriver: true,
        }),
        Animated.timing(heroFloat, {
          toValue: 0,
          duration: 2600,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [heroFloat]);

  useEffect(() => {
    fetchOptions().then((data) => {
      setOptions(data);
      setProvider(data.providers[0] || "openai");
      setTravelMonth((current) => (current ? current : data.travelMonths[0] || initialTravelMonth));
      setTripType(data.tripTypes[0] || "solo");
      setFoodPreference(data.foodPreferences[0] || "no restrictions");
    });
    fetchSeasonalSuggestions().then(setSeasonalSuggestions);
  }, []);

  useEffect(() => {
    if (!loading) {
      loaderOpacity.setValue(0);
      setLoaderIndex(0);
      return;
    }

    Animated.timing(loaderOpacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();

    const interval = setInterval(() => {
      setLoaderIndex((current) => (current + 1) % loaderMessages.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [loaderOpacity, loading]);

  useEffect(() => {
    if (!assistantOpen) {
      return;
    }

    const timeoutId = setTimeout(() => {
      chatScrollRef.current?.scrollToEnd({ animated: true });
    }, 80);

    return () => clearTimeout(timeoutId);
  }, [assistantMessages, assistantLoading, assistantOpen]);

  const highlightText = useMemo(() => {
    if (!result?.itinerary.overview.highlights?.length) {
      return "Sunrise walks, local textures, long-table meals, and just enough surprise.";
    }
    return result.itinerary.overview.highlights.slice(0, 3).join(" • ");
  }, [result]);

  const destinationKey = useMemo(() => getDestinationKey(debouncedCity), [debouncedCity]);
  const destinationImages = useMemo(
    () => (destinationKey ? [...destinationMedia[destinationKey]] : []),
    [destinationKey],
  );
  const heroCopy = useMemo(() => getHeroCopy(debouncedCity), [debouncedCity]);

  const destinationSuggestions = useMemo(() => {
    const allDestinations = seasonalSuggestions?.windowMonths.flatMap((window) => window.destinations) || [];
    const uniqueDestinations = allDestinations.filter(
      (destination, index, self) =>
        index === self.findIndex((item) => item.city === destination.city && item.country === destination.country),
    );

    const query = city.trim().toLowerCase();
    if (!query) {
      return uniqueDestinations.slice(0, 5);
    }

    return uniqueDestinations
      .filter((destination) => `${destination.city}, ${destination.country}`.toLowerCase().includes(query))
      .slice(0, 5);
  }, [city, seasonalSuggestions]);

  const submit = async () => {
    const parsedDays = Number(days);
    if (!city.trim() || Number.isNaN(parsedDays) || parsedDays < 1 || parsedDays > MAX_DAYS) {
      setError(`Add a city and choose between 1 and ${MAX_DAYS} days.`);
      return;
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setError(null);
    setLoading(true);

    try {
      const itinerary = await generateItinerary({
        provider,
        city: city.trim(),
        days: parsedDays,
        travelMonth,
        tripType,
        foodPreference,
        userCurrency,
      });
      setResult(itinerary);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to generate your itinerary right now.",
      );
    } finally {
      setLoading(false);
    }
  };

  const submitAssistantQuestion = async () => {
    const nextQuestion = assistantQuestion.trim();
    if (!nextQuestion) {
      setAssistantError("Ask a travel-related question first.");
      return;
    }

    const nextUserMessage: TravelChatMessage = { role: "user", text: nextQuestion };
    const nextHistory = [...assistantMessages, nextUserMessage];
    setAssistantError(null);
    setAssistantLoading(true);
    setAssistantQuestion("");
    setAssistantMessages(nextHistory);

    try {
      const activeCity = result?.meta.city || city.trim() || undefined;
      const activeTravelMonth = result?.meta.travelMonth || (activeCity ? travelMonth : undefined);
      const response = await askTravelAssistant({
        provider,
        question: nextQuestion,
        history: nextHistory,
        city: activeCity,
        travelMonth: activeTravelMonth,
        tripType,
        foodPreference,
      });
      setAssistantMessages((current) => [...current, { role: "assistant", text: response.answer }]);
    } catch (questionError) {
      setAssistantError(
        questionError instanceof Error
          ? questionError.message
          : "Unable to answer that travel question right now.",
      );
    } finally {
      setAssistantLoading(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.screen, styles.loadingScreen]}>
        <ActivityIndicator size="large" color={COLORS.coral} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* ── Hero ── */}
        <FadeInBlock index={0}>
          <ImageBackground source={appHeaderImage} style={styles.hero} imageStyle={styles.heroImage}>
            <LinearGradient colors={["rgba(22,35,42,0.22)", "rgba(22,35,42,0.74)"]} style={styles.heroOverlay}>
              <View style={styles.heroBadge}>
                <Ionicons name="airplane" size={14} color={COLORS.coral} />
                <Text style={styles.heroBadgeText}>Travel muse</Text>
              </View>
              <Animated.View style={{ transform: [{ translateY: heroFloat }] }}>
                <Text style={styles.heroTitle}>{heroCopy.title}</Text>
              </Animated.View>
              <Text style={styles.heroSubtitle}>{heroCopy.subtitle}</Text>
              <View style={styles.heroPills}>
                {heroCopy.pills.map((pill) => (
                  <Text key={pill} style={styles.heroPill}>{pill}</Text>
                ))}
              </View>
            </LinearGradient>
          </ImageBackground>
        </FadeInBlock>

        {/* ── Form ── */}
        <FadeInBlock index={1}>
          <Card style={{ gap: 14 }}>
            <Text style={styles.cardTitle}>Build your itinerary</Text>

            <View style={styles.fieldBlock}>
              <FieldLabel>Destination</FieldLabel>
              <LocationInput value={city} onChangeText={setCity} onMapPress={() => setMapPickerOpen(true)} />
              {destinationSuggestions.length ? (
                <View style={styles.suggestionChips}>
                  {destinationSuggestions.map((destination) => (
                    <Pressable
                      key={`${destination.city}-${destination.country}`}
                      onPress={() => setCity(destination.city)}
                      style={styles.suggestionChip}
                    >
                      <Text style={styles.suggestionChipText}>
                        {destination.city}, {destination.country}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>

            <View style={styles.fieldBlock}>
              <FieldLabel>Days</FieldLabel>
              <TextInput
                value={days}
                onChangeText={setDays}
                keyboardType="number-pad"
                placeholder="4"
                placeholderTextColor={COLORS.muted}
                style={styles.input}
              />
              <Text style={styles.helperText}>Choose between 1 and 30 days.</Text>
            </View>

            <ChoiceChips label="Provider" options={options.providers} value={provider} onChange={setProvider} />
            <MonthPicker
              label="Travel month"
              options={options.travelMonths}
              value={travelMonth}
              open={monthPickerOpen}
              onOpen={() => setMonthPickerOpen(true)}
              onClose={() => setMonthPickerOpen(false)}
              onChange={setTravelMonth}
            />
            <ChoiceChips label="Trip style" options={options.tripTypes} value={tripType} onChange={setTripType} />
            <ChoiceChips
              label="Food preference"
              options={options.foodPreferences}
              value={foodPreference}
              onChange={setFoodPreference}
            />

            <PrimaryButton label="Generate itinerary" icon="arrow-forward" onPress={submit} loading={loading} />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </Card>
        </FadeInBlock>

        {/* ── Seasonal suggestions ── */}
        {!result && seasonalSuggestions?.windowMonths?.length ? (
          <FadeInBlock index={2}>
            <View style={styles.section}>
              <SectionHeader title="Seasonal picks" caption="Good options for this season and the next few months" />
              <View style={styles.sectionList}>
                {seasonalSuggestions.windowMonths.map((window) => (
                  <Card key={`${window.month}-${window.year}`} style={{ gap: 12, padding: 18 }}>
                    <View style={styles.monthHeader}>
                      <Text style={styles.monthTitle}>{window.month} {window.year}</Text>
                      <Text style={styles.monthSubtitle}>Tap a destination to auto-fill the planner</Text>
                    </View>
                    {window.destinations.map((destination, index) => (
                      <Pressable
                        key={`${window.month}-${destination.city}-${index}`}
                        onPress={() => {
                          setCity(destination.city);
                          setTravelMonth(window.month);
                        }}
                        style={styles.destinationCard}
                      >
                        <View style={styles.destinationRow}>
                          <View style={styles.destinationText}>
                            <Text style={styles.destinationCity}>
                              {destination.city}, {destination.country}
                            </Text>
                            <Text style={styles.destinationVibe}>{destination.vibe}</Text>
                          </View>
                          <Pill label={destination.season} variant="soft" />
                        </View>
                        <Text style={styles.destinationWhy}>{destination.whyNow}</Text>
                      </Pressable>
                    ))}
                  </Card>
                ))}
              </View>
            </View>
          </FadeInBlock>
        ) : null}

        {result ? (
          <>
            {/* ── Summary ── */}
            <FadeInBlock index={3}>
              <Card variant="dark" style={{ gap: 14, padding: 22 }}>
                <View style={styles.summaryTopRow}>
                  <View>
                    <Text style={styles.eyebrow}>
                      {terrainTitles[result.itinerary.destination.terrain] || "Curated Escape"}
                    </Text>
                    <Text style={styles.summaryTitle}>
                      {result.itinerary.destination.city}
                      {result.itinerary.destination.country ? `, ${result.itinerary.destination.country}` : ""}
                    </Text>
                  </View>
                  <Pill label={result.itinerary.destination.terrain} variant="ghost" />
                </View>
                <Text style={styles.summaryTagline}>
                  {result.itinerary.destination.tagline || "A soft-paced itinerary with room to wander well."}
                </Text>
                <Text style={styles.highlightText}>{highlightText}</Text>
                <View style={styles.metricsRow}>
                  <Metric icon="calendar-outline" label="Duration" value={`${result.meta.days} days`} />
                  <Metric icon="airplane-outline" label="Month" value={result.meta.travelMonth} />
                  <Metric icon="walk-outline" label="Pace" value={result.itinerary.overview.pace} />
                  <Metric
                    icon="sunny-outline"
                    label="Best season"
                    value={result.itinerary.destination.bestTimeToVisit}
                  />
                </View>
              </Card>
            </FadeInBlock>

            {/* ── When to go ── */}
            {(result.itinerary.travelInsights?.season ||
              result.itinerary.travelInsights?.weather ||
              result.itinerary.travelInsights?.flightEstimate?.economyRoundTrip) ? (
              <FadeInBlock index={4}>
                <Card style={{ gap: 12 }}>
                  <SectionHeader title="When to go" caption={result.meta.travelMonth + " outlook"} />
                  <View style={styles.pillRow}>
                    {!!result.itinerary.travelInsights?.season && (
                      <Pill label={result.itinerary.travelInsights.season} variant="coral" />
                    )}
                    {!!result.itinerary.travelInsights?.temperatureRange && (
                      <Pill label={result.itinerary.travelInsights.temperatureRange} variant="soft" />
                    )}
                  </View>
                  {!!result.itinerary.travelInsights?.seasonSummary && (
                    <Text style={styles.seasonBody}>{result.itinerary.travelInsights.seasonSummary}</Text>
                  )}
                  {!!result.itinerary.travelInsights?.weather && (
                    <Text style={styles.metaLine}>
                      <Text style={styles.metaLabel}>Weather: </Text>
                      {result.itinerary.travelInsights.weather}
                    </Text>
                  )}
                  {!!result.itinerary.travelInsights?.flightEstimate?.economyRoundTrip && (
                    <Text style={styles.metaLine}>
                      <Text style={styles.metaLabel}>Flights: </Text>
                      {result.itinerary.travelInsights.flightEstimate.economyRoundTrip}
                    </Text>
                  )}
                  {!!result.itinerary.travelInsights?.flightEstimate?.notes && (
                    <Text style={styles.metaFootnote}>{result.itinerary.travelInsights.flightEstimate.notes}</Text>
                  )}
                </Card>
              </FadeInBlock>
            ) : null}

            {/* ── Gallery ── */}
            {destinationImages.length ? (
              <FadeInBlock index={5}>
                <View style={styles.section}>
                  <SectionHeader title="Bali moodboard" caption="Pulled from your local imageset" />
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
                    {destinationImages.slice(0, 6).map((source, index) => (
                      <View
                        key={`gallery-${index}`}
                        style={[styles.galleryCard, index === 0 ? styles.galleryCardLarge : styles.galleryCardSmall]}
                      >
                        <Image source={source} style={styles.galleryImage} />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </FadeInBlock>
            ) : null}

            {/* ── Stays ── */}
            {stayTierMeta.some((tier) => result.itinerary.stays?.[tier.key]?.length) ? (
              <FadeInBlock index={6}>
                <View style={styles.section}>
                  <SectionHeader title="Where to stay" caption="By budget and comfort level" />
                  {stayTierMeta.map((tier) => (
                    <StayTier key={tier.key} label={tier.label} icon={tier.icon} stays={result.itinerary.stays?.[tier.key] || []} />
                  ))}
                </View>
              </FadeInBlock>
            ) : null}

            {/* ── Day plans ── */}
            {result.itinerary.days.map((dayPlan, index) => (
              <FadeInBlock key={dayPlan.day} index={index + 7}>
                <Card style={{ gap: 18 }}>
                  <View style={styles.dayHeader}>
                    <View style={styles.dayBadge}>
                      <Text style={styles.dayBadgeText}>{dayPlan.day}</Text>
                    </View>
                    <View style={styles.dayHeaderText}>
                      <Text style={styles.dayTitle}>{dayPlan.title}</Text>
                      <Text style={styles.dayTheme}>{dayPlan.theme}</Text>
                    </View>
                  </View>

                  {sectionLabels.map((section) =>
                    dayPlan[section]?.length ? (
                      <View key={section} style={styles.timelineSection}>
                        <Text style={styles.timelineHeading}>{section}</Text>
                        {dayPlan[section].map((item, itemIndex) => (
                          <View key={`${section}-${itemIndex}`} style={styles.timelineItem}>
                            <Text style={styles.timelineTime}>{item.time}</Text>
                            <View style={styles.timelineBody}>
                              <Text style={styles.timelineTitle}>{item.title}</Text>
                              <Text style={styles.timelineLocation}>{item.location}</Text>
                              <Text style={styles.timelineDesc}>{item.description}</Text>
                            </View>
                          </View>
                        ))}
                      </View>
                    ) : null,
                  )}

                  {dayPlan.food?.length ? (
                    <View style={styles.infoSection}>
                      <Text style={styles.infoLabel}>Food stops</Text>
                      {dayPlan.food.map((spot, foodIndex) => (
                        <View key={`${spot.name}-${foodIndex}`} style={styles.foodRow}>
                          <View>
                            <Text style={styles.foodName}>{spot.name}</Text>
                            <Text style={styles.foodType}>{spot.type}</Text>
                          </View>
                          <Text style={styles.foodDishes}>{spot.mustTry.join(", ")}</Text>
                        </View>
                      ))}
                    </View>
                  ) : null}

                  {dayPlan.tips?.length ? (
                    <View style={styles.infoSection}>
                      <Text style={styles.infoLabel}>Tips</Text>
                      <Text style={styles.tipsText}>{dayPlan.tips.join(" • ")}</Text>
                    </View>
                  ) : null}
                </Card>
              </FadeInBlock>
            ))}

            {/* ── Practical notes ── */}
            <FadeInBlock index={result.itinerary.days.length + 7}>
              <Card variant="muted" style={{ gap: 12 }}>
                <Text style={styles.cardTitle}>Practical notes</Text>
                {!!result.itinerary.practical.transport?.length && (
                  <Text style={styles.practicalLine}>
                    <Text style={styles.practicalLabel}>Transport: </Text>
                    {result.itinerary.practical.transport.join(" • ")}
                  </Text>
                )}
                {!!result.itinerary.practical.budgetTips?.length && (
                  <Text style={styles.practicalLine}>
                    <Text style={styles.practicalLabel}>Budget: </Text>
                    {result.itinerary.practical.budgetTips.join(" • ")}
                  </Text>
                )}
                {!!result.itinerary.practical.packingTips?.length && (
                  <Text style={styles.practicalLine}>
                    <Text style={styles.practicalLabel}>Packing: </Text>
                    {result.itinerary.practical.packingTips.join(" • ")}
                  </Text>
                )}
                {!!result.itinerary.practical.localEtiquette?.length && (
                  <Text style={styles.practicalLine}>
                    <Text style={styles.practicalLabel}>Etiquette: </Text>
                    {result.itinerary.practical.localEtiquette.join(" • ")}
                  </Text>
                )}
              </Card>
            </FadeInBlock>
          </>
        ) : null}
      </ScrollView>

      {loading ? <LoadingOverlay opacity={loaderOpacity} message={loaderMessages[loaderIndex]} /> : null}

      <Pressable
        style={styles.fab}
        onPress={() => {
          setAssistantOpen(true);
          setAssistantError(null);
        }}
      >
        <Ionicons name="chatbubble-ellipses" size={22} color={COLORS.white} />
      </Pressable>

      <TravelAssistantSheet
        visible={assistantOpen}
        messages={assistantMessages}
        question={assistantQuestion}
        loading={assistantLoading}
        error={assistantError}
        chatScrollRef={chatScrollRef}
        onClose={() => setAssistantOpen(false)}
        onChangeQuestion={setAssistantQuestion}
        onSubmit={submitAssistantQuestion}
      />

      <MapLocationPicker
        visible={mapPickerOpen}
        onClose={() => setMapPickerOpen(false)}
        onSelect={(selectedCity) => setCity(selectedCity)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ── Layout ──
  screen: { flex: 1, backgroundColor: COLORS.sand },
  loadingScreen: { alignItems: "center", justifyContent: "center" },
  content: { padding: 16, paddingBottom: 80, gap: 16 },

  // ── Hero ──
  hero: { borderRadius: 24, overflow: "hidden", minHeight: 320 },
  heroImage: { borderRadius: 24 },
  heroOverlay: { flex: 1, padding: 24, gap: 14, justifyContent: "flex-end" },
  heroBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  heroBadgeText: {
    color: COLORS.ink,
    fontFamily: "PlusJakartaSans_700Bold",
    textTransform: "uppercase",
    fontSize: 11,
    letterSpacing: 1,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 38,
    lineHeight: 44,
    fontFamily: "DMSerifDisplay_400Regular",
    maxWidth: "90%",
  },
  heroSubtitle: {
    color: "#EDF3F4",
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "PlusJakartaSans_400Regular",
    maxWidth: "94%",
  },
  heroPills: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  heroPill: {
    backgroundColor: "rgba(255,255,255,0.18)",
    color: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    overflow: "hidden",
    fontSize: 12,
    fontFamily: "PlusJakartaSans_500Medium",
  },

  // ── Form ──
  cardTitle: {
    color: COLORS.ink,
    fontSize: 26,
    lineHeight: 32,
    fontFamily: "DMSerifDisplay_400Regular",
  },
  fieldBlock: { gap: 8 },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: COLORS.line,
    color: COLORS.ink,
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 15,
  },
  suggestionChips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  suggestionChip: {
    backgroundColor: COLORS.white,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  suggestionChipText: {
    color: COLORS.ink,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  helperText: { color: COLORS.muted, fontSize: 12, lineHeight: 18, fontFamily: "PlusJakartaSans_400Regular" },
  errorText: { color: COLORS.coral, fontSize: 13, lineHeight: 18, fontFamily: "PlusJakartaSans_500Medium" },

  // ── Seasonal suggestions ──
  section: { gap: 12 },
  sectionList: { gap: 12 },
  monthHeader: { gap: 4 },
  monthTitle: { color: COLORS.ink, fontSize: 22, lineHeight: 28, fontFamily: "DMSerifDisplay_400Regular" },
  monthSubtitle: { color: COLORS.muted, fontSize: 12, lineHeight: 18, fontFamily: "PlusJakartaSans_400Regular" },
  destinationCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    gap: 8,
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  destinationRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  destinationText: { flex: 1, gap: 4, minWidth: 0 },
  destinationCity: {
    color: COLORS.ink,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: "PlusJakartaSans_700Bold",
    flexShrink: 1,
  },
  destinationVibe: {
    color: COLORS.ocean,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "PlusJakartaSans_500Medium",
    flexShrink: 1,
  },
  destinationWhy: { color: COLORS.muted, fontSize: 13, lineHeight: 20, fontFamily: "PlusJakartaSans_400Regular" },

  // ── Summary card (dark) ──
  summaryTopRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  eyebrow: {
    color: "#B7D9DA",
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  summaryTitle: {
    color: COLORS.white,
    fontSize: 34,
    lineHeight: 38,
    fontFamily: "DMSerifDisplay_400Regular",
    marginTop: 6,
    flexShrink: 1,
  },
  summaryTagline: { color: "#D6E4E5", fontSize: 15, lineHeight: 22, fontFamily: "PlusJakartaSans_400Regular" },
  highlightText: { color: "#F7D7C6", fontFamily: "PlusJakartaSans_500Medium", lineHeight: 22 },
  metricsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  // ── When to go ──
  pillRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  seasonBody: { color: COLORS.ink, fontSize: 14, lineHeight: 22, fontFamily: "PlusJakartaSans_400Regular" },
  metaLine: { color: COLORS.muted, fontSize: 13, lineHeight: 20, fontFamily: "PlusJakartaSans_400Regular" },
  metaLabel: { color: COLORS.ink, fontFamily: "PlusJakartaSans_700Bold" },
  metaFootnote: { color: COLORS.ocean, fontSize: 12, lineHeight: 18, fontFamily: "PlusJakartaSans_500Medium" },

  // ── Gallery ──
  galleryRow: { gap: 10, paddingRight: 16 },
  galleryCard: { borderRadius: 18, overflow: "hidden", backgroundColor: COLORS.mist },
  galleryCardLarge: { width: 240, height: 300 },
  galleryCardSmall: { width: 180, height: 220, marginTop: 40 },
  galleryImage: { width: "100%", height: "100%" },

  // ── Day cards ──
  dayHeader: { flexDirection: "row", alignItems: "center", gap: 14 },
  dayBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.peach,
    alignItems: "center",
    justifyContent: "center",
  },
  dayBadgeText: { color: COLORS.coral, fontFamily: "PlusJakartaSans_700Bold", fontSize: 18 },
  dayHeaderText: { flex: 1, gap: 4 },
  dayTitle: { color: COLORS.ink, fontSize: 22, lineHeight: 28, fontFamily: "DMSerifDisplay_400Regular" },
  dayTheme: { color: COLORS.muted, fontSize: 14, lineHeight: 20, fontFamily: "PlusJakartaSans_400Regular" },
  timelineSection: { gap: 10 },
  timelineHeading: {
    color: COLORS.muted,
    fontSize: 11,
    fontFamily: "PlusJakartaSans_700Bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  timelineItem: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  timelineTime: { width: 76, color: COLORS.coral, fontSize: 12, lineHeight: 20, fontFamily: "PlusJakartaSans_700Bold" },
  timelineBody: { flex: 1, gap: 4, borderLeftWidth: 1, borderLeftColor: COLORS.line, paddingLeft: 14 },
  timelineTitle: { color: COLORS.ink, fontSize: 15, lineHeight: 20, fontFamily: "PlusJakartaSans_700Bold" },
  timelineLocation: { color: COLORS.ocean, fontSize: 13, fontFamily: "PlusJakartaSans_500Medium" },
  timelineDesc: { color: COLORS.muted, fontSize: 13, lineHeight: 20, fontFamily: "PlusJakartaSans_400Regular" },
  infoSection: { gap: 10, borderTopWidth: 1, borderTopColor: COLORS.line, paddingTop: 16 },
  infoLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  foodRow: { gap: 8 },
  foodName: { color: COLORS.ink, fontSize: 15, fontFamily: "PlusJakartaSans_700Bold" },
  foodType: { color: COLORS.muted, fontSize: 13, fontFamily: "PlusJakartaSans_500Medium" },
  foodDishes: { color: COLORS.ocean, fontSize: 13, lineHeight: 20, fontFamily: "PlusJakartaSans_400Regular" },
  tipsText: { color: COLORS.muted, fontSize: 13, lineHeight: 21, fontFamily: "PlusJakartaSans_400Regular" },

  // ── Practical notes ──
  practicalLine: { color: COLORS.ink, fontSize: 14, lineHeight: 22, fontFamily: "PlusJakartaSans_400Regular" },
  practicalLabel: { fontFamily: "PlusJakartaSans_700Bold" },

  // ── FAB ──
  fab: {
    position: "absolute",
    right: 20,
    bottom: 28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.coral,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.coral,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
});
