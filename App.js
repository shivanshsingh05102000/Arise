import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const STORAGE_KEY = "arise.training.save.v1";

const ranks = [
  { name: "E", min: 1, max: 20, multiplier: 1.011 },
  { name: "D", min: 21, max: 40, multiplier: 1.01 },
  { name: "C", min: 41, max: 60, multiplier: 1.007 },
  { name: "B", min: 61, max: 75, multiplier: 1.006 },
  { name: "A", min: 76, max: 90, multiplier: 1.004 },
  { name: "S", min: 91, max: 100, multiplier: 1.003 },
];

const strengthLadder = [
  "Standard Push-Up",
  "Diamond Push-Up",
  "Wide Push-Up",
  "Archer Push-Up",
  "Decline Push-Up",
  "Pike Push-Up",
  "One-Arm Negative",
  "One-Arm Push-Up",
];

const martialMoves = {
  E: ["Jab", "Cross", "Roundhouse Kick", "Front Kick", "Guard Stance"],
  D: ["Hook", "Uppercut", "Side Kick", "Elbow Strike", "Clinch Defense"],
  C: ["Jab-Cross Combo", "Switch Kick", "Knee Strike", "Overhand", "Teep"],
  B: ["Spinning Back Kick", "Axe Kick", "Body Hook", "Double Jab", "Catch and Counter"],
  A: ["Spinning Heel Kick", "Flying Knee", "Four-Strike Combination Flow"],
  S: ["Shadow Boxing Round", "Advanced Footwork Pattern", "Full Combination Drill"],
};

function createCategory(label, exercise, target, unit, sets, difficulty) {
  return {
    label,
    exercise,
    target,
    unit,
    sets,
    difficulty,
    completedToday: false,
    actualToday: "",
    consecutiveSuccess: 0,
    consecutiveFailures: 0,
    variationIndex: 0,
  };
}

const initialState = {
  initialized: false,
  level: 1,
  xp: 0,
  totalXp: 0,
  streak: 0,
  lastQuestDate: null,
  mode: "balanced",
  baseline: null,
  categories: {
    strength: createCategory("Strength", "Standard Push-Up", 8, "reps", 3, 1),
    legs: createCategory("Legs", "Bodyweight Squat", 16, "reps", 3, 1),
    core: createCategory("Core", "Plank Hold", 24, "sec", 1, 1),
    endurance: createCategory("Endurance", "Run / Walk", 1, "km", 1, 1),
    martial: createCategory("Martial Arts", "Jab", 50, "reps", 1, 1),
  },
  history: [],
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const todayKey = () => new Date().toISOString().slice(0, 10);
const roundTarget = (value, unit) => (unit === "km" ? Math.max(0.1, Math.round(value * 10) / 10) : Math.max(1, Math.ceil(value)));

function rankForLevel(level) {
  return ranks.find((rank) => level >= rank.min && level <= rank.max) || ranks[ranks.length - 1];
}

function xpRequired(level) {
  if (level >= 100) return Infinity;
  return Math.round(100 * Math.pow(1.15, level - 1));
}

function normalizeState(saved) {
  const next = clone(initialState);
  Object.assign(next, saved || {});
  next.categories = { ...next.categories, ...(saved?.categories || {}) };
  return next;
}

function formatTarget(category) {
  if (category.unit === "km") return `${category.target} km`;
  return `${category.sets} x ${category.target} ${category.unit}`;
}

function ProgressBar({ value, color = "#e2b75b" }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }]} />
    </View>
  );
}

function Pill({ children }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{children}</Text>
    </View>
  );
}

