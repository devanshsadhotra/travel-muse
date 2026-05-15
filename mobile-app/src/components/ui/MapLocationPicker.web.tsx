import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/theme";

type GeoResult = { city: string; country: string } | null;
type SearchResult = { lat: string; lon: string; display_name: string };

async function reverseGeocode(lat: number, lon: number): Promise<GeoResult> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { "Accept-Language": "en", "User-Agent": "TravelMuseApp/1.0" } },
    );
    const data = await res.json();
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      data.address?.state_district;
    return city ? { city, country: data.address?.country ?? "" } : null;
  } catch {
    return null;
  }
}

async function forwardGeocode(query: string): Promise<SearchResult[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
      { headers: { "Accept-Language": "en", "User-Agent": "TravelMuseApp/1.0" } },
    );
    return await res.json();
  } catch {
    return [];
  }
}

function MapRefCapture({ mapRef }: { mapRef: React.MutableRefObject<LeafletMap | null> }) {
  const map = useMap();
  useEffect(() => { mapRef.current = map; }, [map, mapRef]);
  return null;
}

function MapEventHandler({
  onMoveStart,
  onMoveEnd,
}: {
  onMoveStart: () => void;
  onMoveEnd: (lat: number, lng: number) => void;
}) {
  const map = useMapEvents({
    movestart: () => onMoveStart(),
    moveend: () => {
      const c = map.getCenter();
      onMoveEnd(c.lat, c.lng);
    },
  });
  return null;
}

export function MapLocationPicker({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (city: string) => void;
}) {
  const mapRef = useRef<LeafletMap | null>(null);
  const hasMoved = useRef(false);

  const [location, setLocation] = useState<GeoResult>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const pinY = useRef(new Animated.Value(0)).current;
  const shadowScale = useRef(new Animated.Value(1)).current;
  const sheetY = useRef(new Animated.Value(180)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      hasMoved.current = false;
      setLocation(null);
      setSearchQuery("");
      setSearchResults([]);
      setIsSearching(false);
      pinY.setValue(0);
      shadowScale.setValue(1);
      sheetY.setValue(180);
      contentOpacity.setValue(1);
    }
  }, [visible, pinY, shadowScale, sheetY, contentOpacity]);

  const liftPin = useCallback(() => {
    Animated.parallel([
      Animated.spring(pinY, { toValue: -20, friction: 5, tension: 140, useNativeDriver: true }),
      Animated.spring(shadowScale, { toValue: 0.55, friction: 5, tension: 140, useNativeDriver: true }),
    ]).start();
  }, [pinY, shadowScale]);

  const dropPin = useCallback(() => {
    Animated.parallel([
      Animated.spring(pinY, { toValue: 0, friction: 2.8, tension: 70, useNativeDriver: true }),
      Animated.spring(shadowScale, { toValue: 1, friction: 4, tension: 80, useNativeDriver: true }),
    ]).start();
  }, [pinY, shadowScale]);

  const slideSheetUp = useCallback(() => {
    Animated.spring(sheetY, { toValue: 0, friction: 9, tension: 55, useNativeDriver: true }).start();
  }, [sheetY]);

  const retractSheet = useCallback(() => {
    Animated.timing(sheetY, { toValue: 180, duration: 160, useNativeDriver: true }).start();
  }, [sheetY]);

  const handleMoveStart = useCallback(() => {
    hasMoved.current = true;
    setLocation(null);
    liftPin();
    retractSheet();
  }, [liftPin, retractSheet]);

  const handleMoveEnd = useCallback(
    async (lat: number, lng: number) => {
      dropPin();
      if (!hasMoved.current) return;

      setIsGeocoding(true);
      Animated.timing(contentOpacity, { toValue: 0.45, duration: 120, useNativeDriver: true }).start();

      const result = await reverseGeocode(lat, lng);

      setIsGeocoding(false);
      setLocation(result);
      Animated.timing(contentOpacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      if (result) slideSheetUp();
    },
    [dropPin, slideSheetUp, contentOpacity],
  );

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 3) { setSearchResults([]); setIsSearching(false); return; }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await forwardGeocode(q);
      setIsSearching(false);
      setSearchResults(results.slice(0, 5));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSelect = useCallback((result: SearchResult) => {
    Keyboard.dismiss();
    setSearchQuery("");
    setSearchResults([]);
    hasMoved.current = true;
    mapRef.current?.setView([Number(result.lat), Number(result.lon)], 10, { animate: true } as any);
  }, []);

  const handleConfirm = useCallback(() => {
    if (location) { onSelect(location.city); onClose(); }
  }, [location, onSelect, onClose]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.root}>

        {/* Map */}
        <View style={StyleSheet.absoluteFillObject}>
          <MapContainer
            center={[20, 78]}
            zoom={4}
            style={{ width: "100%", height: "100%" }}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapRefCapture mapRef={mapRef} />
            <MapEventHandler onMoveStart={handleMoveStart} onMoveEnd={handleMoveEnd} />
          </MapContainer>
        </View>

        {/* Center pin */}
        <View style={styles.pinLayer} pointerEvents="none">
          <Animated.View style={{ transform: [{ translateY: pinY }] }}>
            <Ionicons name="location" size={52} color={COLORS.coral} />
          </Animated.View>
          <Animated.View
            style={[styles.pinShadow, { transform: [{ scaleX: shadowScale }], opacity: shadowScale }]}
          />
        </View>

        {/* Top search bar */}
        <SafeAreaView style={styles.topBar}>
          <View style={styles.searchRow}>
            <Pressable style={styles.backBtn} onPress={onClose} hitSlop={12}>
              <Ionicons name="arrow-back" size={20} color={COLORS.ink} />
            </Pressable>
            <View style={styles.searchBox}>
              {isSearching
                ? <ActivityIndicator size="small" color={COLORS.coral} />
                : <Ionicons name="search" size={16} color={searchQuery.length >= 3 ? COLORS.coral : COLORS.muted} />
              }
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search destination..."
                placeholderTextColor={COLORS.muted}
                style={styles.searchText}
                returnKeyType="done"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && !isSearching && (
                <Pressable onPress={() => { setSearchQuery(""); setSearchResults([]); }} hitSlop={10}>
                  <Ionicons name="close-circle" size={16} color={COLORS.muted} />
                </Pressable>
              )}
            </View>
          </View>

          {searchResults.length > 0 && (
            <View style={styles.dropdown}>
              {searchResults.map((r, i) => (
                <Pressable
                  key={i}
                  style={[styles.dropdownRow, i < searchResults.length - 1 && styles.dropdownDivider]}
                  onPress={() => handleSearchSelect(r)}
                >
                  <Ionicons name="location-outline" size={14} color={COLORS.muted} />
                  <Text style={styles.dropdownText} numberOfLines={1}>{r.display_name}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </SafeAreaView>

        {/* Bottom sheet */}
        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
          <View style={styles.sheetHandle} />
          <Animated.View style={[styles.sheetBody, { opacity: contentOpacity }]}>
            {isGeocoding ? (
              <Text style={styles.sheetHint}>Finding location…</Text>
            ) : location ? (
              <View style={styles.sheetLocation}>
                <View>
                  <Text style={styles.cityName}>{location.city}</Text>
                  {!!location.country && <Text style={styles.countryName}>{location.country}</Text>}
                </View>
                <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.confirmBtnText}>Use this location</Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.sheetHint}>Move the map to pick a location</Text>
            )}
          </Animated.View>
        </Animated.View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.mist },
  pinLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  pinShadow: {
    width: 22,
    height: 8,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.22)",
    marginTop: -6,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    gap: 10,
    zIndex: 1001,
  },
  searchRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 },
  backBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  searchText: {
    flex: 1,
    color: COLORS.ink,
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 15,
    padding: 0,
  },
  dropdown: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  dropdownDivider: { borderBottomWidth: 1, borderBottomColor: COLORS.line },
  dropdownText: {
    flex: 1,
    color: COLORS.ink,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  sheet: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 34,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 10,
    zIndex: 1001,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.line,
    alignSelf: "center",
    marginBottom: 14,
  },
  sheetBody: { gap: 14 },
  sheetLocation: { gap: 14 },
  cityName: {
    color: COLORS.ink,
    fontSize: 26,
    lineHeight: 30,
    fontFamily: "DMSerifDisplay_400Regular",
  },
  countryName: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "PlusJakartaSans_400Regular",
    marginTop: 4,
  },
  sheetHint: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "PlusJakartaSans_400Regular",
    textAlign: "center",
    paddingVertical: 6,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: COLORS.coral,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  confirmBtnText: { color: "#fff", fontSize: 15, fontFamily: "PlusJakartaSans_700Bold" },
});