export default function App() {
  const [state, setState] = useState(clone(initialState));
  const [screen, setScreen] = useState("quests");
  const [ready, setReady] = useState(false);
  const [baseline, setBaseline] = useState({
    pushups: "10",
    squats: "20",
    plank: "30",
    mile: "14",
    rpe: "7",
  });
  const [mode, setMode] = useState("balanced");
  const [assessmentOpen, setAssessmentOpen] = useState(false);

  const rank = rankForLevel(state.level);
  const requiredXp = xpRequired(state.level);
  const categories = Object.entries(state.categories);
  const completion = Math.round((categories.filter(([, item]) => item.completedToday).length / categories.length) * 100);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        setState(refreshForNewDay(raw ? normalizeState(JSON.parse(raw)) : clone(initialState)));
      })
      .catch(() => setState(clone(initialState)))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  const nextRankDistance = useMemo(() => {
    const next = ranks.find((item) => item.min > state.level);
    return next ? next.min - state.level : 0;
  }, [state.level]);

  function refreshForNewDay(current) {
    const next = clone(current);
    const today = todayKey();
    if (next.lastQuestDate === today) return next;

    if (next.initialized && next.lastQuestDate) {
      let failed = false;
      Object.values(next.categories).forEach((category) => {
        if (!category.completedToday) {
          failed = true;
          applyFailure(category);
        }
        category.completedToday = false;
        category.actualToday = "";
      });
      if (failed) next.streak = 0;
    }

    next.lastQuestDate = today;
    return next;
  }

  function mutate(updater) {
    setState((current) => {
      const next = refreshForNewDay(current);
      updater(next);
      return next;
    });
  }

  function applyFailure(category) {
    category.consecutiveSuccess = 0;
    category.consecutiveFailures += 1;
    if (category.consecutiveFailures >= 5) {
      category.target = roundTarget(category.target * 1.1, category.unit);
    } else if (category.consecutiveFailures >= 3) {
      category.target = roundTarget(category.target * 1.05, category.unit);
    }
  }

  function awardXp(next, amount) {
    const earned = Math.max(0, Math.round(amount));
    next.xp += earned;
    next.totalXp += earned;

    while (next.level < 100 && next.xp >= xpRequired(next.level)) {
      next.xp -= xpRequired(next.level);
      next.level += 1;
      next.totalXp += 500;
      next.xp += 500;
    }
  }

  function progressCategory(next, key, category) {
    const currentRank = rankForLevel(next.level);

    if (key === "core") {
      category.target = roundTarget(category.target + 5, category.unit);
      if (category.target > 90) {
        category.sets = 2;
        category.target = Math.ceil(category.target / 2);
      }
      return;
    }

    if (key === "martial") {
      if (category.consecutiveSuccess % 3 === 0) category.target += 10;
      const moves = martialMoves[currentRank.name] || martialMoves.E;
      category.exercise = moves[Math.floor(category.consecutiveSuccess / 7) % moves.length];
      return;
    }

    if (key === "endurance") {
      category.target = roundTarget(category.target * Math.min(currentRank.multiplier, 1.014), category.unit);
      return;
    }

    category.target = roundTarget(category.target * currentRank.multiplier, category.unit);
    if (key === "strength" && category.consecutiveSuccess >= 3 && category.sets >= 3) {
      if (category.variationIndex < strengthLadder.length - 1) {
        category.variationIndex += 1;
        category.exercise = strengthLadder[category.variationIndex];
        category.target = Math.max(1, Math.floor(category.target * 0.7));
        category.sets = Math.max(1, category.sets - 1);
        category.difficulty += 0.35;
        category.consecutiveSuccess = 0;
        awardXp(next, 200);
      }
    } else if (category.consecutiveSuccess >= 3 && category.sets < 3) {
      category.sets += 1;
      category.consecutiveSuccess = 0;
    }
  }

  function completeCategory(key, actualValue) {
    mutate((next) => {
      const category = next.categories[key];
      const actual = Number(actualValue || 0);
      category.actualToday = String(actualValue || "");

      if (actual < Number(category.target)) {
        category.completedToday = false;
        next.streak = 0;
        applyFailure(category);
        return;
      }

      category.completedToday = true;
      category.consecutiveFailures = 0;
      category.consecutiveSuccess += 1;

      const exactBonus = actual === Number(category.target) ? 1.2 : 1;
      const exceedBonus = actual > Number(category.target) ? 1.5 : exactBonus;
      const streakBonus = 1 + Math.min(next.streak, 10) * 0.05;
      awardXp(next, Number(category.target) * category.difficulty * exceedBonus * streakBonus);
      progressCategory(next, key, category);

      if (Object.values(next.categories).every((item) => item.completedToday)) {
        next.streak += 1;
        next.history = [
          ...next.history,
          { date: todayKey(), xp: next.totalXp, completion: 100 },
        ].slice(-30);
      }
    });
  }

  function generateBaseline() {
    const pushups = Number(baseline.pushups);
    const squats = Number(baseline.squats);
    const plank = Number(baseline.plank);
    const mile = Number(baseline.mile);
    if ([pushups, squats, plank, mile].some((value) => !Number.isFinite(value) || value <= 0)) {
      Alert.alert("Invalid assessment", "Enter valid baseline numbers first.");
      return;
    }

    const runKm = mile <= 10 ? 1.6 : mile <= 15 ? 1.2 : 1;
    const next = clone(initialState);
    next.initialized = true;
    next.mode = mode;
    next.baseline = { ...baseline, rpe: Number(baseline.rpe) };
    next.categories.strength.target = Math.max(1, Math.floor(pushups * 0.8));
    next.categories.legs.target = Math.max(1, Math.floor(squats * 0.8));
    next.categories.core.target = Math.max(5, Math.floor(plank * 0.8));
    next.categories.endurance.target = runKm;
    next.categories.martial.target = mode === "martial" ? 60 : 50;
    if (mode === "strength") next.categories.strength.difficulty = 1.25;
    if (mode === "endurance") next.categories.endurance.difficulty = 1.25;
    if (mode === "martial") next.categories.martial.difficulty = 1.25;
    next.lastQuestDate = todayKey();
    setState(next);
    setAssessmentOpen(false);
    setScreen("quests");
  }

  function resetSystem() {
    Alert.alert("Reset ARISE?", "This clears all local progress.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          AsyncStorage.removeItem(STORAGE_KEY);
          setState(clone(initialState));
        },
      },
    ]);
  }

  if (!ready) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <View style={styles.loading}>
          <Text style={styles.logo}>ARISE</Text>
          <Text style={styles.muted}>Loading system...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Training System</Text>
          <Text style={styles.logo}>ARISE</Text>
        </View>
        <Pressable style={styles.rankBadge} onPress={() => setScreen("profile")}>
          <Text style={styles.rankText}>{rank.name}</Text>
          <Text style={styles.rankSub}>Lv {state.level}</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {!state.initialized ? (
          <View style={styles.heroCard}>
            <Text style={styles.eyebrow}>Baseline Required</Text>
            <Text style={styles.heroTitle}>Start at E-Rank</Text>
            <Text style={styles.bodyText}>
              Complete the first assessment. The system will create daily strength, endurance, core, and martial arts quests at 80% of your baseline.
            </Text>
            <Pressable style={styles.primaryButton} onPress={() => setAssessmentOpen(true)}>
              <Text style={styles.primaryText}>Run Assessment</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.statsGrid}>
          <Stat label="Rank" value={`${rank.name}-Rank`} />
          <Stat label="Streak" value={`${state.streak}`} />
          <Stat label="Today" value={`${completion}%`} />
          <Stat label="Next Rank" value={`${nextRankDistance}`} />
        </View>

        <View style={styles.xpCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>XP Progress</Text>
            <Text style={styles.muted}>{requiredXp === Infinity ? state.xp : `${state.xp} / ${requiredXp}`}</Text>
          </View>
          <ProgressBar value={requiredXp === Infinity ? 100 : (state.xp / requiredXp) * 100} />
        </View>

        {screen === "quests" ? <QuestScreen categories={categories} onComplete={completeCategory} /> : null}
        {screen === "profile" ? <ProfileScreen state={state} rank={rank} onReset={resetSystem} onAssessment={() => setAssessmentOpen(true)} /> : null}
        {screen === "library" ? <LibraryScreen /> : null}
      </ScrollView>

      <View style={styles.tabBar}>
        <Tab label="Quests" active={screen === "quests"} onPress={() => setScreen("quests")} />
        <Tab label="Library" active={screen === "library"} onPress={() => setScreen("library")} />
        <Tab label="System" active={screen === "profile"} onPress={() => setScreen("profile")} />
      </View>

      <AssessmentModal
        visible={assessmentOpen}
        baseline={baseline}
        setBaseline={setBaseline}
        mode={mode}
        setMode={setMode}
        onClose={() => setAssessmentOpen(false)}
        onSubmit={generateBaseline}
      />
    </SafeAreaView>
  );
}

function Stat({ label, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.muted}>{label}</Text>
    </View>
  );
}

function QuestScreen({ categories, onComplete }) {
  const [inputs, setInputs] = useState({});

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Daily Quests</Text>
      {categories.map(([key, category]) => (
        <View key={key} style={styles.questCard}>
          <View style={styles.rowBetween}>
            <View style={styles.flex}>
              <Text style={styles.eyebrow}>{category.label}</Text>
              <Text style={styles.cardTitle}>{category.exercise}</Text>
            </View>
            <Pill>{formatTarget(category)}</Pill>
          </View>
          <View style={styles.questMeta}>
            <Text style={styles.muted}>Success {category.consecutiveSuccess}</Text>
            <Text style={styles.muted}>Failures {category.consecutiveFailures}</Text>
            <Text style={category.completedToday ? styles.done : styles.pending}>
              {category.completedToday ? "Complete" : "Pending"}
            </Text>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              keyboardType="decimal-pad"
              placeholder="Actual"
              placeholderTextColor="#697083"
              value={inputs[key] ?? String(category.actualToday || category.target)}
              onChangeText={(value) => setInputs((current) => ({ ...current, [key]: value }))}
              style={styles.input}
            />
            <Pressable
              disabled={category.completedToday}
              style={[styles.primaryButton, category.completedToday && styles.disabledButton]}
              onPress={() => onComplete(key, inputs[key] ?? category.target)}
            >
              <Text style={styles.primaryText}>Submit</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}

function ProfileScreen({ state, rank, onReset, onAssessment }) {
  const failureTotal = Object.values(state.categories).reduce((sum, category) => sum + category.consecutiveFailures, 0);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>System</Text>
      <View style={styles.questCard}>
        <Text style={styles.cardTitle}>{rank.name}-Rank Protocol</Text>
        <Text style={styles.bodyText}>Total XP: {state.totalXp}</Text>
        <Text style={styles.bodyText}>Active failure pressure: {failureTotal}</Text>
        <Text style={styles.bodyText}>Mode: {state.mode}</Text>
      </View>
      <Pressable style={styles.secondaryButton} onPress={onAssessment}>
        <Text style={styles.secondaryText}>Retake Assessment</Text>
      </Pressable>
      <Pressable style={styles.dangerButton} onPress={onReset}>
        <Text style={styles.dangerText}>Reset System</Text>
      </Pressable>
    </View>
  );
}

function LibraryScreen() {
  const groups = [
    ["Strength", strengthLadder],
    ["Endurance", ["Walk/Run Intervals", "Continuous 1km", "3km", "5km", "10km", "Half-Marathon Pace", "Marathon Pace"]],
    ["E-Rank Martial", martialMoves.E],
    ["D-Rank Martial", martialMoves.D],
    ["C-Rank Martial", martialMoves.C],
    ["B+ Martial", [...martialMoves.B, ...martialMoves.A, ...martialMoves.S]],
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Move Library</Text>
      {groups.map(([title, moves]) => (
        <View key={title} style={styles.questCard}>
          <Text style={styles.cardTitle}>{title}</Text>
          {moves.map((move) => (
            <Text key={move} style={styles.bodyText}>• {move}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function Tab({ label, active, onPress }) {
  return (
    <Pressable style={[styles.tab, active && styles.activeTab]} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
    </Pressable>
  );
}

function AssessmentModal({ visible, baseline, setBaseline, mode, setMode, onClose, onSubmit }) {
  const fields = [
    ["pushups", "Max push-ups"],
    ["squats", "Max squats"],
    ["plank", "Plank seconds"],
    ["mile", "1 mile minutes"],
    ["rpe", "RPE 1-10"],
  ];
  const modes = ["balanced", "strength", "endurance", "martial"];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Assessment</Text>
            <Pressable onPress={onClose}>
              <Text style={styles.secondaryText}>Close</Text>
            </Pressable>
          </View>
          {fields.map(([key, label]) => (
            <View key={key} style={styles.field}>
              <Text style={styles.label}>{label}</Text>
              <TextInput
                keyboardType="decimal-pad"
                value={baseline[key]}
                onChangeText={(value) => setBaseline((current) => ({ ...current, [key]: value }))}
                style={styles.input}
              />
            </View>
          ))}
          <Text style={styles.label}>Training mode</Text>
          <View style={styles.modeGrid}>
            {modes.map((item) => (
              <Pressable key={item} style={[styles.modeButton, mode === item && styles.activeMode]} onPress={() => setMode(item)}>
                <Text style={[styles.modeText, mode === item && styles.activeModeText]}>{item}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.primaryButton} onPress={onSubmit}>
            <Text style={styles.primaryText}>Generate Day 1</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#090a0f",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  header: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#2c3040",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    padding: 18,
    paddingBottom: 108,
    gap: 14,
  },
  eyebrow: {
    color: "#e2b75b",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  logo: {
    color: "#f2f4f8",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0,
  },
  rankBadge: {
    minWidth: 64,
    minHeight: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2b75b",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#17141c",
  },
  rankText: {
    color: "#e2b75b",
    fontSize: 28,
    fontWeight: "900",
  },
  rankSub: {
    color: "#a6adbb",
    fontSize: 12,
  },
  heroCard: {
    borderWidth: 1,
    borderColor: "#3b3148",
    borderRadius: 8,
    backgroundColor: "#141620",
    padding: 18,
    gap: 12,
  },
  heroTitle: {
    color: "#f2f4f8",
    fontSize: 28,
    fontWeight: "900",
  },
  bodyText: {
    color: "#a6adbb",
    fontSize: 14,
    lineHeight: 21,
  },
  muted: {
    color: "#a6adbb",
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: "46%",
    borderWidth: 1,
    borderColor: "#2c3040",
    borderRadius: 8,
    backgroundColor: "#12141d",
    padding: 14,
  },
  statValue: {
    color: "#f2f4f8",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 4,
  },
  xpCard: {
    borderWidth: 1,
    borderColor: "#2c3040",
    borderRadius: 8,
    backgroundColor: "#12141d",
    padding: 14,
    gap: 10,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#07080d",
    borderWidth: 1,
    borderColor: "#2c3040",
  },
  progressFill: {
    height: "100%",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: "#f2f4f8",
    fontSize: 24,
    fontWeight: "900",
  },
  questCard: {
    borderWidth: 1,
    borderColor: "#2c3040",
    borderRadius: 8,
    backgroundColor: "#12141d",
    padding: 14,
    gap: 12,
  },
  cardTitle: {
    color: "#f2f4f8",
    fontSize: 18,
    fontWeight: "800",
  },
  pill: {
    borderWidth: 1,
    borderColor: "#3c4356",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillText: {
    color: "#d7dcea",
    fontSize: 12,
    fontWeight: "700",
  },
  questMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  done: {
    color: "#5fd38d",
    fontWeight: "800",
  },
  pending: {
    color: "#e2b75b",
    fontWeight: "800",
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 46,
    borderWidth: 1,
    borderColor: "#2c3040",
    borderRadius: 8,
    backgroundColor: "#090b11",
    color: "#f2f4f8",
    paddingHorizontal: 12,
  },
  primaryButton: {
    minHeight: 46,
    borderRadius: 8,
    backgroundColor: "#e2b75b",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  primaryText: {
    color: "#17120a",
    fontWeight: "900",
  },
  secondaryButton: {
    minHeight: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3c4356",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryText: {
    color: "#d7dcea",
    fontWeight: "800",
  },
  dangerButton: {
    minHeight: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ff5f6d",
    alignItems: "center",
    justifyContent: "center",
  },
  dangerText: {
    color: "#ff9ba4",
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.45,
  },
  tabBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 14,
    minHeight: 62,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2c3040",
    backgroundColor: "#12141d",
    flexDirection: "row",
    padding: 6,
    gap: 6,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#241d31",
  },
  tabText: {
    color: "#a6adbb",
    fontWeight: "800",
  },
  activeTabText: {
    color: "#e2b75b",
  },
  field: {
    gap: 7,
  },
  label: {
    color: "#d7dcea",
    fontWeight: "800",
  },
  modeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  modeButton: {
    borderWidth: 1,
    borderColor: "#2c3040",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  activeMode: {
    borderColor: "#e2b75b",
    backgroundColor: "#241d31",
  },
  modeText: {
    color: "#a6adbb",
    fontWeight: "800",
    textTransform: "capitalize",
  },
  activeModeText: {
    color: "#e2b75b",
  },
});
